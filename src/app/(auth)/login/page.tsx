import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import logo from "@/assets/yellow-logo.svg";
import LoginForm from "./LoginForm";
import GoogleSignInButton from "./google/GoogleSignInButton";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <main className="mx-auto mt-10 flex max-w-[50rem] flex-col p-6 md:pt-12">
      <div className="relative h-32 w-4/5 md:w-2/3 md:-translate-x-40">
        <Image
          src={logo}
          alt="logo"
          priority
          fill
          className="-rotate-12 md:-rotate-[15deg]"
        />
      </div>
      <div className="mx-auto mt-14 text-xl font-light md:mt-20 md:text-2xl">
        Log in to your account
      </div>
      <div className="mx-auto mt-10 w-full md:max-w-[30rem]">
        <GoogleSignInButton />
        <div className="my-8 flex items-center gap-2">
          <div className="h-px flex-1 bg-muted-foreground" />
          <span className="text-foreground">or</span>
          <div className="h-px flex-1 bg-muted-foreground" />
        </div>
      </div>
      <LoginForm />
      <Link
        href="/signup"
        className="mx-auto mt-4 w-fit text-sm underline-offset-2 hover:underline"
      >
        Don&apos;t have an account? Sign up
      </Link>
    </main>
  );
}
