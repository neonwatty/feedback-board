/**
 * @neonwatty/feedback-board — Integration Test Template
 *
 * Copy this file into your project and adapt as needed.
 *
 * Prerequisites:
 *   npm install -D vitest @testing-library/react @testing-library/user-event jsdom
 *
 * Run with:
 *   npx vitest run integration-test-example
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import {
  FeedbackBoardProvider,
  PostList,
  type FeedbackBoardActions,
  type FeedbackUser,
  type PostWithVoteStatus,
} from "@neonwatty/feedback-board";
import { createBoardAction } from "@neonwatty/feedback-board/actions";
import type { SupabaseClient } from "@supabase/supabase-js";

// ─── 1. Test Helpers ───────────────────────────────────────────────────────────

const mockActions: FeedbackBoardActions = {
  createBoard: vi.fn().mockResolvedValue({ slug: "test-board" }),
  createPost: vi.fn().mockResolvedValue({ slug: "test-board" }),
  toggleVote: vi.fn().mockResolvedValue(undefined),
  updatePostStatus: vi.fn().mockResolvedValue(undefined),
  createComment: vi.fn().mockResolvedValue(undefined),
};

const mockUser: FeedbackUser = { id: "user-1", email: "test@example.com" };

interface RenderWithProviderOptions {
  actions?: FeedbackBoardActions;
  user?: FeedbackUser | null;
  basePath?: string;
  loginPath?: string;
}

function renderWithProvider(ui: React.ReactElement, options: RenderWithProviderOptions = {}) {
  const { actions = mockActions, user = mockUser, basePath = "/feedback", loginPath = "/login" } = options;

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <FeedbackBoardProvider actions={actions} user={user} basePath={basePath} loginPath={loginPath}>
        {children}
      </FeedbackBoardProvider>
    );
  }

  return render(ui, { wrapper: Wrapper });
}

// ─── 2. Mock Supabase ──────────────────────────────────────────────────────────

interface MockResponse {
  data: unknown;
  error: unknown;
}

function createMockSupabase(overrides?: Partial<MockResponse>) {
  const response: MockResponse = {
    data: overrides?.data ?? null,
    error: overrides?.error ?? null,
  };

  const chainable: Record<string, ReturnType<typeof vi.fn>> = {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    eq: vi.fn(),
    single: vi.fn(),
    then: vi.fn(),
  };

  chainable.then.mockImplementation((resolve: (v: MockResponse) => void) => Promise.resolve(response).then(resolve));

  for (const key of Object.keys(chainable)) {
    if (key === "single") {
      chainable[key].mockResolvedValue(response);
    } else if (key !== "then") {
      chainable[key].mockReturnValue(chainable);
    }
  }

  const from = vi.fn().mockReturnValue(chainable);
  const supabase = { from } as unknown as SupabaseClient;

  return { supabase, from, chainable, response };
}

function buildFormData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    fd.append(key, value);
  }
  return fd;
}

// ─── 3. Component Test Example ─────────────────────────────────────────────────

describe("PostList integration", () => {
  const samplePosts: PostWithVoteStatus[] = [
    {
      id: "post-1",
      board_id: "board-1",
      author_id: "user-1",
      title: "Add dark mode",
      description: "It would be great to have a dark theme",
      status: "idea",
      vote_count: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      has_voted: false,
      comment_count: 2,
    },
  ];

  it("renders posts with titles", () => {
    renderWithProvider(<PostList posts={samplePosts} boardSlug="my-board" isLoggedIn={true} />);
    expect(screen.getByText("Add dark mode")).toBeTruthy();
  });

  it("accepts className for custom styling", () => {
    const { container } = renderWithProvider(
      <PostList posts={samplePosts} boardSlug="my-board" isLoggedIn={true} className="custom-list" />,
    );
    expect(container.querySelector(".custom-list")).toBeTruthy();
  });
});

// ─── 4. Action Test Example ────────────────────────────────────────────────────

describe("createBoardAction", () => {
  it("creates a board and returns its slug", async () => {
    const { supabase, chainable } = createMockSupabase({
      data: { slug: "my-new-board" },
    });
    chainable.single.mockResolvedValue({
      data: { slug: "my-new-board" },
      error: null,
    });

    const formData = buildFormData({ name: "My New Board", description: "A test board" });
    const result = await createBoardAction(supabase, "user-1", formData);

    expect(result.slug).toBe("my-new-board");
    expect(result.error).toBeUndefined();
  });

  it("returns error when Supabase fails", async () => {
    const { supabase, chainable } = createMockSupabase();
    chainable.single.mockResolvedValue({
      data: null,
      error: { message: "duplicate key" },
    });

    const formData = buildFormData({ name: "Duplicate Board", description: "" });
    const result = await createBoardAction(supabase, "user-1", formData);

    expect(result.error).toBeDefined();
  });
});
