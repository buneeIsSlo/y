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
    <form
      onSubmit={onSubmit}
      className="items-full flex flex-col items-center gap-2"
    >
      <Textarea
        placeholder="Post your reply..."
        value={input}
        className="w-full"
        onChange={(e) => setInput(e.target.value)}
        autoFocus
        maxLength={200}
      />
      <Button
        type="submit"
        variant={"secondary"}
        className="w-auto self-end"
        disabled={!input.trim() || mutation.isPending}
      >
        {!mutation.isPending ? "Reply" : <Spinner className="animate-spin" />}
      </Button>
    </form>
  );
}
