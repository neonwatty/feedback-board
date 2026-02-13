// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { PostForm } from "../../components/post/post-form";
import { renderWithProvider } from "./helpers";

vi.mock("next/link", () => ({
  default: ({ children, ...props }: { children: React.ReactNode; href: string }) => <a {...props}>{children}</a>,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

describe("PostForm", () => {
  it("renders title and description fields", () => {
    renderWithProvider(<PostForm boardId="board-1" />);
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
  });

  it("renders submit button", () => {
    renderWithProvider(<PostForm boardId="board-1" />);
    expect(screen.getByRole("button", { name: "Submit Feedback" })).toBeInTheDocument();
  });

  it("has hidden board_id field with correct value", () => {
    renderWithProvider(<PostForm boardId="board-123" />);
    const hidden = document.querySelector('input[name="board_id"]') as HTMLInputElement;
    expect(hidden).toBeTruthy();
    expect(hidden.type).toBe("hidden");
    expect(hidden.value).toBe("board-123");
  });
});
