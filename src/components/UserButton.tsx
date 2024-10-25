"use client";

import { Button } from "./ui/button";
import { useSession } from "@/app/(core)/SessionProvider";
import { logout } from "@/app/(auth)/actions";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Ellipsis } from "lucide-react";

export default function UserButton() {
  const { user } = useSession();

  return (
    <Popover>
      <PopoverTrigger asChild className="w-full">
        <Button className="flex w-full justify-between py-8" variant={"ghost"}>
          <span className="flex gap-2">
            <Avatar className="border">
              <AvatarImage src={user.avatarUrl} alt={`@${user.displayName}`} />
              <AvatarFallback className="capitalize">
                {user.displayName.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <p className="flex flex-col gap-0.5">
              <span className="capitalize">
                <b>{user.displayName}</b>
              </span>
              <span className="text-gray-600">{`@${user.username}`}</span>
            </p>
          </span>
          <Ellipsis className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Button
          variant={"destructive"}
          onClick={() => logout}
          className="w-full"
        >
          Log out
        </Button>
      </PopoverContent>
    </Popover>
  );
}
