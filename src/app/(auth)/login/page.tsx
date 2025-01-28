import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "./LoginForm";
import { Separator } from "@/components/ui/seperator";
import GoogleAuthButton from "../GoogleAuthButton";
import logo from "@/assets/y_light.svg";

export const metadata: Metadata = {
  title: "Log In",
};

export default function Login() {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <div className="mb-4 flex items-center justify-center">
              <Image
                src={logo}
                alt="y app"
                className="invert dark:invert-0 lg:size-8"
              />
            </div>
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <div>
            <LoginForm />
            <Separator
              label={
                <div className="rounded-full border border-dashed px-4 py-1">
                  or
                </div>
              }
              className="my-7 h-[0.5px]"
            />
            <GoogleAuthButton />
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
