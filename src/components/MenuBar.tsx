import Link from "next/link";
import { Bookmark, Home, Mail, MessageCircleMore } from "lucide-react";

import { Button } from "./ui/button";
import NotificationsButton from "./NotificationsButton";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

interface MenuBarProps {
  className?: string;
}

export default async function MenuBar({ className }: MenuBarProps) {
  const { user } = await validateRequest();

  if (!user) return null;

  const unreadNotificationCount = await prisma.notification.count({
    where: {
      recipientId: user.id,
      read: false,
    },
  });

  return (
    <div className={className}>
      <Button
        variant="ghost"
        title="Home"
        asChild
        className="flex items-center justify-start gap-3"
      >
        <Link href="/">
          <Home className="size-6" />
          <span className="hidden md:inline">Home</span>
        </Link>
      </Button>
      <NotificationsButton
        initialState={{ unreadCount: unreadNotificationCount }}
      />
      <Button
        variant="ghost"
        title="Messages"
        asChild
        className="flex items-center justify-start gap-3"
      >
        <Link href="/messages">
          <MessageCircleMore className="size-6" strokeWidth={1.9} />
          <span className="hidden md:inline">Messages</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        title="Bookmarks"
        asChild
        className="flex items-center justify-start gap-3"
      >
        <Link href="/bookmarks">
          <Bookmark className="size-6" />
          <span className="hidden md:inline">Bookmarks</span>
        </Link>
      </Button>
    </div>
  );
}
