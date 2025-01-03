import kyInstance from "@/lib/ky";
import { BookmarkInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Bookmark } from "@mynaui/icons-react";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

interface BookmarkButtonProps {
  postId: string;
  initialState: BookmarkInfo;
}

export default function BookmarkButton({
  postId,
  initialState,
}: BookmarkButtonProps) {
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const queryKey: QueryKey = ["bookmark-info", postId];

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/bookmarks`).json<BookmarkInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isBookmarkedByUser
        ? kyInstance.delete(`/api/posts/${postId}/bookmarks`)
        : kyInstance.post(`/api/posts/${postId}/bookmarks`),
    onMutate: async () => {
      toast.info(
        data.isBookmarkedByUser
          ? "Removed from your bookmarks"
          : "Added to your bookmarks",
      );

      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<BookmarkInfo>(queryKey);

      queryClient.setQueryData<BookmarkInfo>(queryKey, () => ({
        bookmarks:
          (previousState?.bookmarks || 0) +
          (previousState?.isBookmarkedByUser ? -1 : 1),
        isBookmarkedByUser: !previousState?.isBookmarkedByUser,
      }));

      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context);
      console.error(error);
      toast.error("Something went wrong. Please try again!");
    },
  });

  return (
    <button
      onClick={() => mutate()}
      className="group flex items-center gap-1 p-1 text-muted-foreground hover:text-primary"
    >
      <span className="relative grid place-content-center">
        <span className="absolute inset-0 -m-1.5 rounded-md group-hover:bg-primary/30" />
        <Bookmark
          className={cn(
            "size-5",
            data.isBookmarkedByUser && "fill-primary text-primary",
          )}
        />
      </span>
      {pathname?.includes("posts") && (
        <span
          className={cn(
            "text-sm font-medium tabular-nums",
            data.isBookmarkedByUser && "text-primary",
          )}
        >
          {data.bookmarks}
        </span>
      )}
    </button>
  );
}
