"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  createProjectAction,
  updateProjectAction,
} from "@/actions/project.actions";
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
import { PROJECT_STATUSES } from "@/constants/enums";
import { projectSchema, type ProjectInput } from "@/schemas/project.schema";

interface WorkspaceOption {
  id: string;
  name: string;
}

interface ProjectFormDialogProps {
  workspaces: WorkspaceOption[];
  /** When provided the dialog edits instead of creates. */
  project?: {
    id: string;
    name: string;
    description: string | null;
    status: ProjectInput["status"];
    workspaceId: string;
    repositoryUrl: string | null;
  };
  trigger: React.ReactNode;
}

export function ProjectFormDialog({
  workspaces,
  project,
  trigger,
}: ProjectFormDialogProps) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name ?? "",
      description: project?.description ?? "",
      status: project?.status ?? "PLANNING",
      workspaceId: project?.workspaceId ?? workspaces[0]?.id ?? "",
      repositoryUrl: project?.repositoryUrl ?? "",
    },
  });

  async function onSubmit(values: ProjectInput) {
    const result = project
      ? await updateProjectAction(project.id, values)
      : await createProjectAction(values);
    if (result.ok) {
      toast.success(project ? "Project updated" : "Project created");
      setOpen(false);
      if (!project) reset();
    } else {
      toast.error(result.error ?? "Something went wrong");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "New Project"}</DialogTitle>
        </DialogHeader>
        {workspaces.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Create a workspace first — every project belongs to one.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="pr-name">Name</Label>
              <Input
                id="pr-name"
                {...register("name")}
                placeholder="Personal OS"
              />
              <FieldError message={errors.name?.message} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Workspace</Label>
                <Controller
                  control={control}
                  name="workspaceId"
                  render={({ field }) => (
                    <EnumSelect
                      value={field.value}
                      onChange={field.onChange}
                      options={workspaces.map((workspace) => ({
                        value: workspace.id,
                        label: workspace.name,
                      }))}
                      placeholder="Select workspace"
                    />
                  )}
                />
                <FieldError message={errors.workspaceId?.message} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Status</Label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <EnumSelect
                      value={field.value}
                      onChange={field.onChange}
                      options={PROJECT_STATUSES}
                    />
                  )}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="pr-repo">Repository URL</Label>
              <Input
                id="pr-repo"
                {...register("repositoryUrl")}
                placeholder="https://github.com/user/repo (optional)"
              />
              <FieldError message={errors.repositoryUrl?.message} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="pr-description">Description</Label>
              <Textarea
                id="pr-description"
                {...register("description")}
                placeholder="Optional"
              />
              <FieldError message={errors.description?.message} />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : project ? "Save changes" : "Create"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
