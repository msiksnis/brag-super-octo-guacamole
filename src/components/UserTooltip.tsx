"use client";

import { PropsWithChildren } from "react";

import { useSession } from "@/app/(main)/SessionProvider";
import { FollowerInfo, UserData } from "@/lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import UserAvatar from "./UserAvatar";
import Link from "next/link";
import FollowButton from "./FollowButton";
import Linkify from "./Linkify";
import FollowerCount from "./FollowerCount";
import { Button } from "./ui/button";

interface UserTooltipProps extends PropsWithChildren {
  user: UserData;
}

export default function UserTooltip({ children, user }: UserTooltipProps) {
  const { user: loggedInUser } = useSession();

  const followerState: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: !!user.followers.some(
      ({ followerId }) => followerId === loggedInUser.id
    ),
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <div className="flex flex-col max-w-60 gap-2 break-words md:min-w-52">
            <div className="flex items-center gap-2">
              <Link href={`/users/${user.username}`}>
                <UserAvatar
                  avatarUrl={user.avatarUrl}
                  size={70}
                  className="rounded-2xl"
                />
              </Link>
              <Link href={`/users/${user.username}`}>
                <div className="text-xl font-bold hover:underline underline-offset-2">
                  {user.displayName}
                </div>
                <div className="text-secondary-foreground lowercase">
                  @{user.username}
                </div>
              </Link>
            </div>
            {user.bio && (
              <Linkify>
                <div className="line-clamp-4 text-secondary-foreground text-base leading-5 whitespace-pre-line py-2">
                  {user.bio}
                </div>
              </Linkify>
            )}
            <FollowerCount
              userId={user.id}
              initialState={followerState}
              className="border-none px-0 py-0 text-secondary-foreground text-sm"
            />
            <div className="flex gap-2">
              {loggedInUser.id !== user.id && (
                <FollowButton
                  userId={user.id}
                  initialState={followerState}
                  className="h-9 w-full rounded-xl"
                />
              )}
              {/* Dummy button for now. Replace later. */}
              <Button variant="secondary" className="h-9 w-full rounded-xl">
                Message
              </Button>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
