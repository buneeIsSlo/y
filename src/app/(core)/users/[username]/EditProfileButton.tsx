"use client";

import { Button } from "@/components/ui/button";
import { UserData } from "@/lib/types";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";

interface EditProfileButtonProps {
  user: UserData;
}

export default function EditProfileButton({ user }: EditProfileButtonProps) {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  return (
    <>
      <Button variant={"outline"} onClick={() => setShowDialog(true)}>
        Edit profile
      </Button>
      <EditProfileModal
        user={user}
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </>
  );
}
