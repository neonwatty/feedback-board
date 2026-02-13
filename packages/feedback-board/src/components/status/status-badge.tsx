import { Badge } from "../ui/badge";
import type { PostStatus } from "../../types";

const statusConfig: Record<PostStatus, { label: string; className: string }> = {
  idea: {
    label: "Idea",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  },
  under_review: {
    label: "Under Review",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  planned: {
    label: "Planned",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  },
  complete: {
    label: "Complete",
    className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  closed: {
    label: "Closed",
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
};

export const STATUS_OPTIONS: PostStatus[] = ["idea", "under_review", "planned", "in_progress", "complete", "closed"];

export function StatusBadge({ status }: { status: PostStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant="secondary" className={config.className}>
      {config.label}
    </Badge>
  );
}

export function getStatusLabel(status: PostStatus): string {
  return statusConfig[status].label;
}
