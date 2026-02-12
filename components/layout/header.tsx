import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LoginButton } from "@/components/auth/login-button";
import { UserMenu } from "@/components/auth/user-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { MessageSquare } from "lucide-react";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <MessageSquare className="h-5 w-5" />
          Feedback Board
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? <UserMenu user={user} /> : <LoginButton />}
        </div>
      </div>
    </header>
  );
}
