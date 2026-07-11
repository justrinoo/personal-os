"use client";

import { useState, useTransition } from "react";
import { FolderGit2 } from "lucide-react";
import { toast } from "sonner";

import { linkGitHubRepoAction } from "@/actions/github.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RepoLinkForm({ projectId }: { projectId: string }) {
  const [reference, setReference] = useState("");
  const [pending, startTransition] = useTransition();

  function handleLink() {
    startTransition(async () => {
      const result = await linkGitHubRepoAction(projectId, reference);
      if (result.ok) {
        toast.success("Repository linked");
        setReference("");
      } else {
        toast.error(result.error ?? "Failed to link repository");
      }
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="w-full max-w-sm">
        <Input
          value={reference}
          onChange={(event) => setReference(event.target.value)}
          placeholder="owner/name or github.com URL"
          aria-label="Repository reference"
        />
      </div>
      <Button
        size="sm"
        onClick={handleLink}
        disabled={pending || !reference.trim()}
      >
        <FolderGit2 className="size-4" />
        {pending ? "Linking…" : "Link repository"}
      </Button>
    </div>
  );
}
