import React from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { vi } from "vitest";
import { FeedbackBoardProvider } from "../../provider";
import type { FeedbackBoardActions, FeedbackUser } from "../../types";

export const mockActions: FeedbackBoardActions = {
  createBoard: vi.fn().mockResolvedValue({ slug: "test-board" }),
  createPost: vi.fn().mockResolvedValue({ slug: "test-board" }),
  toggleVote: vi.fn().mockResolvedValue(undefined),
  updatePostStatus: vi.fn().mockResolvedValue(undefined),
  createComment: vi.fn().mockResolvedValue(undefined),
};

export const mockUser: FeedbackUser = { id: "user-1", email: "test@example.com" };

interface RenderWithProviderOptions extends Omit<RenderOptions, "wrapper"> {
  actions?: FeedbackBoardActions;
  user?: FeedbackUser | null;
  basePath?: string;
  loginPath?: string;
}

export function renderWithProvider(ui: React.ReactElement, options: RenderWithProviderOptions = {}) {
  const {
    actions = mockActions,
    user = mockUser,
    basePath = "/feedback",
    loginPath = "/login",
    ...renderOptions
  } = options;

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <FeedbackBoardProvider actions={actions} user={user} basePath={basePath} loginPath={loginPath}>
        {children}
      </FeedbackBoardProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}
