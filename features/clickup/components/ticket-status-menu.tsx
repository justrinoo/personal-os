"use client";

import { useState, useTransition } from "react";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";

import {
  getTicketStatusOptionsAction,
  setTicketStatusAction,
} from "@/actions/clickup.actions";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatEnumLabel } from "@/utils/format";

interface TicketStatusMenuProps {
  taskId: string;
  /** Raw ClickUp status name (lowercase). */
  currentStatus: string | null;
}

export function TicketStatusMenu({
  taskId,
  currentStatus,
}: TicketStatusMenuProps) {
  const [statuses, setStatuses] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [pending, startTransition] = useTransition();

  async function loadStatuses(open: boolean) {
    if (!open || statuses || loading) return;
    setLoading(true);
    const result = await getTicketStatusOptionsAction(taskId);
    setLoading(false);
    if (result.ok && result.statuses) {
      setStatuses(result.statuses);
    } else {
      toast.error(result.error ?? "Failed to load statuses");
    }
  }

  function handleSelect(status: string) {
    startTransition(async () => {
      const result = await setTicketStatusAction(taskId, status);
      if (result.ok) {
        toast.success(`Status changed to "${formatEnumLabel(status)}" in ClickUp`);
      } else {
        toast.error(result.error ?? "Failed to change status");
      }
    });
  }

  return (
    <DropdownMenu onOpenChange={loadStatuses}>
      <DropdownMenuTrigger disabled={pending} className="group">
        <Badge
          variant="outline"
          className="cursor-pointer font-normal group-disabled:opacity-50"
        >
          {currentStatus ? formatEnumLabel(currentStatus) : "Unknown"}
          <ChevronDown className="size-3" />
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {loading || !statuses ? (
          <DropdownMenuItem disabled>Loading statuses…</DropdownMenuItem>
        ) : (
          statuses.map((status) => (
            <DropdownMenuItem
              key={status}
              disabled={status === currentStatus}
              onSelect={() => handleSelect(status)}
            >
              {formatEnumLabel(status)}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
