"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ArrowLeft } from "@mynaui/icons-react";

export default function NavigateBackButton() {
  const router = useRouter();
  function handleClick() {
    router.back();
  }

  return (
    <Button size={"icon"} variant={"ghost"} onClick={handleClick}>
      <ArrowLeft className="size-6" />
    </Button>
  );
}
