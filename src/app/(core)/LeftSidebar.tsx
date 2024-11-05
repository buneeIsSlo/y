import {
  Home,
  Bell,
  Envelope,
  Calendar,
  Bookmark,
  Cog,
} from "@mynaui/icons-react";
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

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
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

export default function LeftSidebar() {
  return (
    <div className="relative w-fit lg:w-80">
      <div className="fixed left-0 top-0 -z-10 h-full w-[200%] bg-gradient-to-r from-primary/10 via-accent/10 to-transparent" />
      <div className="sticky top-0 h-svh w-fit border bg-card/40 px-2 py-6 backdrop-blur-xl lg:block lg:w-full">
        <div className="flex h-full w-full flex-col justify-between">
          <TooltipProvider>
            <ul className="w-fit lg:w-full">
              {items.map((item) => (
                <li key={item.title}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={"ghost"}
                        className="w-fit items-center justify-start py-6 lg:w-full"
                      >
                        <Link href={item.url} className="flex gap-2">
                          <item.icon className="h-5 w-5" />
                          <span className="hidden lg:inline">{item.title}</span>
                        </Link>
                      </Button>
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
