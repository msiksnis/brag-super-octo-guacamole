import { useToast } from "@/components/ui/use-toast";
import { CommentData, CommentsPage } from "@/lib/types";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { deleteCommentAction } from "../actions/deleteCommentAction";

export function useDeleteCommentMutation() {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteCommentAction,
    onSuccess: async (deletedComment) => {
      const queryKey = ["comments", deletedComment.postId];

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
        queryKey,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              comments: page.comments.filter((c) => c.id !== deletedComment.id),
            })),
          };
        }
      );

      toast({
        description: "Comment deleted",
      });
    },

    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to delete comment. Please try again.",
      });
    },
  });

  return mutation;
}
