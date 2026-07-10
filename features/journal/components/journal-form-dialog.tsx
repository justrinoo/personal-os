"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { createJournalEntryAction } from "@/actions/journal.actions";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { journalSchema, type JournalInput } from "@/schemas/journal.schema";

interface JournalFormDialogProps {
  trigger: React.ReactNode;
}

const EMPTY_FIELDS = {
  goals: "",
  focus: "",
  reflection: "",
  wins: "",
  problems: "",
  lessons: "",
  tomorrow: "",
};

export function JournalFormDialog({ trigger }: JournalFormDialogProps) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<JournalInput>({
    resolver: zodResolver(journalSchema),
    defaultValues: {
      type: "MORNING",
      date: format(new Date(), "yyyy-MM-dd"),
      ...EMPTY_FIELDS,
    },
  });

  const entryType = watch("type");

  async function onSubmit(values: JournalInput) {
    const result = await createJournalEntryAction(values);
    if (result.ok) {
      toast.success("Journal entry saved");
      setOpen(false);
      reset({
        type: values.type,
        date: format(new Date(), "yyyy-MM-dd"),
        ...EMPTY_FIELDS,
      });
    } else {
      toast.error(result.error ?? "Something went wrong");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Journal Entry</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex items-end gap-4">
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Tabs value={field.value} onValueChange={field.onChange}>
                  <TabsList>
                    <TabsTrigger value="MORNING">Morning</TabsTrigger>
                    <TabsTrigger value="NIGHT">Night</TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
            />
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="jr-date">Date</Label>
              <Input id="jr-date" type="date" {...register("date")} />
            </div>
          </div>
          <FieldError message={errors.type?.message} />

          {entryType === "MORNING" ? (
            <>
              <div className="flex flex-col gap-2">
                <Label htmlFor="jr-goals">Goals for today</Label>
                <Textarea
                  id="jr-goals"
                  {...register("goals")}
                  placeholder="What do you want to accomplish?"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="jr-focus">Main focus</Label>
                <Textarea
                  id="jr-focus"
                  {...register("focus")}
                  placeholder="The one thing that matters most"
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <Label htmlFor="jr-reflection">Reflection</Label>
                <Textarea
                  id="jr-reflection"
                  {...register("reflection")}
                  placeholder="How did the day go?"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="jr-wins">Wins</Label>
                  <Textarea id="jr-wins" {...register("wins")} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="jr-problems">Problems</Label>
                  <Textarea id="jr-problems" {...register("problems")} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="jr-lessons">Lessons</Label>
                <Textarea id="jr-lessons" {...register("lessons")} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="jr-tomorrow">Tomorrow</Label>
                <Textarea
                  id="jr-tomorrow"
                  {...register("tomorrow")}
                  placeholder="What's the plan?"
                />
              </div>
            </>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save entry"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
