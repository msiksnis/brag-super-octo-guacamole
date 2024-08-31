"use client";

import { NotificationCountInfo } from "@/lib/types";
import { Button } from "./ui/button";
import Link from "next/link";
import { Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";

interface NotificationsButtonProps {
  initialState: NotificationCountInfo;
}

export default function NotificationsButton({
  initialState,
}: NotificationsButtonProps) {
  const { data } = useQuery({
    queryKey: ["unread-notification-count"],
    queryFn: () =>
      kyInstance
        .get("/api/notifications/unread-count")
        .json<NotificationCountInfo>(),
    initialData: initialState,
    refetchInterval: 60 * 1000,
  });

  return (
    <Button
      variant="ghost"
      title="Notifications"
      asChild
      className="flex justify-start items-center gap-3"
    >
      <Link href="/notifications">
        <div className="relative">
          <Bell className="size-6" />
          {!!data.unreadCount && (
            <span className="absolute -top-1 -right-0.5 text-xs font-semibold text-primary-foreground tabular-nums bg-primary rounded-full ring-1 ring-card px-1">
              {data.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden md:inline">Notifications</span>
      </Link>
    </Button>
  );
}
