"use client";

import { useState, useTransition } from "react";
import { formatDistanceToNow } from "date-fns";
import { Link2, RefreshCw, Unlink } from "lucide-react";
import { toast } from "sonner";

import {
  linkClickUpListAction,
  syncClickUpAction,
  unlinkClickUpListAction,
} from "@/actions/clickup.actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ClickUpCellProps {
  projectId: string;
  listId: string | null;
  listName: string | null;
  syncedAt: Date | null;
}

export function ClickUpCell({
  projectId,
  listId,
  listName,
  syncedAt,
}: ClickUpCellProps) {
  const [open, setOpen] = useState(false);
  const [inputListId, setInputListId] = useState("");
  const [pending, startTransition] = useTransition();

  function handleLink() {
    startTransition(async () => {
      const result = await linkClickUpListAction(projectId, inputListId);
      if (result.ok) {
        toast.success("ClickUp list linked");
        setOpen(false);
        setInputListId("");
      } else {
        toast.error(result.error ?? "Failed to link");
      }
    });
  }

  function handleSync() {
    startTransition(async () => {
      const result = await syncClickUpAction(projectId);
      if (result.ok) {
        toast.success(`Synced ${result.synced ?? 0} tasks from ClickUp`);
      } else {
        toast.error(result.error ?? "Sync failed");
      }
    });
  }

  function handleUnlink() {
    startTransition(async () => {
      const result = await unlinkClickUpListAction(projectId);
      if (result.ok) {
        toast.success("ClickUp list unlinked");
      } else {
        toast.error(result.error ?? "Failed to unlink");
      }
    });
  }

  if (!listId) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Link2 className="size-3.5" />
            Link
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link ClickUp List</DialogTitle>
            <DialogDescription>
              Tasks from this list will sync into the project. Find the list ID
              in the ClickUp URL: <code>…/v/li/&lt;list-id&gt;</code>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="cu-list-id">List ID</Label>
              <Input
                id="cu-list-id"
                value={inputListId}
                onChange={(event) => setInputListId(event.target.value)}
                placeholder="901234567"
              />
            </div>
            <Button onClick={handleLink} disabled={pending || !inputListId.trim()}>
              {pending ? "Validating…" : "Link list"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex min-w-0 flex-col leading-tight">
        <span className="truncate text-sm">{listName ?? listId}</span>
        <span className="text-xs text-muted-foreground">
          {syncedAt
            ? `synced ${formatDistanceToNow(syncedAt, { addSuffix: true })}`
            : "never synced"}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Sync now"
        onClick={handleSync}
        disabled={pending}
      >
        <RefreshCw
          className={cn("size-4 text-muted-foreground", pending && "animate-spin")}
        />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Unlink ClickUp list"
        onClick={handleUnlink}
        disabled={pending}
      >
        <Unlink className="size-4 text-muted-foreground" />
      </Button>
    </div>
  );
}
