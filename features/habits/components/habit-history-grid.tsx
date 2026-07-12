"use client";

import { useTransition } from "react";
import { addDays, format, startOfDay, startOfISOWeek, subWeeks } from "date-fns";
import { toast } from "sonner";

import { toggleHabitDayAction } from "@/actions/habit.actions";
import { cn } from "@/lib/utils";

interface HabitHistoryGridProps {
  habitId: string;
  /** Completed day strings (yyyy-MM-dd). */
  doneDays: string[];
  weeks?: number;
}

/**
 * Contribution-style history: one column per ISO week, one row per weekday.
 * Click any past cell to backfill or clear that day.
 */
export function HabitHistoryGrid({
  habitId,
  doneDays,
  weeks = 12,
}: HabitHistoryGridProps) {
  const [pending, startTransition] = useTransition();
  const done = new Set(doneDays);
  const today = startOfDay(new Date());
  const gridStart = startOfISOWeek(subWeeks(today, weeks - 1));

  function handleToggle(day: string) {
    startTransition(async () => {
      const result = await toggleHabitDayAction(habitId, day);
      if (!result.ok) toast.error(result.error ?? "Something went wrong");
    });
  }

  return (
    <div className="flex gap-1 overflow-x-auto pb-1">
      {Array.from({ length: weeks }).map((_, weekIndex) => (
        <div key={weekIndex} className="flex flex-col gap-1">
          {Array.from({ length: 7 }).map((_, dayIndex) => {
            const day = addDays(gridStart, weekIndex * 7 + dayIndex);
            const key = format(day, "yyyy-MM-dd");
            const isFuture = day.getTime() > today.getTime();
            const isDone = done.has(key);
            return (
              <button
                key={key}
                type="button"
                title={`${format(day, "EEE d MMM")}${isDone ? " · done" : ""}`}
                disabled={isFuture || pending}
                onClick={() => handleToggle(key)}
                className={cn(
                  "size-3.5 rounded-[4px] transition-colors",
                  isFuture
                    ? "cursor-default bg-transparent"
                    : isDone
                      ? "bg-primary hover:bg-(--primary-deep)"
                      : "bg-muted hover:bg-secondary"
                )}
                aria-label={`Toggle ${key}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
