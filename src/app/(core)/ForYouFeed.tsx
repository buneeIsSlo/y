"use client";

import Post from "@/components/posts/Post";
import kyInstance from "@/lib/ky";
import { useQuery } from "@tanstack/react-query";
import { PostData } from "@/lib/types";
import { Spinner } from "@mynaui/icons-react";

export default function ForYouFeed() {
  const query = useQuery<PostData[]>({
    queryKey: ["post-feed", "for-you"],
    queryFn: kyInstance.get("/api/posts/for-you").json<PostData[]>,
  });

  if (query.status === "pending") {
    return <Spinner className="mx-auto animate-spin" />;
  }

  if (query.status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occured while loading posts
      </p>
    );
  }

  return (
    <>
      {query.data.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </>
  );
}
