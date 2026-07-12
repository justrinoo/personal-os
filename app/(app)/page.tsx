import { Activity, ListTodo, Rocket } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { DbOfflineBanner } from "@/components/shared/db-offline-banner";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnimatedStats } from "@/features/dashboard/components/animated-stats";
import { TodayHabits } from "@/features/dashboard/components/today-habits";
import { safeQuery } from "@/lib/safe-query";
import { listDeployments } from "@/repositories/deployment.repository";
import { listActiveHabitsWithRecentLogs } from "@/repositories/habit.repository";
import { listInProgressItems } from "@/repositories/learning.repository";
import { getHealthSummary } from "@/repositories/monitoring.repository";
import {
  getDashboardStats,
  getRecentActivities,
  getRecentTasks,
} from "@/services/dashboard.service";
import { formatDateTime, formatEnumLabel, formatMinutes } from "@/utils/format";

// Always fetch fresh data — this is a live dashboard, not static content.
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [stats, recentTasks, recentActivities, recentDeployments, health] =
    await Promise.all([
      getDashboardStats(),
      getRecentTasks(),
      getRecentActivities(),
      safeQuery(() => listDeployments(5), []),
      safeQuery(
        () => getHealthSummary(),
        { up: 0, down: 0, unknown: 0, activeIncidents: 0 }
      ),
    ]);
  const todayHabits = await safeQuery(() => listActiveHabitsWithRecentLogs(), []);
  const learningNow = await safeQuery(() => listInProgressItems(), []);
  const today = new Date().toDateString();

  const dbOnline = stats.ok;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Daily overview of your engineering workspace"
      />
      <main className="flex flex-col gap-6 p-4 md:p-6">
        {!dbOnline ? <DbOfflineBanner /> : null}

        <AnimatedStats
          stats={[
            {
              key: "projects",
              title: "Active Projects",
              value: stats.data.activeProjects,
              format: "count",
              icon: "projects",
            },
            {
              key: "tasks",
              title: "Open Tasks",
              value: stats.data.openTasks,
              format: "count",
              icon: "tasks",
            },
            {
              key: "activity",
              title: "Today's Activity",
              value: stats.data.todayMinutes,
              format: "minutes",
              icon: "clock",
            },
            {
              key: "habits",
              title: "Habits Done Today",
              value: stats.data.habitsCompletedToday,
              format: "count",
              icon: "habits",
            },
          ]}
        />

        <TodayHabits
          habits={todayHabits.data.map((habit) => ({
            id: habit.id,
            name: habit.name,
            doneToday: habit.logs.some(
              (log) => log.completed && log.date.toDateString() === today
            ),
          }))}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {recentTasks.data.length === 0 ? (
                <EmptyState
                  icon={ListTodo}
                  title="No open tasks"
                  description="Tasks you create will show up here."
                />
              ) : (
                <ul className="flex flex-col divide-y">
                  {recentTasks.data.map((task) => (
                    <li
                      key={task.id}
                      className="flex items-center justify-between gap-3 py-3"
                    >
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate font-medium">
                          {task.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {task.project?.name ?? "No project"}
                        </span>
                      </div>
                      <StatusBadge value={task.status} />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivities.data.length === 0 ? (
                <EmptyState
                  icon={Activity}
                  title="No activities logged"
                  description="Log what you work on to build your daily timeline."
                />
              ) : (
                <ul className="flex flex-col divide-y">
                  {recentActivities.data.map((activity) => (
                    <li
                      key={activity.id}
                      className="flex items-center justify-between gap-3 py-3"
                    >
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate font-medium">
                          {activity.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatEnumLabel(activity.category)} ·{" "}
                          {formatDateTime(activity.date)}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground tabular-nums">
                        {formatMinutes(activity.durationMin)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {learningNow.data.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Learning now</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-3">
                  {learningNow.data.map((item) => (
                    <li key={item.id} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between gap-3">
                        <span className="truncate text-sm font-medium">
                          {item.title}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground tabular-nums">
                          {item.progress}%
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-2xl font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                    {health.data.up}
                  </span>
                  <span className="text-sm text-muted-foreground">Up</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-2xl font-semibold tabular-nums text-destructive">
                    {health.data.down}
                  </span>
                  <span className="text-sm text-muted-foreground">Down</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-2xl font-semibold text-muted-foreground tabular-nums">
                    {health.data.unknown}
                  </span>
                  <span className="text-sm text-muted-foreground">Unknown</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-2xl font-semibold tabular-nums">
                    {health.data.activeIncidents}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Active incidents
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Deployments</CardTitle>
            </CardHeader>
            <CardContent>
              {recentDeployments.data.length === 0 ? (
                <EmptyState
                  icon={Rocket}
                  title="No deployments yet"
                  description="Releases you record show up here."
                />
              ) : (
                <ul className="flex flex-col divide-y">
                  {recentDeployments.data.map((deployment) => (
                    <li
                      key={deployment.id}
                      className="flex items-center justify-between gap-3 py-3"
                    >
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate font-medium">
                          {deployment.project.name} · {deployment.version}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(deployment.deployedAt)}
                          {deployment.success ? "" : " · failed"}
                        </span>
                      </div>
                      <StatusBadge value={deployment.environment} />
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
