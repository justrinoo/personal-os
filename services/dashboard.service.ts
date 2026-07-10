import { safeQuery, type SafeQueryResult } from "@/lib/safe-query";
import {
  listActivities,
  sumTodayMinutes,
  type ActivityWithProject,
} from "@/repositories/activity.repository";
import { countCompletedToday } from "@/repositories/habit.repository";
import { countActiveProjects } from "@/repositories/project.repository";
import {
  countOpenTasks,
  listRecentTasks,
  type TaskWithProject,
} from "@/repositories/task.repository";

export interface DashboardStats {
  activeProjects: number;
  openTasks: number;
  todayMinutes: number;
  habitsCompletedToday: number;
}

const EMPTY_STATS: DashboardStats = {
  activeProjects: 0,
  openTasks: 0,
  todayMinutes: 0,
  habitsCompletedToday: 0,
};

export function getDashboardStats(): Promise<SafeQueryResult<DashboardStats>> {
  return safeQuery(async () => {
    const [activeProjects, openTasks, todayMinutes, habitsCompletedToday] =
      await Promise.all([
        countActiveProjects(),
        countOpenTasks(),
        sumTodayMinutes(),
        countCompletedToday(),
      ]);
    return { activeProjects, openTasks, todayMinutes, habitsCompletedToday };
  }, EMPTY_STATS);
}

export function getRecentTasks(): Promise<SafeQueryResult<TaskWithProject[]>> {
  return safeQuery(() => listRecentTasks(5), []);
}

export function getRecentActivities(): Promise<
  SafeQueryResult<ActivityWithProject[]>
> {
  return safeQuery(() => listActivities(5), []);
}
