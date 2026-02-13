// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { CommentForm } from "../../components/comment/comment-form";
import { renderWithProvider } from "./helpers";

vi.mock("next/link", () => ({
  default: ({ children, ...props }: { children: React.ReactNode; href: string }) => <a {...props}>{children}</a>,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

describe("CommentForm", () => {
  it("renders textarea and submit button", () => {
    renderWithProvider(<CommentForm postId="post-1" boardSlug="my-board" />);
    expect(screen.getByPlaceholderText("Add a comment...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Post Comment" })).toBeInTheDocument();
  });

  it("has hidden fields for post_id and board_slug", () => {
    renderWithProvider(<CommentForm postId="post-42" boardSlug="feature-requests" />);
    const postIdField = document.querySelector('input[name="post_id"]') as HTMLInputElement;
    const boardSlugField = document.querySelector('input[name="board_slug"]') as HTMLInputElement;

    expect(postIdField).toBeTruthy();
    expect(postIdField.value).toBe("post-42");
    expect(boardSlugField).toBeTruthy();
    expect(boardSlugField.value).toBe("feature-requests");
  });

  it("applies custom className to form element", () => {
    const { container } = renderWithProvider(
      <CommentForm postId="post-1" boardSlug="my-board" className="my-custom-class" />,
    );
    const form = container.querySelector("form");
    expect(form).toBeTruthy();
    expect(form!.className).toContain("my-custom-class");
  });
});
