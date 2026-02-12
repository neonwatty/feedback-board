"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createComment(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const postId = formData.get("post_id") as string;
  const body = formData.get("body") as string;
  const boardSlug = formData.get("board_slug") as string;

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    author_id: user.id,
    body,
  });

  if (error) {
    return { error: "Failed to add comment." };
  }

  revalidatePath(`/board/${boardSlug}/post/${postId}`);
}
