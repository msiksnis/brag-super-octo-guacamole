import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { Suspense } from "react";
import Loader from "./loader";
import UserAvatar from "./UserAvatar";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { formatNumber } from "@/lib/utils";
import FollowButton from "./FollowButton";
import { getUserDataSelect } from "@/lib/types";
import UserTooltip from "./UserTooltip";

export default function TrendsSidebar() {
  return (
    <div className="hidden lg:block lg:w-80 w-72 h-fit flex-none space-y-4 sticky top-28">
      <Suspense fallback={<Loader />}>
        <WhoToFollow />
        <TrendingTopics />
      </Suspense>
    </div>
  );
}

async function WhoToFollow() {
  const { user } = await validateRequest();

  if (!user) return null;

  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: user.id,
      },
      followers: {
        none: {
          followerId: user.id,
        },
      },
    },
    select: getUserDataSelect(user.id),
    take: 5,
  });

  return (
    <div className="space-y-4 rounded-2xl bg-card p-4 shadow-sm">
      <div className="text-lg font-semibold">Braggers to Follow</div>
      {usersToFollow.map((user) => (
        <div key={user.id} className="flex justify-between items-center gap-4">
          <UserTooltip user={user}>
            <Link
              href={`/user/${user.username}`}
              className="flex items-center gap-4 group"
            >
              <UserAvatar
                avatarUrl={user.avatarUrl}
                size={40}
                className="group-hover:-rotate-10 transition-transform duration-300"
              />
              <div>
                <div className="line-clamp-1 break-all font-medium hover:underline underline-offset-2">
                  {user.displayName || user.username}
                </div>
                <div className="line-clamp-1 break-all text-muted-foreground lowercase">
                  @{user.username}
                </div>
              </div>
            </Link>
          </UserTooltip>
          <FollowButton
            userId={user.id}
            initialState={{
              followers: user._count.followers,
              isFollowedByUser: user.followers.some(
                ({ followerId }) => followerId === user.id
              ),
            }}
          />
        </div>
      ))}
    </div>
  );
}

const getTrendingTopics = unstable_cache(
  async () => {
    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
              SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
              FROM posts
              GROUP BY (hashtag)
              ORDER BY count DESC, hashtag ASC
              LIMIT 5
          `;

    return result.map((row) => ({
      hashtag: row.hashtag,
      count: Number(row.count),
    }));
  },
  ["trending_topics"],
  {
    revalidate: 3 * 60 * 60,
  }
);

async function TrendingTopics() {
  const trendingTopics = await getTrendingTopics();

  return (
    <div className="space-y-4 rounded-2xl bg-card p-4 shadow-sm">
      <div className="text-lg font-semibold">Trending Tags</div>
      {trendingTopics.map(({ hashtag, count }) => {
        const title = hashtag.split("#")[1];

        return (
          <Link key={title} href={`/hashtag/${title}`} className="block">
            <p
              className="line-clamp-1 break-all font-medium hover:underline underline-offset-2"
              title={hashtag}
            >
              {hashtag}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatNumber(count)} {count === 1 ? "post" : "posts"}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
