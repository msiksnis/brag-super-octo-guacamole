"use client";

import useFollowerInfo from "@/hooks/useFollowerInfo";
import { FollowerInfo } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";

interface FollowerCountProps {
  userId: string;
  initialState: FollowerInfo;
  className?: string;
}

export default function FollowerCount({
  userId,
  initialState,
  className,
}: FollowerCountProps) {
  const { data } = useFollowerInfo(userId, initialState);

  return (
    <span
      className={cn(
        "border border-muted-foreground rounded-full w-fit px-4 pt-1 md:pt-1.5 pb-0.5 md:pb-1",
        className
      )}
    >
      <span className="text-sm md:text-base font-bold">
        {formatNumber(data.followers)}
      </span>
      <span className="text-sm md:text-base font-semibold">
        {data.followers === 1 ? " Follower" : " Followers"}
      </span>
    </span>
  );
}
