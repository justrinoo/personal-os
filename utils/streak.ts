import { addDays, format } from "date-fns";

export function toDayString(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

/**
 * Streaks over a set of day strings (yyyy-MM-dd). The current streak counts
 * back from `today`, tolerating a not-yet-logged today (i.e. a run ending
 * yesterday still counts as current).
 */
export function computeStreaks(
  days: string[],
  today: string
): { current: number; best: number } {
  const set = new Set(days);
  if (set.size === 0) return { current: 0, best: 0 };

  // best: longest consecutive run
  const sorted = [...set].sort();
  let best = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prevNext = toDayString(addDays(new Date(sorted[i - 1]), 1));
    run = prevNext === sorted[i] ? run + 1 : 1;
    if (run > best) best = run;
  }

  // current: walk back from today (or yesterday when today is empty)
  let cursor = set.has(today)
    ? today
    : toDayString(addDays(new Date(today), -1));
  let current = 0;
  while (set.has(cursor)) {
    current++;
    cursor = toDayString(addDays(new Date(cursor), -1));
  }

  return { current, best };
}
