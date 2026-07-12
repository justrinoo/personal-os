"use client";

import { useTransition } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";

import { toggleHabitTodayAction } from "@/actions/habit.actions";
import { cn } from "@/lib/utils";

interface TodayHabit {
  id: string;
  name: string;
  doneToday: boolean;
}

/** One-tap habit toggles for today, straight from the dashboard. */
export function TodayHabits({ habits }: { habits: TodayHabit[] }) {
  const [pending, startTransition] = useTransition();

  if (habits.length === 0) return null;

  function handleToggle(id: string) {
    startTransition(async () => {
      const result = await toggleHabitTodayAction(id);
      if (!result.ok) toast.error(result.error ?? "Something went wrong");
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {habits.map((habit) => (
        <button
          key={habit.id}
          type="button"
          onClick={() => handleToggle(habit.id)}
          disabled={pending}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
            habit.doneToday
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground shadow-(--elevation-1) hover:text-foreground"
          )}
        >
          <Check
            className={cn("size-3.5", !habit.doneToday && "opacity-40")}
          />
          {habit.name}
        </button>
      ))}
    </div>
  );
}
