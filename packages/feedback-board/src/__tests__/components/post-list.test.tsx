// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PostList } from "../../components/post/post-list";
import { renderWithProvider } from "./helpers";
import type { PostWithVoteStatus } from "../../types";

vi.mock("next/link", () => ({
  default: ({ children, ...props }: { children: React.ReactNode; href: string }) => <a {...props}>{children}</a>,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("lucide-react", () => ({
  ChevronUp: () => <span data-testid="chevron-up" />,
  ArrowUpDown: () => <span />,
  Clock: () => <span />,
  Filter: () => <span />,
  MessageSquare: () => <span />,
}));

const basePosts: PostWithVoteStatus[] = [
  {
    id: "p1",
    board_id: "b1",
    author_id: "u1",
    title: "First post",
    description: null,
    status: "idea",
    vote_count: 10,
    has_voted: false,
    comment_count: 2,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "p2",
    board_id: "b1",
    author_id: "u1",
    title: "Second post",
    description: null,
    status: "planned",
    vote_count: 5,
    has_voted: true,
    comment_count: 0,
    created_at: "2025-01-03T00:00:00Z",
    updated_at: "2025-01-03T00:00:00Z",
  },
  {
    id: "p3",
    board_id: "b1",
    author_id: "u1",
    title: "Third post",
    description: null,
    status: "in_progress",
    vote_count: 8,
    has_voted: false,
    comment_count: 1,
    created_at: "2025-01-02T00:00:00Z",
    updated_at: "2025-01-02T00:00:00Z",
  },
];

describe("PostList", () => {
  it("renders all posts", () => {
    renderWithProvider(<PostList posts={basePosts} boardSlug="my-board" isLoggedIn={true} />);
    expect(screen.getByText("First post")).toBeInTheDocument();
    expect(screen.getByText("Second post")).toBeInTheDocument();
    expect(screen.getByText("Third post")).toBeInTheDocument();
  });

  it("defaults to sorting by votes (highest first)", () => {
    renderWithProvider(<PostList posts={basePosts} boardSlug="my-board" isLoggedIn={true} />);
    const titles = screen.getAllByRole("link").map((el) => el.textContent);
    expect(titles).toEqual(["First post", "Third post", "Second post"]);
  });

  it("sorts by newest when button clicked", async () => {
    const user = userEvent.setup();
    renderWithProvider(<PostList posts={basePosts} boardSlug="my-board" isLoggedIn={true} />);

    await user.click(screen.getByRole("button", { name: /newest/i }));
    const titles = screen.getAllByRole("link").map((el) => el.textContent);
    expect(titles).toEqual(["Second post", "Third post", "First post"]);
  });

  it("sorts by oldest when button clicked", async () => {
    const user = userEvent.setup();
    renderWithProvider(<PostList posts={basePosts} boardSlug="my-board" isLoggedIn={true} />);

    await user.click(screen.getByRole("button", { name: /oldest/i }));
    const titles = screen.getAllByRole("link").map((el) => el.textContent);
    expect(titles).toEqual(["First post", "Third post", "Second post"]);
  });

  it("applies custom className to root div", () => {
    const { container } = renderWithProvider(
      <PostList posts={basePosts} boardSlug="my-board" isLoggedIn={true} className="my-custom-class" />,
    );
    const root = container.firstElementChild;
    expect(root).toBeTruthy();
    expect(root!.className).toContain("my-custom-class");
  });
});
