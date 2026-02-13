"use client";

import { useTransition } from "react";
import { useFeedbackBoard } from "../../provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { STATUS_OPTIONS, getStatusLabel } from "../status/status-badge";
import type { PostStatus } from "../../types";

interface PostStatusSelectProps {
  postId: string;
  currentStatus: PostStatus;
  boardSlug: string;
}

export function PostStatusSelect({ postId, currentStatus, boardSlug }: PostStatusSelectProps) {
  const { actions } = useFeedbackBoard();
  const [isPending, startTransition] = useTransition();

  const handleChange = (value: string) => {
    startTransition(async () => {
      await actions.updatePostStatus(postId, value as PostStatus, boardSlug);
    });
  };

  return (
    <Select defaultValue={currentStatus} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger className="w-[160px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUS_OPTIONS.map((status) => (
          <SelectItem key={status} value={status}>
            {getStatusLabel(status)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
