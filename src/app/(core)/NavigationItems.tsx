"use client";

import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Bookmark,
  BookmarkSolid,
  Home,
  HomeSolid,
  Cog,
  CogSolid,
  Envelope,
  EnvelopeSolid,
  Bell,
  BellSolid,
  User,
  UserSolid,
} from "@mynaui/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NotificationsButton from "./NotificationsButton";
import { NotificationCountInfo } from "@/lib/types";

type Icon =
  | "home"
  | "notifications"
  | "messages"
  | "bookmarks"
  | "profile"
  | "settings";

export interface NavItem {
  title: string;
  url: string;
  icon: Icon;
  isNotification?: boolean;
}

interface NavigationItemsProps {
  items: NavItem[];
  unreadNotificationsCount: NotificationCountInfo;
}

const ICON_MAP: Record<
  Icon,
  { outline: React.ElementType; solid: React.ElementType }
> = {
  home: { outline: Home, solid: HomeSolid },
  notifications: { outline: Bell, solid: BellSolid },
  messages: { outline: Envelope, solid: EnvelopeSolid },
  bookmarks: { outline: Bookmark, solid: BookmarkSolid },
  profile: { outline: User, solid: UserSolid },
  settings: { outline: Cog, solid: CogSolid },
} as const;

export default function NavigationItems({
  items,
  unreadNotificationsCount,
}: NavigationItemsProps) {
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <ul className="space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.url;
          const IconComponent = isActive
            ? ICON_MAP[item.icon].solid
            : ICON_MAP[item.icon].outline;

          return (
            <li key={item.title}>
              <Tooltip>
                <TooltipTrigger className="w-full">
                  {item.isNotification ? (
                    <NotificationsButton
                      initialState={unreadNotificationsCount}
                      icon={
                        <IconComponent
                          className={cn("size-5", isActive && "text-primary")}
                        />
                      }
                      title={
                        <span
                          className={cn(
                            "hidden lg:inline",
                            isActive && "font-semibold text-primary",
                          )}
                        >
                          {item.title}
                        </span>
                      }
                    />
                  ) : (
                    <Button
                      variant="ghost"
                      className="my-1 items-center justify-start py-6 lg:w-full"
                      asChild
                    >
                      <Link href={item.url} className="flex gap-2">
                        <IconComponent
                          className={cn("size-5", isActive && "text-primary")}
                        />
                        <span
                          className={cn(
                            "hidden lg:inline",
                            isActive && "font-semibold text-primary",
                          )}
                        >
                          {item.title}
                        </span>
                      </Link>
                    </Button>
                  )}
                </TooltipTrigger>
                <TooltipContent className="lg:hidden" side="right">
                  {item.title}
                </TooltipContent>
              </Tooltip>
            </li>
          );
        })}
      </ul>
    </TooltipProvider>
  );
}
