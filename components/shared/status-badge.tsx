import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatEnumLabel } from "@/utils/format";

const STATUS_STYLES: Record<string, string> = {
  // Shared / project
  PLANNING: "border-sky-500/40 text-sky-600 dark:text-sky-400",
  ACTIVE: "border-emerald-500/40 text-emerald-600 dark:text-emerald-400",
  ON_HOLD: "border-amber-500/40 text-amber-600 dark:text-amber-400",
  COMPLETED: "border-emerald-500/40 text-emerald-600 dark:text-emerald-400",
  ARCHIVED: "border-muted-foreground/40 text-muted-foreground",
  // Task
  BACKLOG: "border-muted-foreground/40 text-muted-foreground",
  READY: "border-sky-500/40 text-sky-600 dark:text-sky-400",
  DEVELOPMENT: "border-violet-500/40 text-violet-600 dark:text-violet-400",
  REVIEW: "border-amber-500/40 text-amber-600 dark:text-amber-400",
  TESTING: "border-amber-500/40 text-amber-600 dark:text-amber-400",
  DONE: "border-emerald-500/40 text-emerald-600 dark:text-emerald-400",
  // Priority
  LOW: "border-muted-foreground/40 text-muted-foreground",
  MEDIUM: "border-sky-500/40 text-sky-600 dark:text-sky-400",
  HIGH: "border-amber-500/40 text-amber-600 dark:text-amber-400",
  URGENT: "border-red-500/40 text-red-600 dark:text-red-400",
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
