"use client";

import { FeedbackBoardProvider } from "@neonwatty/feedback-board";
import type { FeedbackUser } from "@neonwatty/feedback-board";
import {
  createBoard,
  createPost,
  toggleVote,
  updatePostStatus,
  createComment,
} from "@/lib/feedback-actions";

const actions = {
  createBoard,
  createPost,
  toggleVote,
  updatePostStatus,
  createComment,
};

export function FeedbackProviderWrapper({
  user,
  children,
}: {
  user: FeedbackUser | null;
  children: React.ReactNode;
}) {
  return (
    <FeedbackBoardProvider
      actions={actions}
      user={user}
      basePath=""
      loginPath="/login"
    >
      {children}
    </FeedbackBoardProvider>
  );
}
