import type { SupabaseClient } from "@supabase/supabase-js";

/** Lifecycle status of a feedback post. */
export type PostStatus = "idea" | "under_review" | "planned" | "in_progress" | "complete" | "closed";

/** A feedback board that groups related posts. */
export interface Board {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_by: string | null;
  created_at: string;
}

/** A feedback post (feature request, bug report, etc.) within a board. */
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

/** A single upvote on a post. One per user per post. */
export interface Vote {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

/** A comment on a feedback post. */
export interface Comment {
  id: string;
  post_id: string;
  author_id: string | null;
  body: string;
  created_at: string;
  updated_at: string;
}

// Joined / enriched types

/** Post enriched with the current user's vote status and comment count. */
export interface PostWithVoteStatus extends Post {
  has_voted: boolean;
  comment_count: number;
  author_email?: string | null;
}

/** Comment enriched with the author's email for display. */
export interface CommentWithAuthor extends Comment {
  author_email?: string | null;
}

/** Board enriched with a count of its posts. */
export interface BoardWithPostCount extends Board {
  post_count: number;
}

/** Minimal user shape expected by the provider. Typically derived from Supabase auth. */
export interface FeedbackUser {
  id: string;
  email?: string | null;
}

/** Server action signatures passed to FeedbackBoardProvider. The host app implements these as "use server" wrappers. */
export interface FeedbackBoardActions {
  createBoard: (formData: FormData) => Promise<{ slug?: string; error?: string }>;
  createPost: (formData: FormData) => Promise<{ slug?: string; error?: string }>;
  toggleVote: (postId: string, boardSlug: string) => Promise<{ error?: string } | void>;
  updatePostStatus: (postId: string, status: PostStatus, boardSlug: string) => Promise<{ error?: string } | void>;
  createComment: (formData: FormData) => Promise<{ error?: string } | void>;
}

/** Pure function to create a board. FormData fields: `name`, `description`. */
export type CreateBoardFn = (
  supabase: SupabaseClient,
  userId: string,
  formData: FormData,
) => Promise<{ slug?: string; error?: string }>;

/** Pure function to create a post. FormData fields: `board_id`, `title`, `description`. */
export type CreatePostFn = (
  supabase: SupabaseClient,
  userId: string,
  formData: FormData,
) => Promise<{ slug?: string; error?: string }>;

/** Pure function to toggle a user's vote on a post (insert or delete). */
export type ToggleVoteFn = (
  supabase: SupabaseClient,
  userId: string,
  postId: string,
  boardSlug: string,
) => Promise<{ error?: string } | void>;

/** Pure function to update a post's status. Requires board admin permission via RLS. */
export type UpdatePostStatusFn = (
  supabase: SupabaseClient,
  userId: string,
  postId: string,
  status: PostStatus,
  boardSlug: string,
) => Promise<{ error?: string } | void>;

/** Pure function to add a comment to a post. FormData fields: `post_id`, `body`. */
export type CreateCommentFn = (
  supabase: SupabaseClient,
  userId: string,
  formData: FormData,
) => Promise<{ error?: string } | void>;
