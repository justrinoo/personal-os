import { format } from "date-fns";

/** "IN_PROGRESS" → "In Progress" */
export function formatEnumLabel(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** 150 → "2h 30m" */
export function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest}m`;
  if (rest === 0) return `${hours}h`;
  return `${hours}h ${rest}m`;
}

export function formatDate(date: Date): string {
  return format(date, "d MMM yyyy");
}

export function formatDateTime(date: Date): string {
  return format(date, "d MMM yyyy, HH:mm");
}
