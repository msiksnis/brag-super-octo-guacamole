import { Skeleton } from "./ui/skeleton";

export default function PostsLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <PostLoadingSkeleton />
      <PostLoadingSkeleton />
      <PostLoadingSkeleton />
      <PostLoadingSkeleton />
    </div>
  );
}

function PostLoadingSkeleton() {
  return (
    <div className="w-full animate-pulse space-y-2 rounded-2xl bg-card p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex justify-between w-full">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
      </div>
      <Skeleton className="h-10 rounded" />
    </div>
  );
}
