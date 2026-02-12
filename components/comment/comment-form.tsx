"use client";

import { useState, useRef } from "react";
import { createComment } from "@/lib/actions/comments";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CommentFormProps {
  postId: string;
  boardSlug: string;
}

export function CommentForm({ postId, boardSlug }: CommentFormProps) {
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    setPending(true);
    await createComment(formData);
    formRef.current?.reset();
    setPending(false);
  };

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-3">
      <input type="hidden" name="post_id" value={postId} />
      <input type="hidden" name="board_slug" value={boardSlug} />
      <Textarea
        name="body"
        placeholder="Add a comment..."
        rows={3}
        required
      />
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Posting..." : "Post Comment"}
      </Button>
    </form>
  );
}
