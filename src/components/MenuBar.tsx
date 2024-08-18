"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Bell, Bookmark, Home, Mail } from "lucide-react";

interface MenuBarProps {
  className?: string;
}

export default function MenuBar({ className }: MenuBarProps) {
  return (
    <div className={className}>
      <Button
        variant="ghost"
        title="Home"
        asChild
        className="flex justify-start items-center gap-3"
      >
        <Link href="/">
          <Home className="size-6" />
          <span className="hidden md:inline">Home</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        title="Notifications"
        asChild
        className="flex justify-start items-center gap-3"
      >
        <Link href="/notifications">
          <Bell className="size-6" />
          <span className="hidden md:inline">Notifications</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        title="Messages"
        asChild
        className="flex justify-start items-center gap-3"
      >
        <Link href="/messages">
          <Mail className="size-6" />
          <span className="hidden md:inline">Messages</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        title="Bookmarks"
        asChild
        className="flex justify-start items-center gap-3"
      >
        <Link href="/bookmarks">
          <Bookmark className="size-6" />
          <span className="hidden md:inline">Bookmarks</span>
        </Link>
      </Button>
    </div>
  );
}
