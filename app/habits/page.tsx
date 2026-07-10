import type { Metadata } from "next";
import { isSameDay, startOfDay, subDays } from "date-fns";
import { CalendarCheck } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { DbOfflineBanner } from "@/components/shared/db-offline-banner";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { safeQuery } from "@/lib/safe-query";
import { listActiveHabitsWithRecentLogs } from "@/repositories/habit.repository";

export const metadata: Metadata = { title: "Habits" };

export const dynamic = "force-dynamic";

/** Last 7 days, oldest first. */
function lastSevenDays(): Date[] {
  const today = startOfDay(new Date());
  return Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));
}

export default async function HabitsPage() {
  const habits = await safeQuery(() => listActiveHabitsWithRecentLogs(), []);
  const days = lastSevenDays();

  return (
    <>
      <PageHeader
        title="Habits"
        description="Daily habits and weekly consistency"
      />
      <main className="flex flex-col gap-6 p-4 md:p-6">
        {!habits.ok ? <DbOfflineBanner /> : null}

        {habits.data.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title="No habits yet"
            description="Add habits like workout, reading, or sleep to track consistency."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {habits.data.map((habit) => {
              const doneCount = habit.logs.filter((log) => log.completed).length;

              return (
                <Card key={habit.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{habit.name}</CardTitle>
                    {habit.description ? (
                      <p className="text-sm text-muted-foreground">
                        {habit.description}
                      </p>
                    ) : null}
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    <div className="flex items-center gap-1.5">
                      {days.map((day) => {
                        const done = habit.logs.some(
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
                    <p className="text-xs text-muted-foreground">
                      {doneCount} of {habit.targetDays} days this week
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
