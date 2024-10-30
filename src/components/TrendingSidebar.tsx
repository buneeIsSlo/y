import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { userDataSelect } from "@/lib/types";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { unstable_cache } from "next/cache";
import { formatNumber } from "@/lib/utils";
import { Suspense } from "react";
import { Skeleton } from "./ui/skeleton";

export default function TrendingSidebar() {
  return (
    <div className="relative hidden lg:block lg:w-52">
      <div className="sticky top-0 h-svh w-full py-6">
        <Suspense fallback={<TrendingSidebarSkeleton />}>
          <WhoToFollow />
          <TrendingTopics />
        </Suspense>
      </div>
    </div>
  );
}

function TrendingSidebarSkeleton() {
  return (
    <div className="space-y-6">
      {/* Who to follow section */}
      <div className="w-full space-y-5 rounded-2xl border bg-card p-5 shadow-sm">
        <Skeleton className="h-6 w-32" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>

      {/* Trending topics section */}
      <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
        <Skeleton className="h-6 w-32" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}

async function WhoToFollow() {
  const { user } = await validateRequest();
  // await new Promise((res) => setTimeout(res, 10000));

  if (!user) return null;

  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: user.id,
      },
    },
    select: userDataSelect,
    take: 5,
  });

  return (
    <div className="w-full space-y-5 rounded-2xl border bg-card p-5 shadow-sm">
      <h2 className="text-lg font-bold">Who to follow</h2>
      <div>
        {usersToFollow.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between gap-3"
          >
            <Link
              href={`/users/${user.username}`}
              className="flex items-center gap-3"
            >
              <Avatar>
                <AvatarImage src={user.avatarUrl} alt={`@${user.username}`} />
                <AvatarFallback className="uppercase">
                  {user.displayName.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="line-clamp-1 break-all font-semibold hover:underline">
                  {user.displayName}
                </p>
                <p className="line-clamp-1 break-all text-muted-foreground">{`@${user.username}`}</p>
              </div>
            </Link>
            <Button>Follow</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

const getTrendingTopics = unstable_cache(
  async () => {
    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
    SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
    FROM posts
    GROUP BY (hashtag)
    ORDER BY count DESC, hashtag ASC
    LIMIT 5
`;

    return result.map((row) => ({
      hashtag: row.hashtag,
      count: Number(row.count),
    }));
  },

  ["trending_topic"],

  { revalidate: 3 * 60 * 60 },
);

async function TrendingTopics() {
  const trendingTopics = await getTrendingTopics();

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <h2 className="text-lg font-bold">Trending topics</h2>
      <div>
        {trendingTopics.map(({ hashtag, count }) => {
          const topic = hashtag.split("#")[1];

          return (
            <Link key={topic} href={`/trending/${topic}`}>
              <p
                className="line-clamp-1 break-all font-semibold hover:underline"
                title={topic}
              >
                {hashtag}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatNumber(count)} {count === 1 ? "post" : "posts"}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
