"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { PostData } from "@/lib/types";
import UserAvatar from "../UserAvatar";
import { cn, formatRelativeDate } from "@/lib/utils";
import DeletePostButton from "./DeletePostButton";
import EditPostButton from "./EditPostButton";
import { useSession } from "@/app/(main)/SessionProvider";
import Linkify from "../Linkify";
import UserTooltip from "../UserTooltip";
import { Media } from "@prisma/client";
import { Separator } from "../ui/separator";
import LikeButton from "../LikeButton";
import BookmarkButton from "../BookmarkButton";
import { MessageCircle } from "lucide-react";
import Comments from "../comments/Comments";

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  const [showComments, setShowComments] = useState(false);

  const { user } = useSession();

  return (
    <article className="space-y-3 rounded-2xl bg-card py-4 shadow-sm">
      <div className="px-4">
        <div className="flex w-full items-center gap-4">
          <UserTooltip user={post.user}>
            <Link
              href={`/users/${post.user.username}`}
              className="transition-transform duration-300 hover:-rotate-10"
            >
              <UserAvatar avatarUrl={post.user.avatarUrl} size={50} />
            </Link>
          </UserTooltip>
          <div className="flex w-full flex-col">
            <UserTooltip user={post.user}>
              <Link
                href={`/users/${post.user.username}`}
                className="text-lg font-semibold underline-offset-2 hover:underline"
              >
                {post.user.displayName || post.user.username}
              </Link>
            </UserTooltip>
            <Link
              href={`/posts/${post.id}`}
              className="-mt-1 text-xs text-muted-foreground"
              suppressHydrationWarning
            >
              {formatRelativeDate(post.createdAt)}
            </Link>
          </div>
          {post.user.id === user.id && (
            <div className="flex justify-end">
              <EditPostButton post={post} />
              <DeletePostButton post={post} />
            </div>
          )}
        </div>
        <Linkify>
          <Link href={`/posts/${post.id}`}>
            <div className="mt-4 flex-1 whitespace-pre-line break-words">
              {post.content}
            </div>
          </Link>
        </Linkify>
      </div>
      <div className="md:px-4">
        {!!post.attachments.length && (
          <Link href={`/posts/${post.id}`}>
            <MediaPreviews attachments={post.attachments} />
          </Link>
        )}
      </div>

      <div className="space-y-4 px-4 pt-2">
        <Separator />
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <LikeButton
              postId={post.id}
              initialState={{
                likes: post._count.likes,
                isLikedByUser: post.likes.some(
                  (like) => like.userId === user.id,
                ),
              }}
            />
            <ShowComments
              post={post}
              onClick={() => setShowComments(!showComments)}
            />
          </div>
          <BookmarkButton
            postId={post.id}
            initialState={{
              isBookmarkedByUser: post.bookmarks.some(
                (bookmark) => bookmark.userId === user.id,
              ),
            }}
          />
        </div>
      </div>
      {showComments && <Comments post={post} />}
    </article>
  );
}

interface MediaPreviewsProps {
  attachments: Media[];
}

function MediaPreviews({ attachments }: MediaPreviewsProps) {
  const pathname = usePathname();
  const isPostsPath = pathname.startsWith("/posts");

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        attachments.length > 1 && "md:grid md:grid-cols-2",
        isPostsPath && "md:grid-cols-1",
      )}
    >
      {attachments.map((media) => (
        <MediaPreview key={media.id} media={media} />
      ))}
    </div>
  );
}

interface MediaPreviewProps {
  media: Media;
}

function MediaPreview({ media }: MediaPreviewProps) {
  if (media.type === "IMAGE") {
    return (
      <Image
        src={media.url}
        alt="Attachment"
        width={500}
        height={500}
        className="mx-auto size-fit max-h-[30rem] md:rounded-2xl"
      />
    );
  }

  if (media.type === "VIDEO") {
    return (
      <div>
        <video
          controls
          src={media.url}
          className="mx-auto size-fit max-h-[30rem] md:rounded-2xl"
        />
      </div>
    );
  }

  return <p className="text-sm text-destructive">Media unavailable</p>;
}

interface ShowCommentsProps {
  post: PostData;
  onClick: () => void;
}

function ShowComments({ post, onClick }: ShowCommentsProps) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 sm:gap-2">
      <MessageCircle className="size-[1.125rem]" />
      <span className="-mb-1 text-sm tabular-nums text-muted-foreground">
        {post._count.comments}{" "}
        <span className="hidden sm:inline">
          {post._count.comments === 1 ? "comment" : "comments"}
        </span>
      </span>
    </button>
  );
}
