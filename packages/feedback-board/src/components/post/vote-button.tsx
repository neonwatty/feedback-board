"use client";

import { useState, useTransition } from "react";
import { useFeedbackBoard } from "../../provider";
import { Button } from "../ui/button";
import { ChevronUp } from "lucide-react";
import { cn } from "../../utils";

interface VoteButtonProps {
  postId: string;
  boardSlug: string;
  voteCount: number;
  hasVoted: boolean;
  isLoggedIn: boolean;
}

export function VoteButton({
  postId,
  boardSlug,
  voteCount,
  hasVoted,
  isLoggedIn,
}: VoteButtonProps) {
  const { actions, loginPath, basePath } = useFeedbackBoard();
  const [optimisticCount, setOptimisticCount] = useState(voteCount);
  const [optimisticVoted, setOptimisticVoted] = useState(hasVoted);
  const [isPending, startTransition] = useTransition();

  const handleVote = () => {
    if (!isLoggedIn) {
      window.location.href = loginPath;
      return;
    }

    // Optimistic update
    setOptimisticVoted(!optimisticVoted);
    setOptimisticCount(optimisticVoted ? optimisticCount - 1 : optimisticCount + 1);

    startTransition(async () => {
      await actions.toggleVote(postId, boardSlug);
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleVote}
      disabled={isPending}
      className={cn(
        "flex flex-col items-center gap-0 h-auto py-1.5 px-3 min-w-[3.5rem]",
        optimisticVoted && "border-primary bg-primary/5 text-primary"
      )}
    >
      <ChevronUp className="h-4 w-4" />
      <span className="text-sm font-semibold">{optimisticCount}</span>
    </Button>
  );
}
