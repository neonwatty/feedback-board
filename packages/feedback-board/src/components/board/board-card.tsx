import { FeedbackLink } from "../feedback-link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { MessageSquare } from "lucide-react";
import type { BoardWithPostCount } from "../../types";

export function BoardCard({ board }: { board: BoardWithPostCount }) {
  return (
    <FeedbackLink href={`/board/${board.slug}`}>
      <Card className="transition-colors hover:border-foreground/20">
        <CardHeader>
          <CardTitle className="text-lg">{board.name}</CardTitle>
          {board.description && (
            <CardDescription>{board.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            {board.post_count} {board.post_count === 1 ? "post" : "posts"}
          </div>
        </CardContent>
      </Card>
    </FeedbackLink>
  );
}
