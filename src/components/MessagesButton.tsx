"use client";

import { MessageCountInfo } from "@/lib/types";
import { Button } from "./ui/button";
import Link from "next/link";
import { MessageCircleMore } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";

interface MessagesButtonProps {
  initialState: MessageCountInfo;
}

export default function MessagesButton({ initialState }: MessagesButtonProps) {
  const { data } = useQuery({
    queryKey: ["unread-messages-count"],
    queryFn: () =>
      kyInstance.get("/api/messages/unread-count").json<MessageCountInfo>(),
    initialData: initialState,
    refetchInterval: 15 * 1000,
  });

  return (
    <Button
      variant="ghost"
      title="Messages"
      asChild
      className="flex items-center justify-start gap-3"
    >
      <Link href="/messages">
        <div className="relative">
          <MessageCircleMore className="size-6" />
          {!!data.unreadCount && (
            <span className="absolute -right-0.5 -top-1 rounded-full bg-primary px-1 text-xs font-semibold tabular-nums text-primary-foreground ring-1 ring-card">
              {data.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden md:inline">Messages</span>
      </Link>
    </Button>
  );
}
