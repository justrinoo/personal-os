import type { Metadata } from "next";
import { CalendarCheck, Plus } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { DbOfflineBanner } from "@/components/shared/db-offline-banner";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { HabitCard } from "@/features/habits/components/habit-card";
import { HabitFormDialog } from "@/features/habits/components/habit-form-dialog";
import { safeQuery } from "@/lib/safe-query";
import { listActiveHabitsWithRecentLogs } from "@/repositories/habit.repository";

export const metadata: Metadata = { title: "Habits" };

export const dynamic = "force-dynamic";

export default async function HabitsPage() {
  const habits = await safeQuery(() => listActiveHabitsWithRecentLogs(), []);

  return (
    <>
      <PageHeader
        title="Habits"
        description="Daily habits and weekly consistency"
      >
        <HabitFormDialog
          trigger={
            <Button size="sm">
              <Plus className="size-4" />
              New Habit
            </Button>
          }
        />
      </PageHeader>
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
            {habits.data.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={{
                  id: habit.id,
                  name: habit.name,
                  description: habit.description,
                  targetDays: habit.targetDays,
                }}
                logs={habit.logs.map((log) => ({
                  date: log.date,
                  completed: log.completed,
                }))}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
