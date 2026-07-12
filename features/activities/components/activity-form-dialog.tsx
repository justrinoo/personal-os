"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { createActivityAction } from "@/actions/activity.actions";
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
import { ACTIVITY_CATEGORIES } from "@/constants/enums";
import { activitySchema, type ActivityInput } from "@/schemas/activity.schema";

const NO_PROJECT = "__none__";
const NOT_RATED = "__none__";

const RATING_OPTIONS = [
  { value: NOT_RATED, label: "Not rated" },
  { value: "1", label: "1 — Poor" },
  { value: "2", label: "2" },
  { value: "3", label: "3 — Okay" },
  { value: "4", label: "4" },
  { value: "5", label: "5 — Great" },
];

interface ProjectOption {
  id: string;
  name: string;
}

interface LearningOption {
  id: string;
  title: string;
}

interface ActivityFormDialogProps {
  projects: ProjectOption[];
  learningItems?: LearningOption[];
  trigger: React.ReactNode;
}

export function ActivityFormDialog({
  projects,
  learningItems = [],
  trigger,
}: ActivityFormDialogProps) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ActivityInput>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      title: "",
      category: "CODING",
      date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      durationMin: 30,
      notes: "",
      mood: "",
      productivity: "",
      projectId: "",
      learningItemId: "",
    },
  });

  const category = watch("category");

  async function onSubmit(values: ActivityInput) {
    const result = await createActivityAction(values);
    if (result.ok) {
      toast.success("Activity logged");
      setOpen(false);
      reset({
        title: "",
        category: values.category,
        date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        durationMin: 30,
        notes: "",
        mood: "",
        productivity: "",
        projectId: values.projectId,
        learningItemId: "",
      });
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
          <DialogTitle>Log Activity</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="act-title">What did you do?</Label>
            <Input
              id="act-title"
              {...register("title")}
              placeholder="Refactored the sync module"
            />
            <FieldError message={errors.title?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Category</Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <EnumSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={ACTIVITY_CATEGORIES}
                  />
                )}
              />
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
                    options={projectOptions}
                  />
                )}
              />
            </div>
            {category === "LEARNING" && learningItems.length > 0 ? (
              <div className="col-span-2 flex flex-col gap-2">
                <Label>Learning item</Label>
                <Controller
                  control={control}
                  name="learningItemId"
                  render={({ field }) => (
                    <EnumSelect
                      value={field.value || NO_PROJECT}
                      onChange={(value) =>
                        field.onChange(value === NO_PROJECT ? "" : value)
                      }
                      options={[
                        { value: NO_PROJECT, label: "Not linked" },
                        ...learningItems.map((item) => ({
                          value: item.id,
                          label: item.title,
                        })),
                      ]}
                    />
                  )}
                />
              </div>
            ) : null}
            <div className="flex flex-col gap-2">
              <Label htmlFor="act-date">When</Label>
              <Input id="act-date" type="datetime-local" {...register("date")} />
              <FieldError message={errors.date?.message} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="act-duration">Duration (minutes)</Label>
              <Input
                id="act-duration"
                type="number"
                min={1}
                max={1440}
                {...register("durationMin")}
              />
              <FieldError message={errors.durationMin?.message} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Mood</Label>
              <Controller
                control={control}
                name="mood"
                render={({ field }) => (
                  <EnumSelect
                    value={field.value || NOT_RATED}
                    onChange={(value) =>
                      field.onChange(value === NOT_RATED ? "" : value)
                    }
                    options={RATING_OPTIONS}
                  />
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Productivity</Label>
              <Controller
                control={control}
                name="productivity"
                render={({ field }) => (
                  <EnumSelect
                    value={field.value || NOT_RATED}
                    onChange={(value) =>
                      field.onChange(value === NOT_RATED ? "" : value)
                    }
                    options={RATING_OPTIONS}
                  />
                )}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="act-notes">Notes</Label>
            <Textarea
              id="act-notes"
              {...register("notes")}
              placeholder="Optional"
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Log activity"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
