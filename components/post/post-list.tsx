"use client";

import { PostCard } from "@/components/post/post-card";
import { Button } from "@/components/ui/button";
import type { PostWithVoteStatus } from "@/lib/types/database";
import { ArrowUpDown, Clock, Filter } from "lucide-react";
import { useState } from "react";

interface PostListProps {
  posts: PostWithVoteStatus[];
  boardSlug: string;
  isLoggedIn: boolean;
}

type SortOption = "votes" | "newest" | "oldest";

export function PostList({ posts, boardSlug, isLoggedIn }: PostListProps) {
  const [sort, setSort] = useState<SortOption>("votes");

  const sorted = [...posts].sort((a, b) => {
    switch (sort) {
      case "votes":
        return b.vote_count - a.vote_count;
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Sort by:</span>
        <Button
          variant={sort === "votes" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setSort("votes")}
        >
          <ArrowUpDown className="mr-1 h-3 w-3" />
          Most votes
        </Button>
        <Button
          variant={sort === "newest" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setSort("newest")}
        >
          <Clock className="mr-1 h-3 w-3" />
          Newest
        </Button>
        <Button
          variant={sort === "oldest" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setSort("oldest")}
        >
          <Filter className="mr-1 h-3 w-3" />
          Oldest
        </Button>
      </div>
      <div className="space-y-2">
        {sorted.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            boardSlug={boardSlug}
            isLoggedIn={isLoggedIn}
          />
        ))}
      </div>
    </div>
  );
}
