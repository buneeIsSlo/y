import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserButton from "@/components/UserButton";
import ThemeSwitcher from "@/components/ThemeSwitcher";

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export default function LeftSidebar() {
  return (
    <div className="relative w-[20rem]">
      <div className="sticky top-0 hidden h-svh w-full py-6 lg:block">
        <div className="flex h-full w-full flex-col justify-between">
          <ul className="w-full">
            {items.map((item) => (
              <li key={item.title}>
                <Button variant={"ghost"} className="w-full justify-start py-6">
                  <a href={item.url} className="flex gap-2">
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </a>
                </Button>
              </li>
            ))}
          </ul>
          <div>
            <ThemeSwitcher />
            <UserButton />
          </div>
        </div>
      </div>
    </div>
  );
}
