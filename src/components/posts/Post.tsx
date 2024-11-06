"use client";

import { PostData } from "@/lib/types";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatRelativeDate } from "@/lib/utils";
import { useSession } from "@/app/(core)/SessionProvider";
import PostOptionsButton from "./PostOptionsButton";

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  const { user } = useSession();

  return (
    <article className="group/post space-y-3 rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <Link href={`/users/${post.user.username}`}>
            <Avatar className="">
              <AvatarImage
                src={post.user.avatarUrl}
                alt={`@${post.user.username}`}
              />
              <AvatarFallback className="capitalize">
                {post.user.displayName.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link
              href={`/users/${post.user.username}`}
              className="block font-medium hover:underline"
            >
              {post.user.displayName}
            </Link>
            <Link
              href={`/post/${post.id}`}
              className="block text-sm text-muted-foreground hover:underline"
            >
              {formatRelativeDate(post.createdAt)}
            </Link>
          </div>
        </div>
        {post.user.id === user.id && (
          <PostOptionsButton
            post={post}
            className="opacity-0 group-hover/post:opacity-100"
          />
        )}
      </div>
      <div className="whitespace-pre-line break-words">{post.content}</div>
    </article>
  );
}
