import { validateRequest } from "@/auth";
import FollowButton from "@/components/FollowButton";
import FollowerCount from "@/components/FollowerCount";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { FollowerInfo, getUserDataSelect, UserData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import UserPostsFeed from "./UserPostsFeed";

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

export async function generateMetaData(props: PageProps): Promise<Metadata> {
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
    <main className="w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />
        <UserPostsFeed userId={user.id} />
      </div>
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
    <div className="mt-2 w-full">
      <div className="bg-card">
        <div className="flex flex-col space-y-3">
          <div className="flex items-start justify-between">
            <Avatar className="grid size-20 place-content-center border">
              <AvatarImage src={user.avatarUrl} alt={`@${user.username}`} />
              <AvatarFallback className="capitalize">
                {user.username.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            {user.id === loggedInUserId ? (
              <Button variant={"outline"}>Edit Profile</Button>
            ) : (
              <FollowButton userId={user.id} initialState={followerInfo} />
            )}
          </div>
          <div>
            <h1 className="font-bold">{user.displayName}</h1>
            <p className="text-gray-300">@{user.username}</p>
            <span className="text-sm text-muted-foreground">
              Posts: {formatNumber(user._count.posts)}
            </span>
          </div>
          <div>
            <FollowerCount userId={user.id} initialState={followerInfo} />
          </div>
        </div>
      </div>
    </div>
  );
}
