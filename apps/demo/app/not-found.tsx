import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h2 className="text-lg font-semibold">Page not found</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Button asChild variant="outline" size="sm" className="mt-4">
        <Link href="/">Go home</Link>
      </Button>
    </div>
  );
}
