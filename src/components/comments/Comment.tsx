import { CommentData } from "@/lib/types";
import UserTooltip from "../UserTooltip";
import UserAvatar from "../UserAvatar";
import Link from "next/link";
import { formatRelativeDate } from "@/lib/utils";

interface CommentProps {
  comment: CommentData;
}

export default function Comment({ comment }: CommentProps) {
  return (
    <div className="group/comment flex gap-3 py-3">
      <UserTooltip user={comment.user}>
        <Link href={`/users/${comment.user.username}`}>
          <UserAvatar user={comment.user} />
        </Link>
      </UserTooltip>
      <div>
        <div className="flex items-center gap-1 text-sm">
          <UserTooltip user={comment.user}>
            <Link
              href={`/users/${comment.user.username}`}
              className="hover:underline"
            >
              {comment.user.displayName}
            </Link>
          </UserTooltip>
          <span className="text-muted-foreground">
            {formatRelativeDate(comment.createdAt)}
          </span>
        </div>
        <div>{comment.content}</div>
      </div>
    </div>
  );
}
