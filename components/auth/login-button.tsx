"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LoginButton() {
  return (
    <Button asChild variant="outline" size="sm">
      <Link href="/login">Sign in</Link>
    </Button>
  );
}
