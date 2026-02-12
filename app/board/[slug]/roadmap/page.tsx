import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { RoadmapBoard } from "@/components/roadmap/roadmap-board";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function RoadmapPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: board } = await supabase
    .from("boards")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!board) notFound();

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("board_id", board.id);

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2">
          <Link href={`/board/${slug}`}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to {board.name}
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Roadmap</h1>
        <p className="text-muted-foreground">{board.name}</p>
      </div>
      <RoadmapBoard posts={posts ?? []} boardSlug={slug} />
    </div>
  );
}
