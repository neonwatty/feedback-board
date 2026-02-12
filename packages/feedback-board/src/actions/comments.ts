import type { SupabaseClient } from "@supabase/supabase-js";

export async function createCommentAction(
  supabase: SupabaseClient,
  userId: string,
  formData: FormData,
): Promise<{ error?: string } | void> {
  const postId = formData.get("post_id") as string;
  const body = formData.get("body") as string;

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    author_id: userId,
    body,
  });

  if (error) {
    return { error: "Failed to add comment." };
  }
}
