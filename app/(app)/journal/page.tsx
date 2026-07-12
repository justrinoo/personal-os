import type { Metadata } from "next";
import {
  endOfISOWeek,
  endOfMonth,
  format,
  startOfISOWeek,
  startOfMonth,
} from "date-fns";
import { BookOpen, Flame, Moon, Pencil, Sun } from "lucide-react";

import { deleteJournalEntryAction } from "@/actions/journal.actions";
import { PageHeader } from "@/components/layout/page-header";
import { DbOfflineBanner } from "@/components/shared/db-offline-banner";
import { DeleteButton } from "@/components/shared/delete-button";
import { EmptyState } from "@/components/shared/empty-state";
import { Markdown } from "@/components/shared/markdown";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { JournalCalendar } from "@/features/journal/components/journal-calendar";
import { JournalFormDialog } from "@/features/journal/components/journal-form-dialog";
import { safeQuery } from "@/lib/safe-query";
import {
  countCompletePairs,
  listEntriesBetween,
  listJournalDays,
  listJournalEntries,
} from "@/repositories/journal.repository";
import { formatDate } from "@/utils/format";
import { computeStreaks, toDayString } from "@/utils/streak";

export const metadata: Metadata = { title: "Journal" };

export const dynamic = "force-dynamic";

interface JournalField {
  label: string;
  value: string | null;
}

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const month = /^\d{4}-\d{2}$/.test(params.month ?? "")
    ? new Date(`${params.month}-01`)
    : new Date();
  const now = new Date();

  const [entries, monthEntries, weekEntries, days, pairs] = await Promise.all([
    safeQuery(() => listJournalEntries(20), []),
    safeQuery(
      () => listEntriesBetween(startOfMonth(month), endOfMonth(month)),
      []
    ),
    safeQuery(
      () => listEntriesBetween(startOfISOWeek(now), endOfISOWeek(now)),
      []
    ),
    safeQuery(() => listJournalDays(), []),
    safeQuery(() => countCompletePairs(), 0),
  ]);

  const streaks = computeStreaks(
    days.data.map((day) => toDayString(day)),
    toDayString(now)
  );
  const morningDays = new Set(
    monthEntries.data
      .filter((entry) => entry.type === "MORNING")
      .map((entry) => toDayString(entry.date))
  );
  const nightDays = new Set(
    monthEntries.data
      .filter((entry) => entry.type === "NIGHT")
      .map((entry) => toDayString(entry.date))
  );

  const weekNights = weekEntries.data.filter((entry) => entry.type === "NIGHT");
  const review = (["wins", "problems", "lessons"] as const).map((field) => ({
    field,
    items: weekNights
      .filter((entry) => entry[field])
      .map((entry) => ({
        day: format(entry.date, "EEE"),
        text: entry[field] as string,
      })),
  }));

  return (
    <>
      <PageHeader
        title="Journal"
        description={`${streaks.current}-day streak · best ${streaks.best} · ${pairs.data} complete day(s)`}
      >
        <JournalFormDialog
          defaultType="MORNING"
          trigger={
            <Button size="sm" variant="outline">
              <Sun className="size-4 text-amber-500" />
              Morning
            </Button>
          }
        />
        <JournalFormDialog
          defaultType="NIGHT"
          trigger={
            <Button size="sm">
              <Moon className="size-4" />
              Night
            </Button>
          }
        />
      </PageHeader>
      <main className="flex flex-col gap-6 p-4 md:p-6">
        {!entries.ok ? <DbOfflineBanner /> : null}

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="size-5 text-(--primary-deep)" />
                Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <JournalCalendar
                month={startOfMonth(month)}
                morningDays={morningDays}
                nightDays={nightDays}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                This week in review ·{" "}
                {format(startOfISOWeek(now), "d MMM")}–
                {format(endOfISOWeek(now), "d MMM")}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {review.every((section) => section.items.length === 0) ? (
                <p className="py-4 text-sm text-muted-foreground">
                  Night entries this week will be aggregated here — wins,
                  problems, and lessons in one view.
                </p>
              ) : (
                review.map((section) => (
                  <div key={section.field}>
                    <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      {section.field}
                    </p>
                    {section.items.length === 0 ? (
                      <p className="text-sm text-muted-foreground">—</p>
                    ) : (
                      <ul className="flex flex-col gap-1">
                        {section.items.map((item, index) => (
                          <li key={index} className="flex gap-2 text-sm">
                            <span className="w-9 shrink-0 font-mono text-xs text-muted-foreground">
                              {item.day}
                            </span>
                            <span className="min-w-0 whitespace-pre-wrap">
                              {item.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {entries.data.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No journal entries"
            description="Start your day with goals, end it with reflection."
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {entries.data.map((entry) => {
              const fields: JournalField[] =
                entry.type === "MORNING"
                  ? [
                      { label: "Goals", value: entry.goals },
                      { label: "Focus", value: entry.focus },
                    ]
                  : [
                      { label: "Reflection", value: entry.reflection },
                      { label: "Wins", value: entry.wins },
                      { label: "Problems", value: entry.problems },
                      { label: "Lessons", value: entry.lessons },
                      { label: "Tomorrow", value: entry.tomorrow },
                    ];

              return (
                <Card key={entry.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="flex items-center gap-2 text-base">
                        {entry.type === "MORNING" ? (
                          <Sun className="size-4 text-amber-500" />
                        ) : (
                          <Moon className="size-4 text-indigo-400" />
                        )}
                        {entry.type === "MORNING" ? "Morning" : "Night"} ·{" "}
                        {formatDate(entry.date)}
                      </CardTitle>
                      <div className="flex items-center gap-1">
                        <JournalFormDialog
                          entry={entry}
                          trigger={
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              aria-label="Edit entry"
                            >
                              <Pencil className="size-4 text-muted-foreground" />
                            </Button>
                          }
                        />
                        <DeleteButton
                          action={deleteJournalEntryAction.bind(null, entry.id)}
                          title="Delete journal entry?"
                          description="This entry will be permanently removed."
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    {fields
                      .filter((field) => field.value)
                      .map((field) => (
                        <div key={field.label}>
                          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                            {field.label}
                          </p>
                          <Markdown>{field.value as string}</Markdown>
                        </div>
                      ))}
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
