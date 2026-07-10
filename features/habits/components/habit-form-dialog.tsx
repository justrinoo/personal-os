"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createHabitAction, updateHabitAction } from "@/actions/habit.actions";
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
import { habitSchema, type HabitInput } from "@/schemas/habit.schema";

interface HabitFormDialogProps {
  /** When provided the dialog edits instead of creates. */
  habit?: {
    id: string;
    name: string;
    description: string | null;
    targetDays: number;
  };
  trigger: React.ReactNode;
}

export function HabitFormDialog({ habit, trigger }: HabitFormDialogProps) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HabitInput>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: habit?.name ?? "",
      description: habit?.description ?? "",
      targetDays: habit?.targetDays ?? 7,
    },
  });

  async function onSubmit(values: HabitInput) {
    const result = habit
      ? await updateHabitAction(habit.id, values)
      : await createHabitAction(values);
    if (result.ok) {
      toast.success(habit ? "Habit updated" : "Habit created");
      setOpen(false);
      if (!habit) reset();
    } else {
      toast.error(result.error ?? "Something went wrong");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{habit ? "Edit Habit" : "New Habit"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="hb-name">Name</Label>
            <Input id="hb-name" {...register("name")} placeholder="Workout" />
            <FieldError message={errors.name?.message} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="hb-target">Target days per week</Label>
            <Input
              id="hb-target"
              type="number"
              min={1}
              max={7}
              {...register("targetDays")}
            />
            <FieldError message={errors.targetDays?.message} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="hb-description">Description</Label>
            <Textarea
              id="hb-description"
              {...register("description")}
              placeholder="Optional"
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : habit ? "Save changes" : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
