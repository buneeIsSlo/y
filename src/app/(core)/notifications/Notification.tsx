import UserAvatar from "@/components/UserAvatar";
import { NotificationData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { HeartSolid, Message, UserSolid } from "@mynaui/icons-react";
import { NotificationType } from "@prisma/client";
import Link from "next/link";

interface NotificationProps {
  notification: NotificationData;
}

export default function Notification({ notification }: NotificationProps) {
  const notificationTypeMap: Record<
    NotificationType,
    { message: string; icon: React.JSX.Element; href: string }
  > = {
    FOLLOW: {
      message: `${notification.issuer.displayName} started following you`,
      icon: <UserSolid className="size-7 text-primary" />,
      href: `/users/${notification.issuer.username}`,
    },
    COMMENT: {
      message: `${notification.issuer.displayName} commented on your post`,
      icon: <Message className="size-7 text-primary" />,
      href: `/posts/${notification.postId}`,
    },
    LIKE: {
      message: `${notification.issuer.displayName} liked your post`,
      icon: <HeartSolid className="size-7 text-rose-600" />,
      href: `/posts/${notification.postId}`,
    },
  };

  const { message, icon, href } = notificationTypeMap[notification.type];

  return (
    <Link href={href} className="block">
      <article
        className={cn(
          "flex gap-3 rounded-2xl border bg-card px-5 py-5 transition-colors hover:bg-card/50",
          !notification.read && "bg-primary/20",
        )}
      >
        <div className="my-1">{icon}</div>
        <div className="space-y-3">
          <UserAvatar user={notification.issuer} />
          <div>
            <span className="font-bold">{`@${notification.issuer.username}`}</span>{" "}
            <span>{message}</span>
          </div>
          {notification.post && (
            <div className="line-clamp-3 whitespace-pre-line text-muted-foreground">
              {notification.post.content}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
