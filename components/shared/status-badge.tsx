import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatEnumLabel } from "@/utils/format";

// FitFlow badges are soft tinted pills: quiet background + readable text.
const STATUS_STYLES: Record<string, string> = {
  // Shared / project
  PLANNING: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  ACTIVE: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  ON_HOLD: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  COMPLETED: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  ARCHIVED: "bg-muted text-muted-foreground",
  // Task
  BACKLOG: "bg-muted text-muted-foreground",
  READY: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  DEVELOPMENT: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
  REVIEW: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  TESTING: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  DONE: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  // Deploy environments
  LOCAL: "bg-muted text-muted-foreground",
  STAGING: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  PRODUCTION: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  // Priority
  LOW: "bg-muted text-muted-foreground",
  MEDIUM: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  HIGH: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  URGENT: "bg-red-500/10 text-red-700 dark:text-red-400",
  // Incident severity (LOW/MEDIUM/HIGH shared with priorities above)
  CRITICAL: "bg-red-500/20 text-red-800 dark:text-red-300",
  // Learning
  IN_PROGRESS: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  FINISHED: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  ABANDONED: "bg-muted text-muted-foreground",
};

interface StatusBadgeProps {
  value: string;
}

export function StatusBadge({ value }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn("font-normal", STATUS_STYLES[value])}>
      {formatEnumLabel(value)}
    </Badge>
  );
}
