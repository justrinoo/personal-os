import type { Metadata } from "next";
import {
  Award,
  BookMarked,
  Clock,
  ExternalLink,
  GraduationCap,
  Pencil,
  Plus,
} from "lucide-react";

import { deleteLearningItemAction } from "@/actions/learning.actions";
import { PageHeader } from "@/components/layout/page-header";
import { DbOfflineBanner } from "@/components/shared/db-offline-banner";
import { DeleteButton } from "@/components/shared/delete-button";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LearningFormDialog } from "@/features/learning/components/learning-form-dialog";
import { safeQuery } from "@/lib/safe-query";
import {
  listLearningItems,
  type LearningItemWithRelations,
} from "@/repositories/learning.repository";
import { listProjectOptions } from "@/repositories/project.repository";
import { formatDate, formatEnumLabel, formatMinutes } from "@/utils/format";

export const metadata: Metadata = { title: "Learning" };

export const dynamic = "force-dynamic";

const SHELVES = [
  { key: "IN_PROGRESS", label: "In progress" },
  { key: "BACKLOG", label: "Backlog" },
  { key: "FINISHED", label: "Finished" },
  { key: "ABANDONED", label: "Abandoned" },
] as const;

function LearningCard({
  item,
  projects,
}: {
  item: LearningItemWithRelations;
  projects: { id: string; name: string }[];
}) {
  const invested = item.activities.reduce(
    (sum, activity) => sum + activity.durationMin,
    0
  );
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-1">
            <CardTitle className="flex items-center gap-2 text-base">
              {item.type === "CERTIFICATION" ? (
                <Award className="size-4 shrink-0 text-(--primary-deep)" />
              ) : (
                <BookMarked className="size-4 shrink-0 text-muted-foreground" />
              )}
              <span className="truncate">{item.title}</span>
              {item.sourceUrl ? (
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 text-muted-foreground hover:text-foreground"
                  title="Open source"
                >
                  <ExternalLink className="size-3.5" />
                </a>
              ) : null}
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              {formatEnumLabel(item.type)}
              {item.project ? ` · ${item.project.name}` : ""}
              {item.issuer ? ` · ${item.issuer}` : ""}
              {item.expiresAt ? ` · expires ${formatDate(item.expiresAt)}` : ""}
            </span>
          </div>
          <div className="flex shrink-0 items-center">
            <LearningFormDialog
              projects={projects}
              item={item}
              trigger={
                <Button variant="ghost" size="icon-sm" aria-label="Edit item">
                  <Pencil className="size-4 text-muted-foreground" />
                </Button>
              }
            />
            <DeleteButton
              action={deleteLearningItemAction.bind(null, item.id)}
              title="Delete learning item?"
              description={`"${item.title}" will be permanently removed.`}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2.5">
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${item.progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-mono tabular-nums">{item.progress}%</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" />
            {invested > 0 ? `${formatMinutes(invested)} invested` : "no time logged"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function LearningPage() {
  const [items, projects] = await Promise.all([
    safeQuery(() => listLearningItems(), []),
    safeQuery(() => listProjectOptions(), []),
  ]);

  return (
    <>
      <PageHeader
        title="Learning"
        description="Courses, books, certifications — with time invested from your activities"
      >
        <LearningFormDialog
          projects={projects.data}
          trigger={
            <Button size="sm">
              <Plus className="size-4" />
              New Item
            </Button>
          }
        />
      </PageHeader>
      <main className="flex flex-col gap-8 p-4 md:p-6">
        {!items.ok ? <DbOfflineBanner /> : null}

        {items.data.length === 0 ? (
          <EmptyState
            icon={GraduationCap}
            title="Nothing on the shelf yet"
            description="Add what you're learning — link LEARNING activities to it to track time invested."
          />
        ) : (
          SHELVES.map((shelf) => {
            const shelfItems = items.data.filter(
              (item) => item.status === shelf.key
            );
            if (shelfItems.length === 0) return null;
            return (
              <section key={shelf.key} className="flex flex-col gap-4">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  {shelf.label}
                  <StatusBadge value={shelf.key} />
                </h2>
                <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                  {shelfItems.map((item) => (
                    <LearningCard
                      key={item.id}
                      item={item}
                      projects={projects.data}
                    />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </main>
    </>
  );
}
