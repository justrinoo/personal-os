import type { Metadata } from "next";
import { formatDistanceToNow } from "date-fns";
import {
  Activity,
  CircleAlert,
  CircleCheck,
  CircleHelp,
  CircleX,
  Plus,
} from "lucide-react";

import { deleteIncidentAction } from "@/actions/monitoring.actions";
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
import { IncidentFormDialog } from "@/features/monitoring/components/incident-form-dialog";
import { MonitorSyncButton } from "@/features/monitoring/components/monitor-sync-button";
import { ResolveIncidentButton } from "@/features/monitoring/components/resolve-incident-button";
import { safeQuery } from "@/lib/safe-query";
import {
  getHealthSummary,
  listIncidents,
  listMonitors,
} from "@/repositories/monitoring.repository";
import { listProjectOptions } from "@/repositories/project.repository";
import { formatDateTime } from "@/utils/format";

export const metadata: Metadata = { title: "Monitoring" };

export const dynamic = "force-dynamic";

const STATUS_ICONS = {
  up: <CircleCheck className="size-4 text-emerald-600 dark:text-emerald-400" />,
  down: <CircleX className="size-4 text-destructive" />,
  unknown: <CircleHelp className="size-4 text-muted-foreground" />,
};

export default async function MonitoringPage() {
  const [monitors, incidents, health, projects] = await Promise.all([
    safeQuery(() => listMonitors(), []),
    safeQuery(() => listIncidents(), []),
    safeQuery(
      () => getHealthSummary(),
      { up: 0, down: 0, unknown: 0, activeIncidents: 0 }
    ),
    safeQuery(() => listProjectOptions(), []),
  ]);

  return (
    <>
      <PageHeader
        title="Monitoring"
        description={`${health.data.up} up · ${health.data.down} down · ${health.data.activeIncidents} active incident(s)`}
      >
        <MonitorSyncButton />
        <IncidentFormDialog
          monitors={monitors.data.map((m) => ({ id: m.id, name: m.name }))}
          projects={projects.data}
          trigger={
            <Button size="sm">
              <Plus className="size-4" />
              Incident
            </Button>
          }
        />
      </PageHeader>
      <main className="flex flex-col gap-6 p-4 md:p-6">
        {!monitors.ok ? <DbOfflineBanner /> : null}

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Monitors</CardTitle>
            </CardHeader>
            <CardContent>
              {monitors.data.length === 0 ? (
                <EmptyState
                  icon={Activity}
                  title="No monitors"
                  description="Set UPTIME_KUMA_URL + UPTIME_KUMA_STATUS_SLUG in .env, then hit Sync."
                />
              ) : (
                <ul className="flex flex-col divide-y">
                  {monitors.data.map((monitor) => (
                    <li
                      key={monitor.id}
                      className="flex items-center justify-between gap-3 py-3"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        {STATUS_ICONS[
                          monitor.status as keyof typeof STATUS_ICONS
                        ] ?? STATUS_ICONS.unknown}
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate font-medium">
                            {monitor.name}
                          </span>
                          <span className="truncate text-xs text-muted-foreground">
                            {monitor.project?.name ?? "Unassigned"}
                            {monitor.lastCheckedAt
                              ? ` · checked ${formatDistanceToNow(monitor.lastCheckedAt, { addSuffix: true })}`
                              : ""}
                          </span>
                        </div>
                      </div>
                      <StatusBadge value={monitor.environment} />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Incidents</CardTitle>
            </CardHeader>
            <CardContent>
              {incidents.data.length === 0 ? (
                <EmptyState
                  icon={CircleAlert}
                  title="No incidents"
                  description="Open one manually when something breaks — link it to the deployment that caused it."
                />
              ) : (
                <ul className="flex flex-col divide-y">
                  {incidents.data.map((incident) => (
                    <li
                      key={incident.id}
                      className="flex flex-wrap items-center justify-between gap-3 py-3"
                    >
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <span className="inline-flex items-center gap-2 font-medium">
                          {incident.title}
                          <StatusBadge value={incident.severity} />
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(incident.startedAt)}
                          {incident.project ? ` · ${incident.project.name}` : ""}
                          {incident.resolvedAt
                            ? ` · resolved ${formatDistanceToNow(incident.resolvedAt, { addSuffix: true })}`
                            : " · active"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {!incident.resolvedAt ? (
                          <ResolveIncidentButton id={incident.id} />
                        ) : null}
                        <DeleteButton
                          action={deleteIncidentAction.bind(null, incident.id)}
                          title="Delete incident?"
                          description={`"${incident.title}" will be removed from history.`}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
