import { describe, it, expect } from "vitest";
import { createBoardAction } from "../../actions/boards";
import { createMockSupabase, buildFormData } from "../helpers/mock-supabase";

describe("createBoardAction", () => {
  const userId = "user-1";

  it("returns slug on success", async () => {
    const { supabase, chainable } = createMockSupabase();
    chainable.insert.mockResolvedValue({ data: null, error: null });

    const formData = buildFormData({ name: "Feature Requests", description: "Ideas for new features" });
    const result = await createBoardAction(supabase, userId, formData);

    expect(result).toEqual({ slug: "feature-requests" });
    expect(supabase.from).toHaveBeenCalledWith("boards");
    expect(chainable.insert).toHaveBeenCalledWith({
      name: "Feature Requests",
      slug: "feature-requests",
      description: "Ideas for new features",
      created_by: userId,
    });
  });

  it("returns error for duplicate slug (code 23505)", async () => {
    const { supabase, chainable } = createMockSupabase();
    chainable.insert.mockResolvedValue({ data: null, error: { code: "23505", message: "unique violation" } });

    const formData = buildFormData({ name: "Feature Requests", description: "" });
    const result = await createBoardAction(supabase, userId, formData);

    expect(result).toEqual({ error: "A board with this name already exists." });
  });

  it("returns generic error for other DB errors", async () => {
    const { supabase, chainable } = createMockSupabase();
    chainable.insert.mockResolvedValue({ data: null, error: { code: "42000", message: "unknown" } });

    const formData = buildFormData({ name: "Bug Reports", description: "" });
    const result = await createBoardAction(supabase, userId, formData);

    expect(result).toEqual({ error: "Failed to create board." });
  });

  it("sends null for empty description", async () => {
    const { supabase, chainable } = createMockSupabase();
    chainable.insert.mockResolvedValue({ data: null, error: null });

    const formData = buildFormData({ name: "Test", description: "" });
    await createBoardAction(supabase, userId, formData);

    expect(chainable.insert).toHaveBeenCalledWith(expect.objectContaining({ description: null }));
  });
});
