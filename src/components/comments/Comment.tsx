import { CommentData } from "@/lib/types";
import UserTooltip from "../UserTooltip";
import UserAvatar from "../UserAvatar";
import Link from "next/link";
import { formatRelativeDate } from "@/lib/utils";
import CommentOptionsButton from "./CommentOptionsButton";
import { useSession } from "@/app/(core)/SessionProvider";

interface CommentProps {
  comment: CommentData;
}

export default function Comment({ comment }: CommentProps) {
  const { user } = useSession();

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
      {comment.user.id === user.id && (
        <CommentOptionsButton
          comment={comment}
          className="ms-auto opacity-0 transition-opacity group-hover/comment:opacity-100"
        />
      )}
    </div>
  );
}
