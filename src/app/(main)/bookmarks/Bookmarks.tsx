"use client";

import InfiniteScroll from "@/components/InfiniteScroll";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/PostsLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function Bookmarks() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "bookmarks"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/posts/bookmarked",
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
        You haven&apos;t bookmarked any posts yet...
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-sm text-destructive">
        Oops... Something went wrong while loading bookmarks.
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
