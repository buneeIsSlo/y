import { Button } from "@/components/ui/button";
import UserButton from "@/components/UserButton";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import Image from "next/image";
import logo from "@/assets/y_light.svg";
import Link from "next/link";
import NavigationItems, { NavItem } from "./NavigationItems";

export default async function LeftSidebar() {
  const { user } = await validateRequest();

  if (!user) return;

  const unreadNotificationsCount = await prisma.notification.count({
    where: {
      recipientId: user.id,
      read: false,
    },
  });

  const NAV_ITEMS: NavItem[] = [
    {
      title: "Home",
      url: "/",
      icon: "home",
    },

    {
      title: "Notifications",
      url: "/notifications",
      icon: "notifications",
      isNotification: true,
    },

    {
      title: "Messages",
      url: "/messages",
      icon: "messages",
    },

    {
      title: "Bookmarks",
      url: "/bookmarks",
      icon: "bookmarks",
    },

    {
      title: "Profile",
      url: `/users/${user.username}`,
      icon: "profile",
    },

    {
      title: "Settings",
      url: "/settings",
      icon: "settings",
    },
  ];

  return (
    <div className="relative z-10 lg:w-80">
      <div className="sticky top-0 hidden h-svh w-fit py-4 pl-4 sm:block sm:w-fit lg:block lg:w-full lg:pl-0">
        <div className="flex h-full w-full flex-col justify-between rounded-3xl border bg-card/40 px-2 py-4 shadow-sm backdrop-blur-3xl">
          <ul className="w-fit lg:w-full">
            <li className="my-1">
              <Button variant={"ghost"} className="py-6 lg:w-fit">
                <Link
                  href={"/"}
                  className="flex items-center justify-center rounded-sm hover:bg-accent"
                >
                  <Image
                    src={logo}
                    alt="y app"
                    className="size-5 invert dark:invert-0 lg:size-7"
                  />
                </Link>
              </Button>
            </li>
            <NavigationItems
              items={NAV_ITEMS}
              unreadNotificationsCount={{
                unreadCount: unreadNotificationsCount,
              }}
              tooltipSide="right"
              className="w-full"
            />
          </ul>
          <div>
            <UserButton />
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full sm:hidden">
        <ul className="w-full bg-card/70 backdrop-blur-3xl">
          <NavigationItems
            items={NAV_ITEMS}
            unreadNotificationsCount={{
              unreadCount: unreadNotificationsCount,
            }}
            tooltipSide="top"
            className="flex w-full justify-between"
          />
        </ul>
      </div>
    </div>
  );
}
