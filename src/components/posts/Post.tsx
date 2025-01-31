"use client";

import { PostData } from "@/lib/types";
import Link from "next/link";
import { cn, formatRelativeDate } from "@/lib/utils";
import { useSession } from "@/app/(core)/SessionProvider";
import PostOptionsButton from "./PostOptionsButton";
import Linkify from "../Linkify";
import UserTooltip from "../UserTooltip";
import UserAvatar from "../UserAvatar";
import { Media } from "@prisma/client";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import LikeButton from "./LikeButton";
import BookmarkButton from "./BookmarkButton";
import { Message } from "@mynaui/icons-react";
import { useState } from "react";
import Comments from "../comments/Comments";

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  const { user } = useSession();
  const [showComments, setShowComments] = useState(false);

  return (
    <article className="group/post space-y-3 rounded-3xl border bg-card/40 p-5 shadow-sm backdrop-blur-3xl">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <UserTooltip user={post.user}>
            <Link href={`/users/${post.user.username}`}>
              <UserAvatar user={post.user} />
            </Link>
          </UserTooltip>
          <div>
            <UserTooltip user={post.user}>
              <Link
                href={`/users/${post.user.username}`}
                className="block font-medium hover:underline"
              >
                {post.user.displayName}
              </Link>
            </UserTooltip>
            <Link
              href={`/posts/${post.id}`}
              className="block text-sm text-muted-foreground hover:underline"
              suppressHydrationWarning
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
      <Linkify>
        <div className="whitespace-pre-line break-words">{post.content}</div>
      </Linkify>
      {!!post.attachments.length && (
        <MediaPreviews attachments={post.attachments} />
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <LikeButton
            postId={post.id}
            initialState={{
              likes: post._count.likes,
              isLikedByUser: post.likes.some((like) => like.userId === user.id),
            }}
          />
          <CommentButton
            onClick={() => setShowComments(!showComments)}
            post={post}
          />
        </div>
        <BookmarkButton
          postId={post.id}
          initialState={{
            bookmarks: post._count.bookmarks,
            isBookmarkedByUser: post.bookmarks.some(
              (bookmark) => bookmark.userId === user.id,
            ),
          }}
        />
      </div>
      {showComments && <Comments post={post} />}
    </article>
  );
}

interface MediaPreviewsProps {
  attachments: Media[];
}

function MediaPreviews({ attachments }: MediaPreviewsProps) {
  if (attachments.length === 1) {
    return (
      <div className="relative mx-auto aspect-auto">
        <MediaPreview media={attachments[0]} />
      </div>
    );
  }

  return (
    <Carousel
      className="w-full"
      opts={{ align: "center", containScroll: "trimSnaps" }}
    >
      <CarouselContent className="-ml-2">
        {attachments.map((attachment) => (
          <CarouselItem
            key={attachment.id}
            className="grid w-fit place-content-center pl-2"
          >
            <MediaPreview media={attachment} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
}

interface MediaPreviewProps {
  media: Media;
  maintainSquareAspect?: boolean;
}

function MediaPreview({
  media,
  maintainSquareAspect = false,
}: MediaPreviewProps) {
  if (media.type === "IMAGE") {
    return (
      <Image
        src={media.url}
        alt="Attachment"
        width={0}
        height={0}
        sizes="100vw"
        className={cn(
          "mx-auto my-auto h-auto max-h-[30rem] w-fit rounded-2xl border",
          maintainSquareAspect && "aspect-square object-cover",
        )}
      />
    );
  }

  if (media.type === "VIDEO") {
    return (
      <div>
        <video
          src={media.url}
          controls
          className={cn(
            "aspect-auto h-auto max-h-[30rem] w-full rounded-2xl border",
            maintainSquareAspect && "aspect-square object-cover",
          )}
        />
      </div>
    );
  }

  return (
    <p className="rounded-full bg-destructive-foreground p-1 text-destructive">
      Unsupported media type
    </p>
  );
}

interface CommentButtonProps {
  post: PostData;
  onClick: () => void;
}

function CommentButton({ post, onClick }: CommentButtonProps) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-1 p-1 text-muted-foreground hover:text-primary"
    >
      <span className="relative grid place-content-center">
        <span className="absolute inset-0 -m-1.5 rounded-md group-hover:bg-primary/30" />
        <Message className={"size-5"} />
      </span>
      <span className={cn("text-sm font-medium tabular-nums")}>
        {post._count.comments}
      </span>
    </button>
  );
}
