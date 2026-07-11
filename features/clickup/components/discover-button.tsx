"use client";

import { useTransition } from "react";
import { CloudDownload } from "lucide-react";
import { toast } from "sonner";

import { discoverClickUpAction } from "@/actions/clickup.actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Zero-config import: pulls every ticket assigned to me from ClickUp and
 * auto-creates one project per list — no IDs or links to paste.
 */
export function DiscoverButton() {
  const [pending, startTransition] = useTransition();

  function handleDiscover() {
    startTransition(async () => {
      const result = await discoverClickUpAction();
      if (result.ok) {
        const parts = [`${result.synced ?? 0} tickets synced`];
        if (result.createdProjects) {
          parts.push(`${result.createdProjects} project(s) created`);
        }
        if (result.removed) {
          parts.push(`${result.removed} no longer yours removed`);
        }
        toast.success(`ClickUp: ${parts.join(" · ")}`);
      } else {
        toast.error(result.error ?? "Discovery failed");
      }
    });
  }

  return (
    <Button variant="outline" size="sm" onClick={handleDiscover} disabled={pending}>
      <CloudDownload className={cn("size-4", pending && "animate-pulse")} />
      {pending ? "Importing…" : "Import my ClickUp tickets"}
    </Button>
  );
}
