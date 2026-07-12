import Link from "next/link";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  startOfMonth,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { toDayString } from "@/utils/streak";

interface JournalCalendarProps {
  /** First day of the displayed month. */
  month: Date;
  /** Day strings that have a morning entry. */
  morningDays: Set<string>;
  /** Day strings that have a night entry. */
  nightDays: Set<string>;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function JournalCalendar({
  month,
  morningDays,
  nightDays,
}: JournalCalendarProps) {
  const days = eachDayOfInterval({
    start: startOfMonth(month),
    end: endOfMonth(month),
  });
  // Monday-first offset for the first row.
  const offset = (getDay(days[0]) + 6) % 7;
  const today = toDayString(new Date());
  const prev = format(addMonths(month, -1), "yyyy-MM");
  const next = format(addMonths(month, 1), "yyyy-MM");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-semibold">{format(month, "MMMM yyyy")}</span>
        <div className="flex items-center gap-1">
          <Link
            href={`/journal?month=${prev}`}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Previous month"
          >
            <ChevronLeft className="size-4" />
          </Link>
          <Link
            href={`/journal?month=${next}`}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Next month"
          >
            <ChevronRight className="size-4" />
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1.5 text-center text-xs text-muted-foreground">
        {WEEKDAYS.map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: offset }).map((_, index) => (
          <span key={`pad-${index}`} />
        ))}
        {days.map((day) => {
          const key = toDayString(day);
          const hasMorning = morningDays.has(key);
          const hasNight = nightDays.has(key);
          return (
            <div
              key={key}
              className={cn(
                "flex aspect-square flex-col items-center justify-center gap-0.5 rounded-lg text-xs",
                key === today && "ring-2 ring-primary",
                hasMorning || hasNight ? "bg-accent" : "bg-muted/50"
              )}
              title={`${key}${hasMorning ? " · morning" : ""}${hasNight ? " · night" : ""}`}
            >
              <span className="tabular-nums">{format(day, "d")}</span>
              <span className="flex gap-0.5">
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    hasMorning ? "bg-amber-500" : "bg-transparent"
                  )}
                />
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    hasNight ? "bg-indigo-400" : "bg-transparent"
                  )}
                />
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-amber-500" /> Morning
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-indigo-400" /> Night
        </span>
      </div>
    </div>
  );
}
