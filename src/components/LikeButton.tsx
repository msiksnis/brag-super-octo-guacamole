"use client";

import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

import { LikeInfo } from "@/lib/types";
import { useToast } from "./ui/use-toast";
import kyInstance from "@/lib/ky";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  postId: string;
  initialState: LikeInfo;
}

export default function LikeButton({ postId, initialState }: LikeButtonProps) {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const queryKey: QueryKey = ["like-info", postId];

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/likes`).json<LikeInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isLikedByUser
        ? kyInstance.delete(`/api/posts/${postId}/likes`)
        : kyInstance.post(`/api/posts/${postId}/likes`),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<LikeInfo>(queryKey);

      queryClient.setQueryData<LikeInfo>(queryKey, () => ({
        likes:
          (previousState?.likes || 0) + (previousState?.isLikedByUser ? -1 : 1),
        isLikedByUser: !previousState?.isLikedByUser,
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
  const heartVariants = {
    liked: {
      scale: [1, 1.5, 1.2, 1.4, 1],
      rotate: [0, 10, -10, 0],
      fill: "#f87171",
      transition: {
        duration: 0.6,
        ease: "easeInOut",
        times: [0, 0.2, 0.4, 0.6, 1],
      },
    },
    unliked: {
      scale: [1, 1.5, 1],
      rotate: [0, -10, 10, 0],
      fill: "#000000",
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
      className="flex items-center gap-2 group"
    >
      <motion.div
        animate={data.isLikedByUser ? "liked" : "unliked"}
        variants={heartVariants}
      >
        <Heart
          className={cn(
            "size-5 group-hover:text-red-500 transition-colors duration-300",
            data.isLikedByUser && "text-red-500 fill-red-500"
          )}
        />
      </motion.div>
      <span className="text-sm font-medium tabular-nums peer">
        {data.likes}{" "}
        <span className="hidden sm:inline">
          {data.likes === 1 ? "like" : "likes"}
        </span>
      </span>
    </button>
  );
}
