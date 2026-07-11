"use client";

import { useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { syncAllClickUpAction } from "@/actions/clickup.actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SyncAllButton() {
  const [pending, startTransition] = useTransition();

  function handleSync() {
    startTransition(async () => {
      const result = await syncAllClickUpAction();
      if (result.ok) {
        toast.success(`Synced ${result.synced ?? 0} tickets from ClickUp`);
      } else {
        toast.error(result.error ?? "Sync failed");
      }
    });
  }

  return (
    <Button size="sm" onClick={handleSync} disabled={pending}>
      <RefreshCw className={cn("size-4", pending && "animate-spin")} />
      {pending ? "Syncing…" : "Sync all"}
    </Button>
  );
}
