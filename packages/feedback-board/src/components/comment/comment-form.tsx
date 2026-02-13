"use client";

import { useState, useRef } from "react";
import { useFeedbackBoard } from "../../provider";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { cn } from "../../utils";

interface CommentFormProps {
  postId: string;
  boardSlug: string;
  className?: string;
}

export function CommentForm({ postId, boardSlug, className }: CommentFormProps) {
  const { actions } = useFeedbackBoard();
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    setPending(true);
    await actions.createComment(formData);
    formRef.current?.reset();
    setPending(false);
  };

  return (
    <form ref={formRef} action={handleSubmit} className={cn("space-y-3", className)}>
      <input type="hidden" name="post_id" value={postId} />
      <input type="hidden" name="board_slug" value={boardSlug} />
      <Textarea name="body" placeholder="Add a comment..." rows={3} required />
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Posting..." : "Post Comment"}
      </Button>
    </form>
  );
}
