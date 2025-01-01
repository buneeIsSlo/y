import kyInstance from "@/lib/ky";
import { LikeInfo } from "@/lib/types";
import { Heart } from "@mynaui/icons-react";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  postId: string;
  initialState: LikeInfo;
}

export default function LikeButton({ postId, initialState }: LikeButtonProps) {
  const queryClient = useQueryClient();

  const queryKey: QueryKey = ["like-info", postId];

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/likes`).json<LikeInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isLikedByUser
        ? kyInstance.delete(`/api/posts/${postId}/likes`)
        : kyInstance.post(`/api/posts/${postId}/likes`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<LikeInfo>(queryKey);

      queryClient.setQueryData<LikeInfo>(queryKey, () => ({
        likes:
          (previousState?.likes || 0) + (previousState?.isLikedByUser ? -1 : 1),
        isLikedByUser: !previousState?.isLikedByUser,
      }));

      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error();
      toast.error("Something went wrong. Please try again!");
    },
  });

  return (
    <button
      onClick={() => mutate()}
      className="group flex items-center gap-1 p-1 text-muted-foreground hover:text-rose-600"
    >
      <span className="relative grid place-content-center">
        <span className="absolute inset-0 -m-1.5 rounded-md group-hover:bg-rose-600/30" />
        <Heart
          className={cn(
            "size-5",
            data.isLikedByUser && "fill-rose-600 text-rose-600",
          )}
        />
      </span>
      <span
        className={cn(
          "text-sm font-medium tabular-nums",
          data.isLikedByUser && "text-rose-600",
        )}
      >
        {data.likes}
      </span>
    </button>
  );
}
