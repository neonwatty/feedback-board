import type { SupabaseClient } from "@supabase/supabase-js";

export type PostStatus =
  | "idea"
  | "under_review"
  | "planned"
  | "in_progress"
  | "complete"
  | "closed";

export interface Board {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_by: string | null;
  created_at: string;
}

export interface Post {
  id: string;
  board_id: string;
  author_id: string | null;
  title: string;
  description: string | null;
  status: PostStatus;
  vote_count: number;
  created_at: string;
  updated_at: string;
}

export interface Vote {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string | null;
  body: string;
  created_at: string;
  updated_at: string;
}

// Joined / enriched types
export interface PostWithVoteStatus extends Post {
  has_voted: boolean;
  comment_count: number;
  author_email?: string | null;
}

export interface CommentWithAuthor extends Comment {
  author_email?: string | null;
}

export interface BoardWithPostCount extends Board {
  post_count: number;
}

// User type (minimal, from host's auth)
export interface FeedbackUser {
  id: string;
  email?: string | null;
}

// Action signatures for the provider
export interface FeedbackBoardActions {
  createBoard: (formData: FormData) => Promise<{ slug?: string; error?: string }>;
  createPost: (formData: FormData) => Promise<{ slug?: string; error?: string }>;
  toggleVote: (postId: string, boardSlug: string) => Promise<{ error?: string } | void>;
  updatePostStatus: (postId: string, status: PostStatus, boardSlug: string) => Promise<{ error?: string } | void>;
  createComment: (formData: FormData) => Promise<{ error?: string } | void>;
}

// Pure action function signatures (accept supabase client)
export type CreateBoardFn = (
  supabase: SupabaseClient,
  userId: string,
  formData: FormData
) => Promise<{ slug?: string; error?: string }>;

export type CreatePostFn = (
  supabase: SupabaseClient,
  userId: string,
  formData: FormData
) => Promise<{ slug?: string; error?: string }>;

export type ToggleVoteFn = (
  supabase: SupabaseClient,
  userId: string,
  postId: string,
  boardSlug: string
) => Promise<{ error?: string } | void>;

export type UpdatePostStatusFn = (
  supabase: SupabaseClient,
  userId: string,
  postId: string,
  status: PostStatus,
  boardSlug: string
) => Promise<{ error?: string } | void>;

export type CreateCommentFn = (
  supabase: SupabaseClient,
  userId: string,
  formData: FormData
) => Promise<{ error?: string } | void>;
