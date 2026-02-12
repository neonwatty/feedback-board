"use client";

import { useTransition } from "react";
import { updatePostStatus } from "@/lib/actions/posts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_OPTIONS, getStatusLabel } from "@/components/status/status-badge";
import type { PostStatus } from "@/lib/types/database";

interface PostStatusSelectProps {
  postId: string;
  currentStatus: PostStatus;
  boardSlug: string;
}

export function PostStatusSelect({
  postId,
  currentStatus,
  boardSlug,
}: PostStatusSelectProps) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (value: string) => {
    startTransition(async () => {
      await updatePostStatus(postId, value as PostStatus, boardSlug);
    });
  };

  return (
    <Select
      defaultValue={currentStatus}
      onValueChange={handleChange}
      disabled={isPending}
    >
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
