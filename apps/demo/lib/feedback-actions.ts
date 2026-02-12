"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createBoardAction,
  createPostAction,
  toggleVoteAction,
  updatePostStatusAction,
  createCommentAction,
} from "@neonwatty/feedback-board/actions";
import type { PostStatus } from "@neonwatty/feedback-board";

export async function createBoard(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const result = await createBoardAction(supabase, user.id, formData);
  if (!result.error) revalidatePath("/");
  return result;
}

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const result = await createPostAction(supabase, user.id, formData);
  if (result.slug) revalidatePath(`/board/${result.slug}`);
  return result;
}

export async function toggleVote(postId: string, boardSlug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Must be logged in to vote." };

  const result = await toggleVoteAction(supabase, user.id, postId, boardSlug);
  revalidatePath(`/board/${boardSlug}`);
  return result;
}

export async function updatePostStatus(postId: string, status: PostStatus, boardSlug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Must be logged in." };

  const result = await updatePostStatusAction(supabase, user.id, postId, status, boardSlug);
  revalidatePath(`/board/${boardSlug}`);
  revalidatePath(`/admin/board/${boardSlug}`);
  return result;
}

export async function createComment(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const boardSlug = formData.get("board_slug") as string;
  const postId = formData.get("post_id") as string;

  const result = await createCommentAction(supabase, user.id, formData);
  revalidatePath(`/board/${boardSlug}/post/${postId}`);
  return result;
}
