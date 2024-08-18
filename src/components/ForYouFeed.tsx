"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { PostsPage } from "@/lib/types";
import Post from "./posts/Post";
import kyInstance from "@/lib/ky";
import PostsLoadingSkeleton from "./PostsLoadingSkeleton";
import InfiniteScroll from "./InfiniteScroll";

export default function ForYouFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "for-you"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/posts/for-you",
          pageParam ? { searchParams: { cursor: pageParam } } : {}
        )
        .json<PostsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  if (status === "success" && posts.length === 0 && !hasNextPage) {
    return (
      <p className="text-center text-sm mt-10">
        No one has bragged just yet...
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-sm text-destructive">
        Oops... Something went wrong while loading the data.
      </p>
    );
  }

  return (
    <InfiniteScroll
      onBottomHit={() => hasNextPage && !isFetching && fetchNextPage()}
      className="space-y-4"
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isFetchingNextPage && <PostsLoadingSkeleton />}
    </InfiniteScroll>
  );
}
