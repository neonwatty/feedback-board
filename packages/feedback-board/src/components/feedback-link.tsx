"use client";

import Link from "next/link";
import { useFeedbackBoard } from "../provider";

interface FeedbackLinkProps extends Omit<React.ComponentProps<typeof Link>, "href"> {
  href: string;
}

export function FeedbackLink({ href, ...props }: FeedbackLinkProps) {
  const { basePath } = useFeedbackBoard();
  const resolvedHref = href.startsWith("/") ? `${basePath}${href}` : href;
  return <Link href={resolvedHref} {...props} />;
}
