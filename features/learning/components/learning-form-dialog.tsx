"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { toast } from "sonner";

import {
  createLearningItemAction,
  updateLearningItemAction,
} from "@/actions/learning.actions";
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
import { LEARNING_STATUSES, LEARNING_TYPES } from "@/constants/enums";
import { learningSchema, type LearningInput } from "@/schemas/learning.schema";

interface ProjectOption {
  id: string;
  name: string;
}

interface LearningItemValues {
  id: string;
  title: string;
  type: LearningInput["type"];
  status: LearningInput["status"];
  sourceUrl: string | null;
  progress: number;
  startedAt: Date | null;
  finishedAt: Date | null;
  notes: string | null;
  issuer: string | null;
  credentialUrl: string | null;
  expiresAt: Date | null;
  projectId: string | null;
}

interface LearningFormDialogProps {
  projects: ProjectOption[];
  item?: LearningItemValues;
  trigger: React.ReactNode;
}

const NO_PROJECT = "__none__";

function toDateInput(date: Date | null): string {
  return date ? format(date, "yyyy-MM-dd") : "";
}

export function LearningFormDialog({
  projects,
  item,
  trigger,
}: LearningFormDialogProps) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LearningInput>({
    resolver: zodResolver(learningSchema),
    defaultValues: {
      title: item?.title ?? "",
      type: item?.type ?? "COURSE",
      status: item?.status ?? "BACKLOG",
      sourceUrl: item?.sourceUrl ?? "",
      progress: item?.progress ?? 0,
      startedAt: toDateInput(item?.startedAt ?? null),
      finishedAt: toDateInput(item?.finishedAt ?? null),
      notes: item?.notes ?? "",
      issuer: item?.issuer ?? "",
      credentialUrl: item?.credentialUrl ?? "",
      expiresAt: toDateInput(item?.expiresAt ?? null),
      projectId: item?.projectId ?? "",
    },
  });

  const type = watch("type");

  async function onSubmit(values: LearningInput) {
    const result = item
      ? await updateLearningItemAction(item.id, values)
      : await createLearningItemAction(values);
    if (result.ok) {
      toast.success(item ? "Learning item updated" : "Learning item added");
      setOpen(false);
      if (!item) reset();
    } else {
      toast.error(result.error ?? "Something went wrong");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {item ? "Edit Learning Item" : "New Learning Item"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="lr-title">Title</Label>
            <Input
              id="lr-title"
              {...register("title")}
              placeholder="Next.js App Router course"
            />
            <FieldError message={errors.title?.message} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Type</Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <EnumSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={LEARNING_TYPES}
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
                    options={LEARNING_STATUSES}
                  />
                )}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="lr-progress">Progress (%)</Label>
              <Input
                id="lr-progress"
                type="number"
                min={0}
                max={100}
                {...register("progress")}
              />
              <FieldError message={errors.progress?.message} />
            </div>
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
                    options={[
                      { value: NO_PROJECT, label: "No project" },
                      ...projects.map((project) => ({
                        value: project.id,
                        label: project.name,
                      })),
                    ]}
                  />
                )}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="lr-url">Source URL</Label>
            <Input
              id="lr-url"
              {...register("sourceUrl")}
              placeholder="https://…"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="lr-started">Started</Label>
              <Input id="lr-started" type="date" {...register("startedAt")} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="lr-finished">Finished</Label>
              <Input id="lr-finished" type="date" {...register("finishedAt")} />
            </div>
          </div>

          {type === "CERTIFICATION" ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="lr-issuer">Issuer</Label>
                  <Input
                    id="lr-issuer"
                    {...register("issuer")}
                    placeholder="AWS, Google, …"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="lr-expires">Expires</Label>
                  <Input id="lr-expires" type="date" {...register("expiresAt")} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="lr-credential">Credential URL</Label>
                <Input
                  id="lr-credential"
                  {...register("credentialUrl")}
                  placeholder="https://…"
                />
              </div>
            </>
          ) : null}

          <div className="flex flex-col gap-2">
            <Label htmlFor="lr-notes">Notes</Label>
            <Textarea id="lr-notes" {...register("notes")} placeholder="Optional" />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : item ? "Save changes" : "Add item"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
