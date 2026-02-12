import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { VoteButton } from "@/components/post/vote-button";
import { StatusBadge } from "@/components/status/status-badge";
import { CommentList } from "@/components/comment/comment-list";
import { CommentForm } from "@/components/comment/comment-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import type { CommentWithAuthor, PostStatus } from "@/lib/types/database";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!post) notFound();

  // Check if user voted
  let hasVoted = false;
  if (user) {
    const { data: vote } = await supabase
      .from("votes")
      .select("id")
      .eq("post_id", id)
      .eq("user_id", user.id)
      .single();
    hasVoted = !!vote;
  }

  // Fetch comments
  const { data: rawComments } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", id)
    .order("created_at", { ascending: true });

  // Get author emails for comments
  const authorIds = [
    ...new Set((rawComments ?? []).map((c) => c.author_id).filter(Boolean)),
  ];

  let emailMap: Record<string, string> = {};
  if (authorIds.length > 0) {
    // Use a simple approach - get emails from auth.users isn't directly queryable via client
    // We'll just show "User" for now - in production you'd have a profiles table
  }

  const comments: CommentWithAuthor[] = (rawComments ?? []).map((c) => ({
    ...c,
    author_email: c.author_id === user?.id ? user?.email : null,
  }));

  // Get post author email
  const postAuthorEmail =
    post.author_id === user?.id ? user?.email : null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button asChild variant="ghost" size="sm">
        <Link href={`/board/${slug}`}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Link>
      </Button>

      <div className="flex items-start gap-4">
        <VoteButton
          postId={post.id}
          boardSlug={slug}
          voteCount={post.vote_count}
          hasVoted={hasVoted}
          isLoggedIn={!!user}
        />
        <div className="flex-1 space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">{post.title}</h1>
          <div className="flex items-center gap-3">
            <StatusBadge status={post.status as PostStatus} />
            <span className="text-sm text-muted-foreground">
              {postAuthorEmail ?? "Anonymous"} &middot;{" "}
              {new Date(post.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {post.description && (
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {post.description}
        </p>
      )}

      <Separator />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          Comments ({comments.length})
        </h2>
        <CommentList comments={comments} />
        {user ? (
          <CommentForm postId={id} boardSlug={slug} />
        ) : (
          <p className="text-sm text-muted-foreground">
            <Link href="/login" className="underline">
              Sign in
            </Link>{" "}
            to leave a comment.
          </p>
        )}
      </div>
    </div>
  );
}
