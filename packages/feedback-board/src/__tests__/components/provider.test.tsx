// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeedbackBoardProvider, useFeedbackBoard } from "../../provider";
import { mockActions, mockUser } from "./helpers";

function Consumer() {
  const ctx = useFeedbackBoard();
  return (
    <div>
      <span data-testid="basePath">{ctx.basePath}</span>
      <span data-testid="loginPath">{ctx.loginPath}</span>
      <span data-testid="userId">{ctx.user?.id ?? "none"}</span>
    </div>
  );
}

describe("FeedbackBoardProvider", () => {
  it("renders children", () => {
    render(
      <FeedbackBoardProvider actions={mockActions} user={mockUser}>
        <p>hello</p>
      </FeedbackBoardProvider>,
    );
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("provides context values", () => {
    render(
      <FeedbackBoardProvider actions={mockActions} user={mockUser} basePath="/fb" loginPath="/signin">
        <Consumer />
      </FeedbackBoardProvider>,
    );
    expect(screen.getByTestId("basePath").textContent).toBe("/fb");
    expect(screen.getByTestId("loginPath").textContent).toBe("/signin");
    expect(screen.getByTestId("userId").textContent).toBe("user-1");
  });

  it("throws when hook used outside provider", () => {
    expect(() => render(<Consumer />)).toThrow("useFeedbackBoard must be used within a FeedbackBoardProvider");
  });
});
