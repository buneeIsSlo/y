import { PostData } from "@/lib/types";
import React, { useState } from "react";
import { useSubmitCommentMutation } from "./mutations";
import { Button } from "../ui/button";
import { Send, Spinner } from "@mynaui/icons-react";
import { Textarea } from "../ui/textarea";

interface CommentInputProps {
  post: PostData;
}

export default function CommentInput({ post }: CommentInputProps) {
  const [input, setInput] = useState("");

  const mutation = useSubmitCommentMutation(post.id);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!input) return;

    mutation.mutate(
      {
        post,
        content: input,
      },
      {
        onSuccess: () => setInput(""),
      },
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full items-center gap-2">
      <Textarea
        placeholder="Post your reply..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
        maxLength={200}
      />
      <Button
        type="submit"
        variant={"ghost"}
        size={"icon"}
        disabled={!input.trim() || mutation.isPending}
        title="Reply"
      >
        {!mutation.isPending ? <Send /> : <Spinner className="animate-spin" />}
      </Button>
    </form>
  );
}
