"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ArrowLeft } from "@mynaui/icons-react";

interface NavigateBackButtonProps {
  fallbackRoute?: string;
}

export default function NavigateBackButton({
  fallbackRoute = "/",
}: NavigateBackButtonProps) {
  const router = useRouter();

  function handleClick() {
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push(fallbackRoute);
    }
  }

  return (
    <Button size={"icon"} variant={"ghost"} onClick={handleClick}>
      <ArrowLeft className="size-6" />
    </Button>
  );
}
