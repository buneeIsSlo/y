import UserButton from "@/components/UserButton";
import logo from "@/assets/y_light.svg";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function MobileTopNavbar() {
  return (
    <div className="sticky left-0 top-0 z-10 w-full bg-card/70 p-2 backdrop-blur-3xl sm:hidden">
      <div className="flex w-1/2 items-center justify-between">
        <div className="w-fit">
          <UserButton />
        </div>
        <Button
          variant={"ghost"}
          size={"icon"}
          className="w-fit p-0 hover:bg-transparent"
        >
          <Link
            href={"/"}
            className="flex items-center justify-center rounded-sm hover:bg-accent"
          >
            <Image
              src={logo}
              alt="y app"
              className="size-6 invert dark:invert-0"
            />
          </Link>
        </Button>
      </div>
    </div>
  );
}
