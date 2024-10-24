"use client";

import { Button } from "./ui/button";
import { useSession } from "@/app/(core)/SessionProvider";
import { logout } from "@/app/(auth)/actions";

export default function UserButton() {
  const { user } = useSession();

  return (
    <div>
      <p>{user.username}</p>
      <Button
        variant={"destructive"}
        onClick={() => {
          logout();
        }}
      >
        Log out
      </Button>
    </div>
  );
}
