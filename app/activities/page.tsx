import type { Metadata } from "next";
import { Activity } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { DbOfflineBanner } from "@/components/shared/db-offline-banner";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { safeQuery } from "@/lib/safe-query";
import { listActivities } from "@/repositories/activity.repository";
import {
  formatDateTime,
  formatEnumLabel,
  formatMinutes,
} from "@/utils/format";

export const metadata: Metadata = { title: "Activities" };

export const dynamic = "force-dynamic";

export default async function ActivitiesPage() {
  const activities = await safeQuery(() => listActivities(), []);

  return (
    <>
      <PageHeader
        title="Daily Activities"
        description="Everything you do — coding, meetings, learning, and more"
      />
      <main className="flex flex-col gap-6 p-4 md:p-6">
        {!activities.ok ? <DbOfflineBanner /> : null}

        {activities.data.length === 0 ? (
          <EmptyState
            icon={Activity}
            title="No activities logged"
            description="Log activities to build your daily timeline and productivity insights."
          />
        ) : (
          <Card>
            <CardContent>
              <ul className="flex flex-col divide-y">
                {activities.data.map((activity) => (
                  <li
                    key={activity.id}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className="truncate font-medium">
                        {activity.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDateTime(activity.date)}
                        {activity.project ? ` · ${activity.project.name}` : ""}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <Badge variant="secondary" className="font-normal">
                        {formatEnumLabel(activity.category)}
                      </Badge>
                      <span className="text-sm text-muted-foreground tabular-nums">
                        {formatMinutes(activity.durationMin)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}
