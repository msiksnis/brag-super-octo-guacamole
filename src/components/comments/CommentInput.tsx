import { useSubmitCommentMutation } from "@/app/(main)/mutations/useSubmitCommentMutation";
import { PostData } from "@/lib/types";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SendHorizonal } from "lucide-react";

interface CommentInputProps {
  post: PostData;
}

export default function CommentInput({ post }: CommentInputProps) {
  const [input, setInput] = useState("");

  const mutation = useSubmitCommentMutation(post.id);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!input.trim()) {
      return;
    }

    mutation.mutate(
      {
        post,
        content: input,
      },
      {
        onSuccess: () => {
          setInput("");
        },
      }
    );
  }

  return (
    <form className="flex w-full items-center gap-2 pt-1" onSubmit={onSubmit}>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a comment..."
        autoFocus
        className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-foreground"
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        disabled={!input.trim() || mutation.isPending}
        className="hover:bg-transparent"
      >
        <SendHorizonal
          className={
            mutation.isPending
              ? "animate-bounce"
              : "size-[1.25rem] -rotate-[25deg] mb-1"
          }
        />
      </Button>
    </form>
  );
}
