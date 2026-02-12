import { Separator } from "../ui/separator";
import type { CommentWithAuthor } from "../../types";

function timeAgo(date: string): string {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

export function CommentList({ comments }: { comments: CommentWithAuthor[] }) {
  if (comments.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No comments yet. Be the first to share your thoughts.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment, i) => (
        <div key={comment.id}>
          {i > 0 && <Separator className="mb-4" />}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">
                {comment.author_email ?? "Anonymous"}
              </span>
              <span className="text-muted-foreground">
                {timeAgo(comment.created_at)}
              </span>
            </div>
            <p className="text-sm whitespace-pre-wrap">{comment.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
