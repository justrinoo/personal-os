import type { Metadata } from "next";
import { BookOpen, Moon, Sun } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { DbOfflineBanner } from "@/components/shared/db-offline-banner";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { safeQuery } from "@/lib/safe-query";
import { listJournalEntries } from "@/repositories/journal.repository";
import { formatDate } from "@/utils/format";

export const metadata: Metadata = { title: "Journal" };

export const dynamic = "force-dynamic";

interface JournalField {
  label: string;
  value: string | null;
}

export default async function JournalPage() {
  const entries = await safeQuery(() => listJournalEntries(), []);

  return (
    <>
      <PageHeader
        title="Journal"
        description="Morning intentions and night reflections"
      />
      <main className="flex flex-col gap-6 p-4 md:p-6">
        {!entries.ok ? <DbOfflineBanner /> : null}

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
                    <CardTitle className="flex items-center gap-2 text-base">
                      {entry.type === "MORNING" ? (
                        <Sun className="size-4 text-amber-500" />
                      ) : (
                        <Moon className="size-4 text-indigo-400" />
                      )}
                      {entry.type === "MORNING" ? "Morning" : "Night"} ·{" "}
                      {formatDate(entry.date)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    {fields
                      .filter((field) => field.value)
                      .map((field) => (
                        <div key={field.label}>
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {field.label}
                          </p>
                          <p className="whitespace-pre-wrap text-sm">
                            {field.value}
                          </p>
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
