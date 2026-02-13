// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { StatusBadge, getStatusLabel, defaultStatusConfig } from "../../components/status/status-badge";
import { renderWithProvider } from "./helpers";
import type { PostStatus } from "../../types";

vi.mock("next/link", () => ({
  default: ({ children, ...props }: { children: React.ReactNode; href: string }) => <a {...props}>{children}</a>,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

describe("StatusBadge", () => {
  const statuses: PostStatus[] = ["idea", "under_review", "planned", "in_progress", "complete", "closed"];

  it.each(statuses)("renders correct label for %s status", (status) => {
    renderWithProvider(<StatusBadge status={status} />);
    expect(screen.getByText(defaultStatusConfig[status].label)).toBeInTheDocument();
  });

  it("applies custom className", () => {
    renderWithProvider(<StatusBadge status="idea" className="my-custom-class" />);
    const badge = screen.getByText("Idea");
    expect(badge.className).toContain("my-custom-class");
  });

  it("statusClassNames overrides default colors", () => {
    renderWithProvider(<StatusBadge status="idea" statusClassNames={{ idea: "bg-indigo-100 text-indigo-800" }} />);
    const badge = screen.getByText("Idea");
    expect(badge.className).toContain("bg-indigo-100");
    expect(badge.className).toContain("text-indigo-800");
    // tailwind-merge removes the conflicting default bg/text classes
    expect(badge.className).not.toContain("bg-gray-100");
    expect(badge.className).not.toContain("text-gray-800");
  });
});

describe("getStatusLabel", () => {
  it("returns correct label for each status", () => {
    expect(getStatusLabel("idea")).toBe("Idea");
    expect(getStatusLabel("under_review")).toBe("Under Review");
    expect(getStatusLabel("planned")).toBe("Planned");
    expect(getStatusLabel("in_progress")).toBe("In Progress");
    expect(getStatusLabel("complete")).toBe("Complete");
    expect(getStatusLabel("closed")).toBe("Closed");
  });
});
