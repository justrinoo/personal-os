import { addDays, startOfDay, subDays } from "date-fns";

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

/** Habits (by active state) with completed logs for the last `days` days. */
export function listHabitsWithHistory(
  isActive: boolean,
  days = 365
): Promise<HabitWithRecentLogs[]> {
  return prisma.habit.findMany({
    where: { isActive },
    include: {
      logs: {
        where: {
          completed: true,
          date: { gte: subDays(startOfDay(new Date()), days) },
        },
        orderBy: { date: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

/**
 * Backfill toggle for any (non-future) calendar day: removes the day's log
 * if present, otherwise creates a completed one at local midnight.
 */
export async function toggleHabitOnDay(
  habitId: string,
  day: Date
): Promise<boolean> {
  const start = startOfDay(day);
  const end = addDays(start, 1);
  const existing = await prisma.habitLog.findFirst({
    where: { habitId, date: { gte: start, lt: end } },
  });
  if (existing) {
    await prisma.habitLog.delete({ where: { id: existing.id } });
    return false;
  }
  await prisma.habitLog.create({
    data: { habitId, date: start, completed: true },
  });
  return true;
}

export function setHabitActive(id: string, isActive: boolean) {
  return prisma.habit.update({ where: { id }, data: { isActive } });
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
