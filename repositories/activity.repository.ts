import { startOfDay } from "date-fns";

import { prisma } from "@/lib/prisma";
import type {
  ActivityCategory,
  DailyActivity,
  Prisma,
} from "@/lib/generated/prisma/client";

export type ActivityWithProject = Prisma.DailyActivityGetPayload<{
  include: { project: true };
}>;

export function listActivities(limit?: number): Promise<ActivityWithProject[]> {
  return prisma.dailyActivity.findMany({
    include: { project: true },
    orderBy: { date: "desc" },
    take: limit,
  });
}

export async function sumTodayMinutes(): Promise<number> {
  const result = await prisma.dailyActivity.aggregate({
    _sum: { durationMin: true },
    where: { date: { gte: startOfDay(new Date()) } },
  });
  return result._sum.durationMin ?? 0;
}

export interface ActivityData {
  title: string;
  category: ActivityCategory;
  date: Date;
  durationMin: number;
  notes: string | null;
  mood: number | null;
  productivity: number | null;
  projectId: string | null;
  learningItemId: string | null;
}

export function createActivity(data: ActivityData): Promise<DailyActivity> {
  return prisma.dailyActivity.create({ data });
}

export function updateActivity(
  id: string,
  data: ActivityData
): Promise<DailyActivity> {
  return prisma.dailyActivity.update({ where: { id }, data });
}

export function deleteActivity(id: string): Promise<DailyActivity> {
  return prisma.dailyActivity.delete({ where: { id } });
}
