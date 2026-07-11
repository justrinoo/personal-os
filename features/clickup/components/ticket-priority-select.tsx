"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { setTicketPriorityAction } from "@/actions/clickup.actions";
import { EnumSelect } from "@/components/shared/enum-select";
import { PRIORITIES } from "@/constants/enums";

interface TicketPrioritySelectProps {
  taskId: string;
  currentPriority: string;
}

export function TicketPrioritySelect({
  taskId,
  currentPriority,
}: TicketPrioritySelectProps) {
  const [, startTransition] = useTransition();

  function handleChange(priority: string) {
    if (priority === currentPriority) return;
    startTransition(async () => {
      const result = await setTicketPriorityAction(taskId, priority);
      if (result.ok) {
        toast.success("Priority updated in ClickUp");
      } else {
        toast.error(result.error ?? "Failed to change priority");
      }
    });
  }

  return (
    <div className="w-28">
      <EnumSelect
        value={currentPriority}
        onChange={handleChange}
        options={PRIORITIES}
      />
    </div>
  );
}
