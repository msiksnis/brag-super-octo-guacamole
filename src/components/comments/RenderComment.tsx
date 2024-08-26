"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";

import { CommentData } from "@/lib/types";
import UserTooltip from "../UserTooltip";
import UserAvatar from "../UserAvatar";
import { formatRelativeDate } from "@/lib/utils";
import { useSession } from "@/app/(main)/SessionProvider";
import DeleteCommentModal from "../modals/DeleteCommentModal";
import { Button } from "../ui/button";

interface RenderCommentProps {
  comment: CommentData;
}

export default function RenderComment({ comment }: RenderCommentProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { user } = useSession();

  return (
    <span className="flex gap-x-2 sm:ml-2 group/comment">
      <span className="hidden sm:inline">
        <UserTooltip user={comment.user}>
          <Link href={`/users/${comment.user.username}`}>
            <UserAvatar avatarUrl={comment.user.avatarUrl} size={30} />
          </Link>
        </UserTooltip>
      </span>
      <div className="">
        <span className="flex flex-col px-3 py-1 bg-muted rounded-2xl">
          <UserTooltip user={comment.user}>
            <Link href={`/users/${comment.user.username}`}>
              <span className="text-sm font-semibold hover:underline underline-offset-2">
                {comment.user.displayName || comment.user.username}
              </span>
            </Link>
          </UserTooltip>
          {comment.content}
        </span>
        <span className="text-muted-foreground text-xs ml-2">
          {formatRelativeDate(comment.createdAt)}
        </span>
      </div>
      {comment.user.id === user.id && (
        <Button
          onClick={() => setShowDeleteModal(true)}
          size="icon"
          variant="ghost"
          className="ms-auto opacity-0 transition-opacity group-hover/comment:opacity-100 group-hover/comment:bg-muted rounded-2xl"
        >
          <Trash2 className="size-4 text-red-500" />
        </Button>
      )}
      <DeleteCommentModal
        comment={comment}
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />
    </span>
  );
}
