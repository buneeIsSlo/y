import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";
import FollowButton from "./FollowButton";
import { Skeleton } from "./ui/skeleton";
import UserAvatar from "./UserAvatar";
import UserTooltip from "./UserTooltip";
import SearchField from "./SearchField";

export default function TrendingSidebar() {
  return (
    <div className="relative hidden flex-shrink-0 lg:w-80 xl:block">
      <div className="sticky top-0 h-svh w-full py-4">
        <div>
          <Suspense fallback={<TrendingSidebarSkeleton />}>
            <div className="flex flex-col gap-4">
              <SearchField />
              <WhoToFollow />
              <TrendingTopics />
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function TrendingSidebarSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* Search field skeleton */}
      <Skeleton className="h-10 w-full rounded-2xl" />

      {/* Who to follow section */}
      <div className="w-full space-y-5 rounded-3xl border bg-card/40 p-5 shadow-sm backdrop-blur-3xl">
        <Skeleton className="h-6 w-32" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-9 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Trending topics section */}
      <div className="space-y-5 rounded-3xl border bg-card/40 p-5 shadow-sm backdrop-blur-3xl">
        <Skeleton className="h-6 w-32" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

async function WhoToFollow() {
  const { user } = await validateRequest();

  if (!user) return null;

  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: user.id,
      },
      followers: {
        none: {
          followerId: user.id,
        },
      },
    },
    select: getUserDataSelect(user.id),
    take: 3,
  });

  if (!usersToFollow.length) return;

  return (
    <div className="w-full space-y-5 rounded-3xl border bg-card/40 p-5 shadow-sm backdrop-blur-3xl">
      <h2 className="text-lg font-bold">Who to follow</h2>
      <div className="flex flex-col gap-3">
        {usersToFollow.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between gap-3"
          >
            <UserTooltip user={user}>
              <Link
                href={`/users/${user.username}`}
                className="flex items-center gap-3"
              >
                <UserAvatar user={user} />
                <div>
                  <p className="line-clamp-1 break-all font-semibold hover:underline">
                    {user.displayName}
                  </p>
                  <p className="line-clamp-1 break-all text-muted-foreground">{`@${user.username}`}</p>
                </div>
              </Link>
            </UserTooltip>

            <FollowButton
              userId={user.id}
              initialState={{
                followers: user._count.followers,
                isFollowedByUser: user.followers.some(
                  ({ followerId }) => followerId === user.id,
                ),
              }}
            />
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
    LIMIT 4
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
    <div className="space-y-5 rounded-3xl border bg-card/40 p-5 shadow-sm backdrop-blur-3xl">
      <h2 className="text-lg font-bold">Trending topics</h2>
      {!trendingTopics.length && (
        <p className="text-muted-foreground">Not enough topics to show</p>
      )}
      <div className="flex flex-col gap-3">
        {trendingTopics.map(({ hashtag, count }) => {
          const topic = hashtag.split("#")[1];

          return (
            <Link key={topic} href={`/topic/${topic}`}>
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
