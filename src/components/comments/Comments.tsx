import { CommentsPage, PostData } from "@/lib/types";
import CommentInput from "./CommentInput";
import { useInfiniteQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import RenderComment from "./RenderComment";
import { Button } from "../ui/button";
import Loader from "../loader";

interface CommentsProps {
  post: PostData;
}

export default function Comments({ post }: CommentsProps) {
  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["comments", post.id],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get(
            `/api/posts/${post.id}/comments`,
            pageParam ? { searchParams: { cursor: pageParam } } : {}
          )
          .json<CommentsPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const comments = data?.pages.flatMap((page) => page.comments) || [];

  return (
    <div className="space-y-6 pl-4 pr-2">
      <CommentInput post={post} />
      <div className="space-y-2">
        {comments.map((comment) => (
          <RenderComment key={comment.id} comment={comment} />
        ))}
        {hasNextPage && (
          <Button
            onClick={() => fetchNextPage()}
            variant="link"
            className="mx-auto block"
            disabled={isFetching}
          >
            {isFetching ? "Loading..." : "Load more"}
          </Button>
        )}
        {status === "pending" && <Loader />}
        {status === "success" && !comments.length && (
          <p className="text-muted-foreground text-center text-sm">
            No comments yet.
          </p>
        )}
        {status === "error" && (
          <p className="text-destructive text-center text-sm">
            Failed to load comments. Please try again.
          </p>
        )}
      </div>
    </div>
  );
}
