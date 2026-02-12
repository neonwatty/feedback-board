"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFeedbackBoard } from "../../provider";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Plus } from "lucide-react";

export function CreateBoardDialog() {
  const router = useRouter();
  const { actions, basePath } = useFeedbackBoard();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setPending(true);
    setError(null);
    const result = await actions.createBoard(formData);
    if (result?.error) {
      setError(result.error);
      setPending(false);
      return;
    }
    if (result?.slug) {
      setOpen(false);
      router.push(`${basePath}/board/${result.slug}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Board
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new board</DialogTitle>
          <DialogDescription>
            A board is a space for collecting feedback about a specific topic or product.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Feature Requests"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              placeholder="What is this board for?"
              rows={3}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Creating..." : "Create Board"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
