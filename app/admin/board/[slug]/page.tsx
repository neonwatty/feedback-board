import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PostStatusSelect } from "@/components/post/post-status-select";
import { StatusBadge } from "@/components/status/status-badge";
import { ArrowLeft, ChevronUp } from "lucide-react";
import type { PostStatus } from "@/lib/types/database";

export default async function AdminBoardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: board } = await supabase
    .from("boards")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!board) notFound();

  // Only board creator can admin
  if (board.created_by !== user.id) {
    redirect(`/board/${slug}`);
  }

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("board_id", board.id)
    .order("vote_count", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2">
          <Link href={`/board/${slug}`}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to {board.name}
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          Manage: {board.name}
        </h1>
        <p className="text-muted-foreground">Update post statuses</p>
      </div>

      {(posts ?? []).length === 0 ? (
        <p className="text-sm text-muted-foreground">No posts to manage.</p>
      ) : (
        <div className="space-y-2">
          {(posts ?? []).map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between gap-4 rounded-lg border p-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex items-center gap-0.5 text-sm text-muted-foreground">
                  <ChevronUp className="h-3 w-3" />
                  {post.vote_count}
                </span>
                <Link
                  href={`/board/${slug}/post/${post.id}`}
                  className="truncate font-medium hover:underline"
                >
                  {post.title}
                </Link>
              </div>
              <PostStatusSelect
                postId={post.id}
                currentStatus={post.status as PostStatus}
                boardSlug={slug}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
