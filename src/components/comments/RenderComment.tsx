import { CommentData } from "@/lib/types";
import UserTooltip from "../UserTooltip";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import { formatRelativeDate } from "@/lib/utils";

interface RenderCommentProps {
  comment: CommentData;
}

export default function RenderComment({ comment }: RenderCommentProps) {
  return (
    <span className="flex gap-x-2 sm:ml-2">
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
    </span>
  );
}
