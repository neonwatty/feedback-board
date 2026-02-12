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
