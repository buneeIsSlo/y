import { validateRequest } from "@/auth";
import FollowButton from "@/components/FollowButton";
import FollowerCount from "@/components/FollowerCount";
import TrendingSidebar from "@/components/TrendingSidebar";
import UserAvatar from "@/components/UserAvatar";
import prisma from "@/lib/prisma";
import { FollowerInfo, getUserDataSelect, UserData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import EditProfileButton from "./EditProfileButton";
import UserPostsFeed from "./UserPostsFeed";
import NavigateBackButton from "@/components/NavigateBackButton";
import Linkify from "@/components/Linkify";

interface PageProps {
  params: Promise<{ username: string }>;
}

const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedInUserId),
  });

  if (!user) notFound();

  return user;
});

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const { username } = params;
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return {};

  const user = await getUser(username, loggedInUser.id);

  return {
    title: `${user.displayName} (@${user.username})`,
  };
}

export default async function Page(props: PageProps) {
  const params = await props.params;

  const { username } = params;

  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return (
      <div>
        <p className="text-destructive">
          You&apos;re not authorized to view this page.
        </p>
      </div>
    );
  }

  const user = await getUser(username, loggedInUser.id);

  return (
    <main className="flex gap-4">
      <div className="w-full min-w-0 space-y-4 py-4 sm:max-w-[600px] xl:max-w-none">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />
        <UserPostsFeed userId={user.id} />
      </div>
      <TrendingSidebar />
    </main>
  );
}

interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}

async function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUserId,
    ),
  };

  return (
    <div>
      <div className="mb-2 flex items-center gap-5 rounded-2xl border bg-card/70 px-3 py-1 backdrop-blur-3xl">
        <NavigateBackButton />
        <div className="">
          <h1 className="text-xl font-bold">{user.displayName}</h1>
          <p className="text-sm text-muted-foreground">
            {formatNumber(user._count.posts)} posts
          </p>
        </div>
      </div>
      <div className="w-full overflow-clip rounded-3xl border bg-card p-2">
        <div className="">
          <div
            className="mb-2 h-32 w-full rounded-2xl bg-primary"
            role="presentation"
          ></div>
          <div className="flex flex-col space-y-3">
            <div className="relative flex items-start justify-between">
              <UserAvatar
                user={user}
                className="absolute bottom-0 left-5 size-24 border-spacing-0 border-4 border-card"
              />
              <div className="ml-auto">
                {user.id === loggedInUserId ? (
                  <EditProfileButton user={user} />
                ) : (
                  <FollowButton userId={user.id} initialState={followerInfo} />
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 px-3">
              <div>
                <h1 className="text-xl font-bold">{user.displayName}</h1>
                <p className="text-muted-foreground">@{user.username}</p>
              </div>
              {user.bio && (
                <Linkify>
                  <div className="breakwords overflow-clip whitespace-pre-line">
                    {user.bio}
                  </div>
                </Linkify>
              )}
              <div className="pb-2">
                <FollowerCount userId={user.id} initialState={followerInfo} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
