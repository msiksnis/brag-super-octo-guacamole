"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import InfiniteScroll from "@/components/InfiniteScroll";
import PostsLoadingSkeleton from "@/components/PostsLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { NotificationsPage } from "@/lib/types";
import Notification from "./Notification";
import { useEffect } from "react";

export default function Notifications() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "notifications"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/notifications",
          pageParam ? { searchParams: { cursor: pageParam } } : {}
        )
        .json<NotificationsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () => kyInstance.patch("/api/notifications/mark-as-read"),
    onSuccess: () => {
      queryClient.setQueryData(["unread-notification-count"], {
        unreadCount: 0,
      });
    },
    onError: (error) => {
      console.error("Failed to mark notifications as read:", error);
    },
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  const notifications = data?.pages.flatMap((page) => page.notifications) || [];

  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  if (status === "success" && notifications.length === 0 && !hasNextPage) {
    return (
      <p className="text-center text-sm mt-10">
        You haven&apos;t got any notifications yet...
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-sm text-destructive">
        Oops... Something went wrong while loading notifications.
      </p>
    );
  }

  return (
    <InfiniteScroll
      onBottomHit={() => hasNextPage && !isFetching && fetchNextPage()}
      className="space-y-4"
    >
      {notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
      {isFetchingNextPage && <PostsLoadingSkeleton />}
    </InfiniteScroll>
  );
}
