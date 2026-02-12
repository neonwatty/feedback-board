import { createClient } from "@/lib/supabase/server";
import { BoardCard } from "@/components/board/board-card";
import { CreateBoardDialog } from "@/components/board/create-board-dialog";
import type { BoardWithPostCount } from "@/lib/types/database";
import { MessageSquare } from "lucide-react";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: boards } = await supabase
    .from("boards")
    .select("*, posts(count)")
    .order("created_at", { ascending: false });

  const boardsWithCount: BoardWithPostCount[] = (boards ?? []).map((b) => ({
    ...b,
    post_count: (b.posts as unknown as { count: number }[])?.[0]?.count ?? 0,
  }));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Boards</h1>
          <p className="text-muted-foreground">
            Browse boards and submit your feedback
          </p>
        </div>
        {user && <CreateBoardDialog />}
      </div>

      {boardsWithCount.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <MessageSquare className="mb-4 h-10 w-10 text-muted-foreground" />
          <h2 className="text-lg font-semibold">No boards yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {user
              ? "Create your first board to start collecting feedback."
              : "Sign in to create a board."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {boardsWithCount.map((board) => (
            <BoardCard key={board.id} board={board} />
          ))}
        </div>
      )}
    </div>
  );
}
