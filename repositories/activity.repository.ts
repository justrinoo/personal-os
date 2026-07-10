import { startOfDay } from "date-fns";

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";

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
