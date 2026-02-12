"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { PostStatus } from "@/lib/types/database";

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const boardId = formData.get("board_id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  const { error } = await supabase.from("posts").insert({
    board_id: boardId,
    author_id: user.id,
    title,
    description: description || null,
  });

  if (error) {
    return { error: "Failed to create post." };
  }

  // Get the board slug for redirect
  const { data: board } = await supabase
    .from("boards")
    .select("slug")
    .eq("id", boardId)
    .single();

  revalidatePath(`/board/${board?.slug}`);
  redirect(`/board/${board?.slug}`);
}

export async function toggleVote(postId: string, boardSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Must be logged in to vote." };
  }

  // Check if already voted
  const { data: existing } = await supabase
    .from("votes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .single();

  if (existing) {
    await supabase.from("votes").delete().eq("id", existing.id);
  } else {
    await supabase.from("votes").insert({
      post_id: postId,
      user_id: user.id,
    });
  }

  revalidatePath(`/board/${boardSlug}`);
}

export async function updatePostStatus(
  postId: string,
  status: PostStatus,
  boardSlug: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Must be logged in." };
  }

  const { error } = await supabase
    .from("posts")
    .update({ status })
    .eq("id", postId);

  if (error) {
    return { error: "Failed to update status." };
  }

  revalidatePath(`/board/${boardSlug}`);
  revalidatePath(`/admin/board/${boardSlug}`);
}
