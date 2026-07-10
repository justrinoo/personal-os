"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  createWorkspaceAction,
  updateWorkspaceAction,
} from "@/actions/workspace.actions";
import { EnumSelect } from "@/components/shared/enum-select";
import { FieldError } from "@/components/shared/field-error";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WORKSPACE_TYPES } from "@/constants/enums";
import { workspaceSchema, type WorkspaceInput } from "@/schemas/workspace.schema";

interface WorkspaceFormDialogProps {
  /** When provided the dialog edits instead of creates. */
  workspace?: {
    id: string;
    name: string;
    type: WorkspaceInput["type"];
    description: string | null;
  };
  trigger: React.ReactNode;
}

export function WorkspaceFormDialog({
  workspace,
  trigger,
}: WorkspaceFormDialogProps) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WorkspaceInput>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: workspace?.name ?? "",
      type: workspace?.type ?? "PERSONAL",
      description: workspace?.description ?? "",
    },
  });

  async function onSubmit(values: WorkspaceInput) {
    const result = workspace
      ? await updateWorkspaceAction(workspace.id, values)
      : await createWorkspaceAction(values);
    if (result.ok) {
      toast.success(workspace ? "Workspace updated" : "Workspace created");
      setOpen(false);
      if (!workspace) reset();
    } else {
      toast.error(result.error ?? "Something went wrong");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {workspace ? "Edit Workspace" : "New Workspace"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="ws-name">Name</Label>
            <Input id="ws-name" {...register("name")} placeholder="Office" />
            <FieldError message={errors.name?.message} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Type</Label>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <EnumSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={WORKSPACE_TYPES}
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="ws-description">Description</Label>
            <Textarea
              id="ws-description"
              {...register("description")}
              placeholder="Optional"
            />
            <FieldError message={errors.description?.message} />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : workspace ? "Save changes" : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
