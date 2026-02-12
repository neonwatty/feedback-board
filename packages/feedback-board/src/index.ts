// Provider
export { FeedbackBoardProvider, useFeedbackBoard } from "./provider";
export type { FeedbackBoardProviderProps } from "./provider";

// Types
export type {
  PostStatus,
  Board,
  Post,
  Vote,
  Comment,
  PostWithVoteStatus,
  CommentWithAuthor,
  BoardWithPostCount,
  FeedbackUser,
  FeedbackBoardActions,
  CreateBoardFn,
  CreatePostFn,
  ToggleVoteFn,
  UpdatePostStatusFn,
  CreateCommentFn,
} from "./types";

// Pure action functions
export {
  createBoardAction,
  createPostAction,
  toggleVoteAction,
  updatePostStatusAction,
  createCommentAction,
} from "./actions";

// Domain components
export { BoardCard } from "./components/board/board-card";
export { CreateBoardDialog } from "./components/board/create-board-dialog";
export { PostCard } from "./components/post/post-card";
export { PostList } from "./components/post/post-list";
export { PostForm } from "./components/post/post-form";
export { VoteButton } from "./components/post/vote-button";
export { PostStatusSelect } from "./components/post/post-status-select";
export { CommentForm } from "./components/comment/comment-form";
export { CommentList } from "./components/comment/comment-list";
export { RoadmapBoard } from "./components/roadmap/roadmap-board";
export { StatusBadge, STATUS_OPTIONS, getStatusLabel } from "./components/status/status-badge";
export { FeedbackLink } from "./components/feedback-link";

// Utilities
export { cn } from "./utils";
