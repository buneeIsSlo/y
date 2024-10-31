"use client";

import { Button } from "./ui/button";
import { useSession } from "@/app/(core)/SessionProvider";
import { logout } from "@/app/(auth)/actions";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Ellipsis } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function UserButton() {
  const { user } = useSession();
  const queryClient = useQueryClient();

  return (
    <Popover>
      <PopoverTrigger asChild className="w-full flex-grow">
        <Button
          className="relative mx-auto flex w-fit justify-between p-0 lg:w-full lg:px-4 lg:py-8"
          variant={"ghost"}
        >
          <span className="flex gap-2">
            <Avatar className="border">
              <AvatarImage src={user.avatarUrl} alt={`@${user.displayName}`} />
              <AvatarFallback className="capitalize">
                {user.displayName.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <p className="hidden flex-col gap-0.5 lg:flex">
              <span className="capitalize">
                <b>{user.displayName}</b>
              </span>
              <span className="text-gray-600">{`@${user.username}`}</span>
            </p>
          </span>
          <Ellipsis className="hidden h-5 w-5 lg:inline" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Button
          variant={"destructive"}
          onClick={() => {
            queryClient.clear();
            logout();
          }}
          className="w-full"
        >
          Log out
        </Button>
      </PopoverContent>
    </Popover>
  );
}
