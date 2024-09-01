import { cache } from "react";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { validateRequest } from "@/auth";
import UserAvatar from "@/components/UserAvatar";
import prisma from "@/lib/prisma";
import { FollowerInfo, getUserDataSelect, UserData } from "@/lib/types";
import banner from "@/assets/banner.avif";
import TrendsSidebar from "@/components/TrendsSidebar";
import FollowerCount from "@/components/FollowerCount";
import FollowButton from "@/components/FollowButton";
import UserPosts from "@/components/UserPosts";
import EditProfileButton from "@/components/EditProfileButton";

interface UserPageProps {
  params: { username: string };
}

const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedInUserId),
  });

  if (!user) notFound();

  return user;
});

export async function generateMetadata({
  params: { username },
}: UserPageProps): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return {};

  const user = await getUser(username, loggedInUser.id);

  return {
    title: `${user.displayName} (@${user.username})`,
  };
}

export default async function UserPage({
  params: { username },
}: UserPageProps) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser)
    return (
      <p className="text-center text-sm text-destructive">
        You need to be logged in to view this page.
      </p>
    );

  const user = await getUser(username, loggedInUser.id);

  return (
    <main className="flex w-full min-w-0 gap-4 pt-8">
      <div className="w-full min-w-0 space-y-4">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />
        <div className="rounded-full border border-muted-foreground px-4 py-2 shadow-sm">
          <h1 className="text-center text-xl font-semibold md:text-xl">
            {user.displayName}&apos;s posts
          </h1>
        </div>
        <UserPosts userId={user.id} />
      </div>
      <TrendsSidebar />
    </main>
  );
}

interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}

async function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUserId,
    ),
  };

  return (
    <div className="h-fit w-full rounded-2xl pb-6 md:pb-10">
      <div className="relative aspect-[3/1.5]">
        <Image
          src={banner}
          alt={`${user.displayName}'s banner`}
          priority
          fill
          className="rounded-2xl object-cover"
        />
        <div className="absolute -bottom-12 left-0 flex w-full items-center gap-4 pl-6 md:-bottom-20 md:gap-6 md:pl-8">
          <UserAvatar
            avatarUrl={user.avatarUrl}
            size={200}
            className="max-h-20 max-w-20 rounded-full ring-0 ring-offset-4 transition-transform duration-500 hover:-rotate-6 md:max-h-36 md:max-w-36"
          />
          <div className="mt-14 flex w-full items-center justify-between gap-2 overflow-hidden md:mt-20">
            <div className="flex-1 truncate text-2xl font-semibold">
              {user.displayName}
            </div>
            <div className="flex justify-end">
              {user.id === loggedInUserId ? (
                <EditProfileButton user={user} />
              ) : (
                <FollowButton userId={user.id} initialState={followerInfo} />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-24 flex justify-center gap-10 md:mt-32">
        <FollowerCount userId={user.id} initialState={followerInfo} />
        {/* Todo: create FollowingCount component */}
        <span className="rounded-full border border-muted-foreground px-4 pb-0.5 pt-1 md:pb-1 md:pt-1.5">
          <span className="text-sm font-bold md:text-base">0</span>
          <span className="text-sm font-semibold md:text-base"> Following</span>
        </span>
      </div>
    </div>
  );
}
