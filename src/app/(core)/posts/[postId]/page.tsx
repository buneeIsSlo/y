import { validateRequest } from "@/auth";
import FollowButton from "@/components/FollowButton";
import Linkify from "@/components/Linkify";
import NavigateBackButton from "@/components/NavigateBackButton";
import Post from "@/components/posts/Post";
import UserAvatar from "@/components/UserAvatar";
import UserTooltip from "@/components/UserTooltip";
import prisma from "@/lib/prisma";
import { getPostDataInclude, UserData } from "@/lib/types";
import { Spinner } from "@mynaui/icons-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";

interface PageProps {
  params: Promise<{ postId: string }>;
}

const getPost = cache(async (postId: string, loggedInUserId: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: getPostDataInclude(loggedInUserId),
  });

  if (!post) notFound();

  return post;
});

export async function generateMetadata(props: PageProps) {
  const { user } = await validateRequest();

  if (!user) return {};

  const params = await props.params;
  const { postId } = params;
  const post = await getPost(postId, user.id);

  return { title: `${post.user.displayName}: ${post.content.slice(0, 20)}...` };
}

export default async function Page(props: PageProps) {
  const { user } = await validateRequest();

  if (!user) {
    return (
      <p className="text-destructive">
        You&apos;re not authorized to view this page.
      </p>
    );
  }
  const params = await props.params;
  const { postId } = params;
  const post = await getPost(postId, user.id);

  return (
    <main className="flex h-[200vh] w-full min-w-0 gap-4">
      <div className="w-full min-w-0">
        <div className="mb-2 flex items-center gap-5 rounded-2xl border bg-card px-3 py-2">
          <NavigateBackButton fallbackRoute={`/users/${post.user.username}`} />
          <p className="text-xl font-bold">Post</p>
        </div>
        <Post post={post} />
      </div>
      <div className="relative hidden flex-shrink-0 lg:block lg:w-80">
        <div className="sticky top-0 h-svh w-full">
          <Suspense fallback={<Spinner className="mx-auto animate-spin" />}>
            <UserInfoSidebar user={post.user} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

interface UserInfoSidebarProps {
  user: UserData;
}

async function UserInfoSidebar({ user }: UserInfoSidebarProps) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return null;

  return (
    <div className="space-y-5 rounded-2xl border bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Relevant people</div>
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
            <p className="line-clamp-1 break-all text-muted-foreground">
              {user.username}
            </p>
          </div>
        </Link>
      </UserTooltip>
      <Linkify>
        <div className="line-clamp-6 whitespace-pre-line break-words text-muted-foreground">
          {user.bio}
        </div>
      </Linkify>
      {user.id !== loggedInUser.id && (
        <FollowButton
          userId={user.id}
          initialState={{
            followers: user._count.followers,
            isFollowedByUser: user.followers.some(
              ({ followerId }) => followerId === loggedInUser.id,
            ),
          }}
        />
      )}
    </div>
  );
}
