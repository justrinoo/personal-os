"use client";

import { useTransition } from "react";
import { CircleCheck } from "lucide-react";
import { toast } from "sonner";

import { resolveIncidentAction } from "@/actions/monitoring.actions";
import { Button } from "@/components/ui/button";

export function ResolveIncidentButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  function handleResolve() {
    startTransition(async () => {
      const result = await resolveIncidentAction(id);
      if (result.ok) {
        toast.success("Incident resolved");
      } else {
        toast.error(result.error ?? "Failed to resolve incident");
      }
    });
  }

  return (
    <Button size="sm" variant="outline" onClick={handleResolve} disabled={pending}>
      <CircleCheck className="size-4" />
      {pending ? "Resolving…" : "Resolve"}
    </Button>
  );
}
