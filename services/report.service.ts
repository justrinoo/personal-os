import {
  endOfDay,
  endOfISOWeek,
  endOfMonth,
  endOfYear,
  startOfDay,
  startOfISOWeek,
  startOfMonth,
  startOfYear,
} from "date-fns";

import { prisma } from "@/lib/prisma";

export const REPORT_RANGES = ["day", "week", "month", "year"] as const;
export type ReportRange = (typeof REPORT_RANGES)[number];

export function rangeToInterval(range: ReportRange): {
  start: Date;
  end: Date;
} {
  const now = new Date();
  switch (range) {
    case "day":
      return { start: startOfDay(now), end: endOfDay(now) };
    case "week":
      return { start: startOfISOWeek(now), end: endOfISOWeek(now) };
    case "month":
      return { start: startOfMonth(now), end: endOfMonth(now) };
    case "year":
      return { start: startOfYear(now), end: endOfYear(now) };
  }
}

export interface DayBucket {
  day: string; // yyyy-MM-dd
  minutes: number;
}

export interface CategoryBucket {
  category: string;
  minutes: number;
}

export interface TrendBucket {
  day: string;
  mood: number | null;
  productivity: number | null;
}

export interface ReportData {
  activityByDay: DayBucket[];
  activityByCategory: CategoryBucket[];
  trend: TrendBucket[];
  totalMinutes: number;
  activeDays: number;
  tasksCompleted: number;
  deployments: number;
  habitConsistency: number | null; // 0..1, null when no active habits
}

/** All report aggregations run in SQL/Prisma — never in components. */
export async function getReport(range: ReportRange): Promise<ReportData> {
  const { start, end } = rangeToInterval(range);

  const [byDayRaw, byCategory, trendRaw, tasksCompleted, deployments] =
    await Promise.all([
      prisma.$queryRaw<{ day: Date; minutes: bigint }[]>`
        SELECT date_trunc('day', "date") AS day, SUM("durationMin")::bigint AS minutes
        FROM daily_activities
        WHERE "date" BETWEEN ${start} AND ${end}
        GROUP BY 1 ORDER BY 1`,
      prisma.dailyActivity.groupBy({
        by: ["category"],
        where: { date: { gte: start, lte: end } },
        _sum: { durationMin: true },
        orderBy: { _sum: { durationMin: "desc" } },
      }),
      prisma.$queryRaw<
        { day: Date; mood: number | null; productivity: number | null }[]
      >`
        SELECT date_trunc('day', "date") AS day,
               AVG(mood)::float AS mood,
               AVG(productivity)::float AS productivity
        FROM daily_activities
        WHERE "date" BETWEEN ${start} AND ${end}
        GROUP BY 1 ORDER BY 1`,
      prisma.task.count({
        where: { status: "DONE", updatedAt: { gte: start, lte: end } },
      }),
      prisma.deployment.count({
        where: { deployedAt: { gte: start, lte: end } },
      }),
    ]);

  const [activeHabits, habitLogs] = await Promise.all([
    prisma.habit.count({ where: { isActive: true } }),
    prisma.habitLog.count({
      where: { completed: true, date: { gte: start, lte: end } },
    }),
  ]);

  const dayMs = 24 * 60 * 60 * 1000;
  const daysInRange = Math.max(
    1,
    Math.round((Math.min(end.getTime(), Date.now()) - start.getTime()) / dayMs)
  );

  const activityByDay = byDayRaw.map((row) => ({
    day: row.day.toISOString().slice(0, 10),
    minutes: Number(row.minutes),
  }));

  return {
    activityByDay,
    activityByCategory: byCategory.map((row) => ({
      category: row.category,
      minutes: row._sum.durationMin ?? 0,
    })),
    trend: trendRaw.map((row) => ({
      day: row.day.toISOString().slice(0, 10),
      mood: row.mood,
      productivity: row.productivity,
    })),
    totalMinutes: activityByDay.reduce((sum, row) => sum + row.minutes, 0),
    activeDays: activityByDay.length,
    tasksCompleted,
    deployments,
    habitConsistency:
      activeHabits > 0
        ? Math.min(1, habitLogs / (activeHabits * daysInRange))
        : null,
  };
}
