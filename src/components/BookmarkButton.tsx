"use client";

import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Bookmark } from "lucide-react";

import { BookmarkInfo } from "@/lib/types";
import { useToast } from "./ui/use-toast";
import kyInstance from "@/lib/ky";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  postId: string;
  initialState: BookmarkInfo;
}

export default function BookmarkButton({
  postId,
  initialState,
}: BookmarkButtonProps) {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const queryKey: QueryKey = ["bookmark-info", postId];

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/bookmark`).json<BookmarkInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isBookmarkedByUser
        ? kyInstance.delete(`/api/posts/${postId}/bookmark`)
        : kyInstance.post(`/api/posts/${postId}/bookmark`),

    onMutate: async () => {
      toast({
        description: `Post ${
          data.isBookmarkedByUser ? "unbookmarked" : "bookmarked"
        }`,
      });
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<BookmarkInfo>(queryKey);

      queryClient.setQueryData<BookmarkInfo>(queryKey, () => ({
        isBookmarkedByUser: !previousState?.isBookmarkedByUser,
      }));

      return { previousState };
    },

    onError: (error, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        variant: "destructive",
        description: "Oops! Something went wrong. Please try again.",
      });
    },
  });

  // Animation variants
  const bookmarkVariants = {
    bookmarked: {
      scale: [1, 1.2, 1],
      opacity: [0.8, 1],
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
    unbookmarked: {
      scale: [1, 1.1, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <button
      onClick={() => {
        mutate();
      }}
      className="flex items-center gap-2"
    >
      <motion.div
        animate={data.isBookmarkedByUser ? "bookmarked" : "unbookmarked"}
        variants={bookmarkVariants}
      >
        <Bookmark
          className={cn(
            "size-5 opacity-75 hover:opacity-100 transition-opacity duration-300",
            data.isBookmarkedByUser && "opacity-100 fill-black"
          )}
        />
      </motion.div>
    </button>
  );
}
