import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { PostForm } from "@neonwatty/feedback-board";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function NewPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/board/${slug}/new`);
  }

  const { data: board } = await supabase.from("boards").select("*").eq("slug", slug).single();

  if (!board) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2">
          <Link href={`/board/${slug}`}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to {board.name}
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Submit Feedback</h1>
        <p className="text-muted-foreground">Share your idea or feature request</p>
      </div>
      <PostForm boardId={board.id} />
    </div>
  );
}
