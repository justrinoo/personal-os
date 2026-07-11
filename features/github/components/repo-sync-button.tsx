"use client";

import { useTransition } from "react";
import { RefreshCw, Unlink } from "lucide-react";
import { toast } from "sonner";

import {
  syncGitHubAction,
  unlinkGitHubRepoAction,
} from "@/actions/github.actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function RepoSyncButton({ projectId }: { projectId: string }) {
  const [pending, startTransition] = useTransition();

  function handleSync() {
    startTransition(async () => {
      const result = await syncGitHubAction(projectId);
      if (result.ok) {
        toast.success(
          `Synced ${result.commits ?? 0} commits and ${result.pullRequests ?? 0} pull requests`
        );
      } else {
        toast.error(result.error ?? "GitHub sync failed");
      }
    });
  }

  function handleUnlink() {
    startTransition(async () => {
      const result = await unlinkGitHubRepoAction(projectId);
      if (result.ok) {
        toast.success("Repository unlinked");
      } else {
        toast.error(result.error ?? "Failed to unlink repository");
      }
    });
  }

  return (
    <div className="flex items-center gap-1.5">
      <Button size="sm" variant="outline" onClick={handleSync} disabled={pending}>
        <RefreshCw className={cn("size-4", pending && "animate-spin")} />
        {pending ? "Syncing…" : "Sync"}
      </Button>
      <Button
        size="icon-sm"
        variant="ghost"
        aria-label="Unlink repository"
        onClick={handleUnlink}
        disabled={pending}
      >
        <Unlink className="size-4 text-muted-foreground" />
      </Button>
    </div>
  );
}
