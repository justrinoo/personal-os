import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { DbOfflineBanner } from "@/components/shared/db-offline-banner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ActivityByCategoryChart,
  ActivityByDayChart,
  MoodTrendChart,
} from "@/features/reports/components/report-charts";
import { PrintButton } from "@/features/reports/components/print-button";
import { safeQuery } from "@/lib/safe-query";
import { cn } from "@/lib/utils";
import {
  getReport,
  REPORT_RANGES,
  type ReportRange,
} from "@/services/report.service";
import { formatMinutes } from "@/utils/format";

export const metadata: Metadata = { title: "Reports" };

export const dynamic = "force-dynamic";

const EMPTY_REPORT = {
  activityByDay: [],
  activityByCategory: [],
  trend: [],
  totalMinutes: 0,
  activeDays: 0,
  tasksCompleted: 0,
  deployments: 0,
  habitConsistency: null,
};

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const range: ReportRange = REPORT_RANGES.includes(
    params.range as ReportRange
  )
    ? (params.range as ReportRange)
    : "week";

  const report = await safeQuery(() => getReport(range), EMPTY_REPORT);
  const focusedPerDay =
    report.data.activeDays > 0
      ? Math.round(report.data.totalMinutes / report.data.activeDays)
      : 0;

  const metrics = [
    { label: "Total focused", value: formatMinutes(report.data.totalMinutes) },
    { label: "Focused / active day", value: formatMinutes(focusedPerDay) },
    { label: "Tasks completed", value: String(report.data.tasksCompleted) },
    { label: "Deployments", value: String(report.data.deployments) },
    {
      label: "Habit consistency",
      value:
        report.data.habitConsistency === null
          ? "—"
          : `${Math.round(report.data.habitConsistency * 100)}%`,
    },
  ];

  return (
    <>
      <PageHeader title="Reports" description="Your data, turned into insight">
        <PrintButton />
      </PageHeader>
      <main className="flex flex-col gap-6 p-4 md:p-6 print:p-0">
        {!report.ok ? <DbOfflineBanner /> : null}

        <div className="flex flex-wrap gap-2 print:hidden">
          {REPORT_RANGES.map((option) => (
            <Link
              key={option}
              href={`/reports?range=${option}`}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors",
                option === range
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground shadow-(--elevation-1) hover:text-foreground"
              )}
            >
              {option}
            </Link>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {metrics.map((metric) => (
            <div key={metric.label} className="neu-panel flex flex-col gap-1 p-5">
              <span className="font-mono text-2xl font-semibold tracking-tight tabular-nums">
                {metric.value}
              </span>
              <span className="text-sm text-muted-foreground">
                {metric.label}
              </span>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Activity minutes per day</CardTitle>
            </CardHeader>
            <CardContent>
              {report.data.activityByDay.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No activities logged in this range.
                </p>
              ) : (
                <ActivityByDayChart data={report.data.activityByDay} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Time by category</CardTitle>
            </CardHeader>
            <CardContent>
              {report.data.activityByCategory.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No activities logged in this range.
                </p>
              ) : (
                <ActivityByCategoryChart
                  data={report.data.activityByCategory}
                />
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Mood & productivity trend</CardTitle>
            </CardHeader>
            <CardContent>
              {report.data.trend.every(
                (row) => row.mood === null && row.productivity === null
              ) ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Rate mood and productivity on your activities to see trends.
                </p>
              ) : (
                <MoodTrendChart data={report.data.trend} />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
