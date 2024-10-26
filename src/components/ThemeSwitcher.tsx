"use client";

import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Skeleton } from "./ui/skeleton";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="ml-auto grid w-fit grid-cols-3 gap-0.5 rounded-full border">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="ml-auto grid w-fit flex-shrink grid-cols-3 rounded-full border">
      <span className="sr-only">switch theme</span>
      <Button
        variant={theme === "system" ? "outline" : "ghost"}
        size={"icon"}
        title="system"
        className="rounded-full border-primary"
        onClick={() => setTheme("system")}
      >
        <Monitor
          className={cn("size-4", theme !== "system" && "text-gray-400")}
        />
      </Button>
      <Button
        variant={theme === "light" ? "outline" : "ghost"}
        size={"icon"}
        title="light"
        className="rounded-full border-primary"
        onClick={() => setTheme("light")}
      >
        <Sun className={cn("size-4", theme !== "light" && "text-gray-400")} />
      </Button>
      <Button
        variant={theme === "dark" ? "outline" : "ghost"}
        size={"icon"}
        title="dark"
        className="rounded-full border-primary"
        onClick={() => setTheme("dark")}
      >
        <Moon className={cn("size-4", theme !== "dark" && "text-gray-400")} />
      </Button>
    </div>
  );
}
