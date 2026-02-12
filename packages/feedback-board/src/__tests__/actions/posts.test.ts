import { describe, it, expect } from "vitest";
import { createPostAction, toggleVoteAction, updatePostStatusAction } from "../../actions/posts";
import { createMockSupabase, buildFormData } from "../helpers/mock-supabase";

describe("createPostAction", () => {
  const userId = "user-1";

  it("returns board slug on success", async () => {
    const { supabase, chainable } = createMockSupabase();
    // insert succeeds
    chainable.insert.mockResolvedValue({ data: null, error: null });
    // then select board slug
    chainable.single.mockResolvedValue({ data: { slug: "my-board" }, error: null });

    const formData = buildFormData({ board_id: "board-1", title: "Add dark mode", description: "Please" });
    const result = await createPostAction(supabase, userId, formData);

    expect(result).toEqual({ slug: "my-board" });
    expect(chainable.insert).toHaveBeenCalledWith({
      board_id: "board-1",
      author_id: userId,
      title: "Add dark mode",
      description: "Please",
    });
  });

  it("returns error when insert fails", async () => {
    const { supabase, chainable } = createMockSupabase();
    chainable.insert.mockResolvedValue({ data: null, error: { message: "fail" } });

    const formData = buildFormData({ board_id: "board-1", title: "Test", description: "" });
    const result = await createPostAction(supabase, userId, formData);

    expect(result).toEqual({ error: "Failed to create post." });
  });
});

describe("toggleVoteAction", () => {
  const userId = "user-1";

  it("inserts vote when none exists", async () => {
    const { supabase, chainable } = createMockSupabase();
    // no existing vote
    chainable.single.mockResolvedValue({ data: null, error: null });
    chainable.insert.mockResolvedValue({ data: null, error: null });

    await toggleVoteAction(supabase, userId, "post-1", "my-board");

    expect(chainable.insert).toHaveBeenCalledWith({
      post_id: "post-1",
      user_id: userId,
    });
  });

  it("deletes vote when one exists", async () => {
    const { supabase, chainable } = createMockSupabase();
    // existing vote found
    chainable.single.mockResolvedValue({ data: { id: "vote-1" }, error: null });

    await toggleVoteAction(supabase, userId, "post-1", "my-board");

    expect(supabase.from).toHaveBeenCalledWith("votes");
    expect(chainable.delete).toHaveBeenCalled();
  });
});

describe("updatePostStatusAction", () => {
  const userId = "user-1";

  it("returns undefined on success", async () => {
    const { supabase, chainable } = createMockSupabase();

    const result = await updatePostStatusAction(supabase, userId, "post-1", "planned", "my-board");

    expect(result).toBeUndefined();
    expect(chainable.update).toHaveBeenCalledWith({ status: "planned" });
  });

  it("returns error on failure", async () => {
    const { supabase } = createMockSupabase({ error: { message: "fail" } });

    const result = await updatePostStatusAction(supabase, userId, "post-1", "planned", "my-board");

    expect(result).toEqual({ error: "Failed to update status." });
  });
});
