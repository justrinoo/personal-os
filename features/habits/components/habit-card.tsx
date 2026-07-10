"use client";

import { useTransition } from "react";
import { isSameDay, startOfDay, subDays } from "date-fns";
import { Check, Pencil } from "lucide-react";
import { toast } from "sonner";

import {
  deleteHabitAction,
  toggleHabitTodayAction,
} from "@/actions/habit.actions";
import { DeleteButton } from "@/components/shared/delete-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { HabitFormDialog } from "@/features/habits/components/habit-form-dialog";

interface HabitLogItem {
  date: Date;
  completed: boolean;
}

interface HabitCardProps {
  habit: {
    id: string;
    name: string;
    description: string | null;
    targetDays: number;
  };
  logs: HabitLogItem[];
}

/** Last 7 days, oldest first. */
function lastSevenDays(): Date[] {
  const today = startOfDay(new Date());
  return Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));
}

export function HabitCard({ habit, logs }: HabitCardProps) {
  const [pending, startTransition] = useTransition();
  const days = lastSevenDays();
  const doneCount = logs.filter((log) => log.completed).length;
  const doneToday = logs.some(
    (log) => log.completed && isSameDay(log.date, new Date())
  );

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleHabitTodayAction(habit.id);
      if (!result.ok) toast.error(result.error ?? "Something went wrong");
    });
  }

  return (
    <Card>
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
        <div className="flex items-center gap-1.5">
          {days.map((day) => {
            const done = logs.some(
              (log) => log.completed && isSameDay(log.date, day)
            );
            return (
              <div
                key={day.toISOString()}
                title={day.toDateString()}
                className={cn(
                  "h-6 flex-1 rounded",
                  done ? "bg-emerald-500" : "bg-muted"
                )}
              />
            );
          })}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {doneCount} of {habit.targetDays} days this week
          </p>
          <Button
            variant={doneToday ? "secondary" : "default"}
            size="sm"
            onClick={handleToggle}
            disabled={pending}
          >
            <Check className="size-4" />
            {doneToday ? "Done today" : "Mark today"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
