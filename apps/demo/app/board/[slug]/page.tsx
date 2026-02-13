import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PostList } from "@neonwatty/feedback-board";
import { Button } from "@/components/ui/button";
import { Plus, Map } from "lucide-react";
import type { PostWithVoteStatus } from "@neonwatty/feedback-board";

export default async function BoardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: board } = await supabase.from("boards").select("*").eq("slug", slug).single();

  if (!board) notFound();

  // Fetch posts with comment count
  const { data: posts } = await supabase
    .from("posts")
    .select("*, comments(count)")
    .eq("board_id", board.id)
    .order("vote_count", { ascending: false });

  // If logged in, get user's votes
  let userVotes: Set<string> = new Set();
  if (user) {
    const { data: votes } = await supabase.from("votes").select("post_id").eq("user_id", user.id);
    userVotes = new Set((votes ?? []).map((v) => v.post_id));
  }

  const postsWithStatus: PostWithVoteStatus[] = (posts ?? []).map((p) => ({
    ...p,
    has_voted: userVotes.has(p.id),
    comment_count: (p.comments as unknown as { count: number }[])?.[0]?.count ?? 0,
  }));

  const isAdmin = board.created_by === user?.id;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">{board.name}</h1>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/board/${slug}/roadmap`}>
                <Map className="mr-1 h-4 w-4" />
                Roadmap
              </Link>
            </Button>
            {isAdmin && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/board/${slug}`}>Admin</Link>
              </Button>
            )}
            {user && (
              <Button asChild size="sm">
                <Link href={`/board/${slug}/new`}>
                  <Plus className="mr-1 h-4 w-4" />
                  New Post
                </Link>
              </Button>
            )}
          </div>
        </div>
        {board.description && <p className="mt-1 text-muted-foreground">{board.description}</p>}
      </div>

      {postsWithStatus.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <h2 className="text-lg font-semibold">No posts yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {user ? "Be the first to submit feedback!" : "Sign in to submit feedback."}
          </p>
          {user && (
            <Button asChild className="mt-4" size="sm">
              <Link href={`/board/${slug}/new`}>
                <Plus className="mr-1 h-4 w-4" />
                New Post
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <PostList posts={postsWithStatus} boardSlug={slug} isLoggedIn={!!user} />
      )}
    </div>
  );
}
