import UserAvatar from "@/components/UserAvatar";
import { NotificationData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { NotificationType } from "@prisma/client";
import { Heart, MessageCircle, User2 } from "lucide-react";
import Link from "next/link";

interface NotificationProps {
  notification: NotificationData;
}

export default function Notification({ notification }: NotificationProps) {
  const notificationTypeMap: Record<
    NotificationType,
    { message: string; icon: JSX.Element; href: string }
  > = {
    FOLLOW: {
      message: `${notification.issuer.displayName} followed you.`,
      icon: <User2 className="size-7 text-primary" />,
      href: `/users/${notification.issuer.username}`,
    },
    LIKE: {
      message: `${notification.issuer.displayName} liked your post.`,
      icon: <Heart className="size-7 text-red-500 fill-red-500" />,
      href: `/posts/${notification.postId}`,
    },
    COMMENT: {
      message: `${notification.issuer.displayName} commented on your post.`,
      icon: <MessageCircle className="size-7 text-primary fill-primary" />,
      href: `/posts/${notification.postId}`,
    },
  };

  const { message, icon, href } = notificationTypeMap[notification.type];

  return (
    <Link href={href} className="block">
      <article
        className={cn(
          "flex gap-2 rounded-2xl bg-card shadow-sm p-4 transition-colors duration-200 hover:bg-card/70",
          !notification.read && "bg-primary/10 border border-primary"
        )}
      >
        <div className="mr-1 my-auto">{icon}</div>
        <div className="ml-1 space-y-2">
          <div className="flex  items-center space-x-3">
            <UserAvatar avatarUrl={notification.issuer.avatarUrl} size={36} />
            <span className="">{message}</span>
          </div>
          {notification.post && (
            <div className="line-clamp-3 whitespace-pre-line text-muted-foreground">
              {notification.post.content}
            </div>
          )}
          {notification.type === "COMMENT" && (
            // If the notification is a comment, show the comment content
            <div className="line-clamp-2 whitespace-pre-line text-muted-foreground">
              {/* TODO: Get that comment */}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
