import { FeedbackLink } from "../feedback-link";
import { VoteButton } from "./vote-button";
import { StatusBadge } from "../status/status-badge";
import { MessageSquare } from "lucide-react";
import type { PostWithVoteStatus } from "../../types";

interface PostCardProps {
  post: PostWithVoteStatus;
  boardSlug: string;
  isLoggedIn: boolean;
}

export function PostCard({ post, boardSlug, isLoggedIn }: PostCardProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50">
      <VoteButton
        postId={post.id}
        boardSlug={boardSlug}
        voteCount={post.vote_count}
        hasVoted={post.has_voted}
        isLoggedIn={isLoggedIn}
      />
      <div className="flex-1 min-w-0">
        <FeedbackLink
          href={`/board/${boardSlug}/post/${post.id}`}
          className="font-medium hover:underline"
        >
          {post.title}
        </FeedbackLink>
        {post.description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {post.description}
          </p>
        )}
        <div className="mt-2 flex items-center gap-3">
          <StatusBadge status={post.status} />
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <MessageSquare className="h-3 w-3" />
            {post.comment_count}
          </span>
        </div>
      </div>
    </div>
  );
}
