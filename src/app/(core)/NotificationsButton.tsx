"use client";

import { Button } from "@/components/ui/button";
import kyInstance from "@/lib/ky";
import { NotificationCountInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface NotificationsButtonProps {
  initialState: NotificationCountInfo;
  icon: React.ReactElement;
  title: React.ReactElement;
}

export default function NotificationsButton({
  initialState,
  icon,
  title,
}: NotificationsButtonProps) {
  const { data } = useQuery({
    queryKey: ["unread-notifications-count"],
    queryFn: () =>
      kyInstance
        .get("/api/notifications/unread-count")
        .json<NotificationCountInfo>(),
    initialData: initialState,
    refetchInterval: 60 * 1000,
  });

  return (
    <Button
      variant={"ghost"}
      className="my-1 items-center justify-start py-6 lg:w-full"
      asChild
    >
      <Link href={"/notifications"} className="flex gap-2">
        <div className="relative">
          {icon}
          {!!data.unreadCount && (
            <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground">
              {data.unreadCount}
            </span>
          )}
        </div>
        {title}
      </Link>
    </Button>
  );
}
