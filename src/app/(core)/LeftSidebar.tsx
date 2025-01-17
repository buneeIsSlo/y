import { Home, Envelope, Calendar, Bookmark, Cog } from "@mynaui/icons-react";
import { Button } from "@/components/ui/button";
import UserButton from "@/components/UserButton";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import NotificationsButton from "./NotificationsButton";

export default async function LeftSidebar() {
  const { user } = await validateRequest();

  if (!user) return;

  const unreadNotificationsCount = await prisma.notification.count({
    where: {
      recipientId: user.id,
      read: false,
    },
  });

  const items = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Notifications",
      url: "/notifications",
      component: (
        <NotificationsButton
          initialState={{ unreadCount: unreadNotificationsCount }}
        />
      ),
    },
    {
      title: "Messages",
      url: "/messages",
      icon: Envelope,
    },
    {
      title: "Calendar",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Bookmarks",
      url: "/bookmarks",
      icon: Bookmark,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Cog,
    },
  ];

  return (
    <div className="relative w-fit lg:w-80">
      <div className="sticky top-0 h-svh w-fit py-4 pl-4 lg:block lg:w-full lg:pl-0">
        <div className="flex h-full w-full flex-col justify-between rounded-3xl border bg-card/40 px-2 py-4 backdrop-blur-3xl">
          <TooltipProvider>
            <ul className="w-fit lg:w-full">
              {items.map((item) => (
                <li key={item.title}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {item.component ? (
                        item.component
                      ) : (
                        <Button
                          variant={"ghost"}
                          className="my-1 items-center justify-start py-6 lg:w-full"
                          asChild
                        >
                          <Link href={item.url} className="flex gap-2">
                            <item.icon className="h-5 w-5 stroke-2" />
                            <span className="hidden lg:inline">
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
              ))}
            </ul>
          </TooltipProvider>
          <div>
            <ThemeSwitcher />
            <UserButton />
          </div>
        </div>
      </div>
    </div>
  );
}
