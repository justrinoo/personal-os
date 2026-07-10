import { startOfDay, subDays } from "date-fns";

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";

export type HabitWithRecentLogs = Prisma.HabitGetPayload<{
  include: { logs: true };
}>;

/** Active habits with their logs from the last 7 days. */
export function listActiveHabitsWithRecentLogs(): Promise<HabitWithRecentLogs[]> {
  return prisma.habit.findMany({
    where: { isActive: true },
    include: {
      logs: {
        where: { date: { gte: subDays(startOfDay(new Date()), 6) } },
        orderBy: { date: "desc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

export function countCompletedToday(): Promise<number> {
  return prisma.habitLog.count({
    where: {
      completed: true,
      date: { gte: startOfDay(new Date()) },
    },
  });
}
