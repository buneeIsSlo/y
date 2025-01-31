import { Skeleton } from "../ui/skeleton";

export default function PostsLoadingSkelton() {
  return (
    <div className="space-y-5">
      <PostSkeleton />
      <PostSkeleton />
      <PostSkeleton />
      <PostSkeleton />
      <PostSkeleton />
    </div>
  );
}

function PostSkeleton() {
  return (
    <div className="space-y-3 rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div>
          <Skeleton className="mb-1 h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <Skeleton className="h-20 w-full" />
    </div>
  );
}
