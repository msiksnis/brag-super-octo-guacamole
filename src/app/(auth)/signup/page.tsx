import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import logo from "@/assets/yellow-logo.svg";
import SignUpForm from "./SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Sign up for an account",
};

export default function SignUpPage() {
  return (
    <main className="flex flex-col p-6 max-w-[50rem] mx-auto mt-10 md:pt-12">
      <div className="w-4/5 md:w-2/3 h-32 md:-translate-x-40 relative">
        <Image
          src={logo}
          alt="logo"
          priority
          fill
          className="-rotate-12 md:-rotate-[15deg]"
        />
      </div>
      <div className="mx-auto mt-14 text-xl md:text-2xl font-light">
        Register for a new account
      </div>
      <SignUpForm />
      <Link
        href="/login"
        className="mx-auto w-fit hover:underline underline-offset-2 text-sm mt-4"
      >
        Already have an account? Log in
      </Link>
    </main>
  );
}
