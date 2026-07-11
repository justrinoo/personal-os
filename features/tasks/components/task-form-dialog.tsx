"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { createTaskAction, updateTaskAction } from "@/actions/task.actions";
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
import { PRIORITIES, TASK_STATUSES, TASK_TYPES } from "@/constants/enums";
import { taskSchema, type TaskInput } from "@/schemas/task.schema";

const NO_PROJECT = "__none__";

interface ProjectOption {
  id: string;
  name: string;
}

interface TaskFormDialogProps {
  projects: ProjectOption[];
  /** When provided the dialog edits instead of creates. */
  task?: {
    id: string;
    title: string;
    description: string | null;
    type: TaskInput["type"];
    status: TaskInput["status"];
    priority: TaskInput["priority"];
    dueDate: Date | null;
    projectId: string | null;
    gitBranch: string | null;
  };
  trigger: React.ReactNode;
}

export function TaskFormDialog({ projects, task, trigger }: TaskFormDialogProps) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskInput>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      type: task?.type ?? "DEVELOPMENT",
      status: task?.status ?? "BACKLOG",
      priority: task?.priority ?? "MEDIUM",
      dueDate: task?.dueDate ? task.dueDate.toISOString().slice(0, 10) : "",
      projectId: task?.projectId ?? "",
      gitBranch: task?.gitBranch ?? "",
    },
  });

  async function onSubmit(values: TaskInput) {
    const result = task
      ? await updateTaskAction(task.id, values)
      : await createTaskAction(values);
    if (result.ok) {
      toast.success(task ? "Task updated" : "Task created");
      setOpen(false);
      if (!task) reset();
    } else {
      toast.error(result.error ?? "Something went wrong");
    }
  }

  const projectOptions = [
    { value: NO_PROJECT, label: "No project" },
    ...projects.map((project) => ({ value: project.id, label: project.name })),
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "New Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              {...register("title")}
              placeholder="Implement login page"
            />
            <FieldError message={errors.title?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Project</Label>
              <Controller
                control={control}
                name="projectId"
                render={({ field }) => (
                  <EnumSelect
                    value={field.value || NO_PROJECT}
                    onChange={(value) =>
                      field.onChange(value === NO_PROJECT ? "" : value)
                    }
                    options={projectOptions}
                  />
                )}
              />
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
                    options={TASK_TYPES}
                  />
                )}
              />
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
                    options={TASK_STATUSES}
                  />
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Priority</Label>
              <Controller
                control={control}
                name="priority"
                render={({ field }) => (
                  <EnumSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={PRIORITIES}
                  />
                )}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="task-due">Due date</Label>
              <Input id="task-due" type="date" {...register("dueDate")} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="task-branch">Git branch</Label>
              <Input
                id="task-branch"
                {...register("gitBranch")}
                placeholder="feature/my-branch"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="task-description">Description</Label>
            <Textarea
              id="task-description"
              {...register("description")}
              placeholder="Optional"
            />
            <FieldError message={errors.description?.message} />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : task ? "Save changes" : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
