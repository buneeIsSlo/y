import { PostData } from "@/lib/types";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatRelativeDate } from "@/lib/utils";

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  return (
    <article className="space-y-3 rounded-2xl border bg-card p-5 shadow-sm">
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
            {/* {formatRelativeDate(post.createdAt)} */}
          </Link>
        </div>
      </div>
      <div className="whitespace-pre-line break-words">{post.content}</div>
    </article>
  );
}
