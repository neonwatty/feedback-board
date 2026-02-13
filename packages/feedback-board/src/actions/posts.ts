import type { SupabaseClient } from "@supabase/supabase-js";
import type { PostStatus } from "../types";

export async function createPostAction(
  supabase: SupabaseClient,
  userId: string,
  formData: FormData,
): Promise<{ slug?: string; error?: string }> {
  const boardId = formData.get("board_id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  const { error } = await supabase.from("posts").insert({
    board_id: boardId,
    author_id: userId,
    title,
    description: description || null,
  });

  if (error) {
    return { error: "Failed to create post." };
  }

  // Get the board slug for redirect
  const { data: board } = await supabase.from("boards").select("slug").eq("id", boardId).single();

  return { slug: board?.slug };
}

export async function toggleVoteAction(
  supabase: SupabaseClient,
  userId: string,
  postId: string,
  _boardSlug: string,
): Promise<{ error?: string } | void> {
  // Check if already voted
  const { data: existing } = await supabase
    .from("votes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .single();

  if (existing) {
    await supabase.from("votes").delete().eq("id", existing.id);
  } else {
    await supabase.from("votes").insert({
      post_id: postId,
      user_id: userId,
    });
  }
}

export async function updatePostStatusAction(
  supabase: SupabaseClient,
  _userId: string,
  postId: string,
  status: PostStatus,
  _boardSlug: string,
): Promise<{ error?: string } | void> {
  const { error } = await supabase.from("posts").update({ status }).eq("id", postId);

  if (error) {
    return { error: "Failed to update status." };
  }
}
