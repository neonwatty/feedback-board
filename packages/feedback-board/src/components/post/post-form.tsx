"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFeedbackBoard } from "../../provider";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export function PostForm({ boardId }: { boardId: string }) {
  const router = useRouter();
  const { actions, basePath } = useFeedbackBoard();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setPending(true);
    setError(null);
    const result = await actions.createPost(formData);
    if (result?.error) {
      setError(result.error);
      setPending(false);
      return;
    }
    if (result?.slug) {
      router.push(`${basePath}/board/${result.slug}`);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <input type="hidden" name="board_id" value={boardId} />
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <Input id="title" name="title" placeholder="Short, descriptive title" required />
      </div>
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe your idea or feedback in detail..."
          rows={6}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Submitting..." : "Submit Feedback"}
      </Button>
    </form>
  );
}
