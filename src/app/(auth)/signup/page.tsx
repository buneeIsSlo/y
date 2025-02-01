import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SignUpForm from "./SignUpForm";
import { Separator } from "@/components/ui/seperator";
import logo from "@/assets/y_light.svg";
import GoogleAuthButton from "../GoogleAuthButton";
import authImage from "@/assets/auth-image.webp";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function Signup() {
  return (
    <main className="min-h-dvh w-full lg:grid lg:grid-cols-2">
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
            <h1 className="text-3xl font-bold">Sign Up</h1>
            <p className="text-balance text-muted-foreground">
              Enter your details below to create a new account
            </p>
          </div>
          <div>
            <SignUpForm />
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
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Log In
            </Link>
          </div>
        </div>
      </div>
      <div
        className="hidden bg-muted lg:block"
        style={{
          backgroundImage: `url(${authImage.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden
      ></div>
    </main>
  );
}
