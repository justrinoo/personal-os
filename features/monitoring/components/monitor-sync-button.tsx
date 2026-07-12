"use client";

import { useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { syncMonitorsAction } from "@/actions/monitoring.actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MonitorSyncButton() {
  const [pending, startTransition] = useTransition();

  function handleSync() {
    startTransition(async () => {
      const result = await syncMonitorsAction();
      if (result.ok) {
        toast.success(`Synced ${result.synced ?? 0} monitors from Uptime Kuma`);
      } else {
        toast.error(result.error ?? "Monitor sync failed");
      }
    });
  }

  return (
    <Button size="sm" variant="outline" onClick={handleSync} disabled={pending}>
      <RefreshCw className={cn("size-4", pending && "animate-spin")} />
      {pending ? "Syncing…" : "Sync Uptime Kuma"}
    </Button>
  );
}
