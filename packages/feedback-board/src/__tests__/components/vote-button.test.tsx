// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VoteButton } from "../../components/post/vote-button";
import { renderWithProvider, mockActions } from "./helpers";

vi.mock("next/link", () => ({
  default: ({ children, ...props }: { children: React.ReactNode; href: string }) => <a {...props}>{children}</a>,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("lucide-react", () => ({
  ChevronUp: () => <span data-testid="chevron-up" />,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("VoteButton", () => {
  it("renders vote count", () => {
    renderWithProvider(
      <VoteButton postId="post-1" boardSlug="my-board" voteCount={5} hasVoted={false} isLoggedIn={true} />,
    );
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("calls toggleVote on click when logged in", async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <VoteButton postId="post-1" boardSlug="my-board" voteCount={3} hasVoted={false} isLoggedIn={true} />,
    );

    await user.click(screen.getByRole("button"));
    expect(mockActions.toggleVote).toHaveBeenCalledWith("post-1", "my-board");
  });

  it("optimistically increments count on click", async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <VoteButton postId="post-1" boardSlug="my-board" voteCount={3} hasVoted={false} isLoggedIn={true} />,
    );

    await user.click(screen.getByRole("button"));
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("redirects to loginPath when not logged in", async () => {
    const user = userEvent.setup();
    // Mock window.location.href
    const hrefSetter = vi.fn();
    Object.defineProperty(window, "location", {
      value: { href: "" },
      writable: true,
    });
    Object.defineProperty(window.location, "href", {
      set: hrefSetter,
      get: () => "",
    });

    renderWithProvider(
      <VoteButton postId="post-1" boardSlug="my-board" voteCount={3} hasVoted={false} isLoggedIn={false} />,
    );

    await user.click(screen.getByRole("button"));
    expect(hrefSetter).toHaveBeenCalledWith("/login");
    expect(mockActions.toggleVote).not.toHaveBeenCalled();
  });
});
