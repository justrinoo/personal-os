"use client";

import { useTransition } from "react";
import { endOfISOWeek, isSameDay, startOfISOWeek } from "date-fns";
import { Archive, ArchiveRestore, Check, Flame, Pencil } from "lucide-react";
import { toast } from "sonner";

import {
  deleteHabitAction,
  setHabitActiveAction,
  toggleHabitTodayAction,
} from "@/actions/habit.actions";
import { DeleteButton } from "@/components/shared/delete-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HabitFormDialog } from "@/features/habits/components/habit-form-dialog";
import { HabitHistoryGrid } from "@/features/habits/components/habit-history-grid";
import { computeStreaks, toDayString } from "@/utils/streak";

interface HabitCardProps {
  habit: {
    id: string;
    name: string;
    description: string | null;
    targetDays: number;
    isActive: boolean;
  };
  /** Completed log dates (asc). */
  logDates: Date[];
}

export function HabitCard({ habit, logDates }: HabitCardProps) {
  const [pending, startTransition] = useTransition();
  const now = new Date();
  const doneDays = [...new Set(logDates.map((date) => toDayString(date)))];
  const streaks = computeStreaks(doneDays, toDayString(now));
  const doneToday = logDates.some((date) => isSameDay(date, now));
  const weekStart = startOfISOWeek(now);
  const weekEnd = endOfISOWeek(now);
  const doneThisWeek = new Set(
    logDates
      .filter((date) => date >= weekStart && date <= weekEnd)
      .map((date) => toDayString(date))
  ).size;
  const targetMet = doneThisWeek >= habit.targetDays;

  function handleToggleToday() {
    startTransition(async () => {
      const result = await toggleHabitTodayAction(habit.id);
      if (!result.ok) toast.error(result.error ?? "Something went wrong");
    });
  }

  function handleArchiveToggle() {
    startTransition(async () => {
      const result = await setHabitActiveAction(habit.id, !habit.isActive);
      if (result.ok) {
        toast.success(habit.isActive ? "Habit archived" : "Habit restored");
      } else {
        toast.error(result.error ?? "Something went wrong");
      }
    });
  }

  return (
    <Card className={habit.isActive ? undefined : "opacity-70"}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">{habit.name}</CardTitle>
            {habit.description ? (
              <p className="mt-1 text-sm text-muted-foreground">
                {habit.description}
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={habit.isActive ? "Archive habit" : "Restore habit"}
              onClick={handleArchiveToggle}
              disabled={pending}
            >
              {habit.isActive ? (
                <Archive className="size-4 text-muted-foreground" />
              ) : (
                <ArchiveRestore className="size-4 text-muted-foreground" />
              )}
            </Button>
            <HabitFormDialog
              habit={habit}
              trigger={
                <Button variant="ghost" size="icon-sm" aria-label="Edit habit">
                  <Pencil className="size-4 text-muted-foreground" />
                </Button>
              }
            />
            <DeleteButton
              action={deleteHabitAction.bind(null, habit.id)}
              title="Delete habit?"
              description={`"${habit.name}" and all its logs will be permanently removed.`}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <HabitHistoryGrid habitId={habit.id} doneDays={doneDays} />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Flame className="size-3.5 text-(--primary-deep)" />
              {streaks.current}d streak · best {streaks.best}d
            </span>
            <Badge
              className={
                targetMet
                  ? "bg-primary/20 text-(--primary-deep)"
                  : "bg-muted text-muted-foreground"
              }
            >
              {doneThisWeek}/{habit.targetDays} this week
            </Badge>
          </div>
          {habit.isActive ? (
            <Button
              variant={doneToday ? "secondary" : "default"}
              size="sm"
              onClick={handleToggleToday}
              disabled={pending}
            >
              <Check className="size-4" />
              {doneToday ? "Done today" : "Mark today"}
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
