import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge, STATUS_OPTIONS, getStatusLabel } from "@/components/status/status-badge";
import type { Post, PostStatus } from "@/lib/types/database";
import { ChevronUp } from "lucide-react";

interface RoadmapBoardProps {
  posts: Post[];
  boardSlug: string;
}

// Show only active statuses in roadmap (not idea/closed)
const ROADMAP_STATUSES: PostStatus[] = [
  "under_review",
  "planned",
  "in_progress",
  "complete",
];

export function RoadmapBoard({ posts, boardSlug }: RoadmapBoardProps) {
  const grouped = ROADMAP_STATUSES.reduce(
    (acc, status) => {
      acc[status] = posts
        .filter((p) => p.status === status)
        .sort((a, b) => b.vote_count - a.vote_count);
      return acc;
    },
    {} as Record<PostStatus, Post[]>
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {ROADMAP_STATUSES.map((status) => (
        <div key={status} className="space-y-3">
          <div className="flex items-center gap-2">
            <StatusBadge status={status} />
            <span className="text-sm text-muted-foreground">
              {grouped[status].length}
            </span>
          </div>
          <div className="space-y-2">
            {grouped[status].length === 0 ? (
              <p className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
                No items
              </p>
            ) : (
              grouped[status].map((post) => (
                <Link key={post.id} href={`/board/${boardSlug}/post/${post.id}`}>
                  <Card className="transition-colors hover:border-foreground/20">
                    <CardContent className="p-3">
                      <p className="text-sm font-medium">{post.title}</p>
                      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                        <ChevronUp className="h-3 w-3" />
                        {post.vote_count}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
