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
    <main className="flex w-full pt-8 min-w-0 gap-4">
      <div className="w-full min-w-0 space-y-4">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />
        <div className="rounded-full border border-muted-foreground px-4 py-2 shadow-sm">
          <h1 className="text-center text-xl md:text-xl font-semibold">
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
      ({ followerId }) => followerId === loggedInUserId
    ),
  };

  return (
    <div className="h-fit w-full rounded-2xl pb-6 md:pb-10">
      <div className="relative aspect-[3/1.5]">
        <Image
          src={user.bannerUrl || banner}
          alt={`${user.displayName}'s banner`}
          priority
          fill
          className="object-cover rounded-2xl"
        />
        <div className="absolute -bottom-12 md:-bottom-20 left-0 pl-6 md:pl-8 flex items-center gap-4 md:gap-6 w-full">
          <UserAvatar
            avatarUrl={user.avatarUrl}
            size={200}
            className="ring-0 ring-offset-4 max-h-20 max-w-20 md:max-h-36 md:max-w-36 rounded-full hover:-rotate-6 transition-transform duration-500"
          />
          <div className="flex w-full gap-2 items-center justify-between mt-14 md:mt-20 overflow-hidden">
            <div className="flex-1 font-semibold text-2xl truncate">
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
      <div className="flex justify-center gap-10 mt-24 md:mt-32">
        <FollowerCount userId={user.id} initialState={followerInfo} />
        {/* Todo: create FollowingCount component */}
        <span className="border border-muted-foreground rounded-full px-4 pt-1 md:pt-1.5 pb-0.5 md:pb-1">
          <span className="text-sm md:text-base font-bold">0</span>
          <span className="text-sm md:text-base font-semibold"> Following</span>
        </span>
      </div>
    </div>
  );
}
