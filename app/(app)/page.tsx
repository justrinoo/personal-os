import { Activity, ListTodo } from "lucide-react";

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
import {
  getDashboardStats,
  getRecentActivities,
  getRecentTasks,
} from "@/services/dashboard.service";
import { formatDateTime, formatEnumLabel, formatMinutes } from "@/utils/format";

// Always fetch fresh data — this is a live dashboard, not static content.
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [stats, recentTasks, recentActivities] = await Promise.all([
    getDashboardStats(),
    getRecentTasks(),
    getRecentActivities(),
  ]);

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
        </div>
      </main>
    </>
  );
}
