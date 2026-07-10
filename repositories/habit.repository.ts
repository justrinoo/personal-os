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

export interface HabitData {
  name: string;
  description: string | null;
  targetDays: number;
}

export function createHabit(data: HabitData) {
  return prisma.habit.create({ data });
}

export function updateHabit(id: string, data: HabitData) {
  return prisma.habit.update({ where: { id }, data });
}

export function deleteHabit(id: string) {
  return prisma.habit.delete({ where: { id } });
}

/**
 * Toggles today's completion for a habit: creates a completed log if none
 * exists today, otherwise removes it.
 */
export async function toggleHabitToday(habitId: string): Promise<boolean> {
  const today = startOfDay(new Date());
  const existing = await prisma.habitLog.findFirst({
    where: { habitId, date: { gte: today } },
  });
  if (existing) {
    await prisma.habitLog.delete({ where: { id: existing.id } });
    return false;
  }
  await prisma.habitLog.create({
    data: { habitId, date: today, completed: true },
  });
  return true;
}
