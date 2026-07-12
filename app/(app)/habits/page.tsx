import type { Metadata } from "next";
import { Archive, CalendarCheck, Plus } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { DbOfflineBanner } from "@/components/shared/db-offline-banner";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { HabitCard } from "@/features/habits/components/habit-card";
import { HabitFormDialog } from "@/features/habits/components/habit-form-dialog";
import { safeQuery } from "@/lib/safe-query";
import { listHabitsWithHistory } from "@/repositories/habit.repository";

export const metadata: Metadata = { title: "Habits" };

export const dynamic = "force-dynamic";

export default async function HabitsPage() {
  const [active, archived] = await Promise.all([
    safeQuery(() => listHabitsWithHistory(true), []),
    safeQuery(() => listHabitsWithHistory(false), []),
  ]);

  return (
    <>
      <PageHeader
        title="Habits"
        description="Streaks, history, and weekly targets — click any day to backfill"
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
        {!active.ok ? <DbOfflineBanner /> : null}

        {active.data.length === 0 && archived.data.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title="No habits yet"
            description="Add habits like workout, reading, or sleep to track consistency."
          />
        ) : (
          <>
            <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
              {active.data.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={{
                    id: habit.id,
                    name: habit.name,
                    description: habit.description,
                    targetDays: habit.targetDays,
                    isActive: habit.isActive,
                  }}
                  logDates={habit.logs.map((log) => log.date)}
                />
              ))}
            </div>

            {archived.data.length > 0 ? (
              <section className="flex flex-col gap-4">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-muted-foreground">
                  <Archive className="size-4" />
                  Archived
                </h2>
                <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                  {archived.data.map((habit) => (
                    <HabitCard
                      key={habit.id}
                      habit={{
                        id: habit.id,
                        name: habit.name,
                        description: habit.description,
                        targetDays: habit.targetDays,
                        isActive: habit.isActive,
                      }}
                      logDates={habit.logs.map((log) => log.date)}
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </>
        )}
      </main>
    </>
  );
}
