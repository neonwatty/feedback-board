import { describe, it, expect } from "vitest";
import { createCommentAction } from "../../actions/comments";
import { createMockSupabase, buildFormData } from "../helpers/mock-supabase";

describe("createCommentAction", () => {
  const userId = "user-1";

  it("returns undefined on success", async () => {
    const { supabase, chainable } = createMockSupabase();
    chainable.insert.mockResolvedValue({ data: null, error: null });

    const formData = buildFormData({ post_id: "post-1", body: "Great idea!" });
    const result = await createCommentAction(supabase, userId, formData);

    expect(result).toBeUndefined();
    expect(chainable.insert).toHaveBeenCalledWith({
      post_id: "post-1",
      author_id: userId,
      body: "Great idea!",
    });
  });

  it("returns error on failure", async () => {
    const { supabase, chainable } = createMockSupabase();
    chainable.insert.mockResolvedValue({ data: null, error: { message: "fail" } });

    const formData = buildFormData({ post_id: "post-1", body: "Nice" });
    const result = await createCommentAction(supabase, userId, formData);

    expect(result).toEqual({ error: "Failed to add comment." });
  });
});
