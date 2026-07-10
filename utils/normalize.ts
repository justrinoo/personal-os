/** Trims a form string; empty or whitespace-only becomes null. */
export function emptyToNull(value?: string): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/** Converts a "1".."5" rating select value to a number, "" to null. */
export function ratingToNumber(value?: string): number | null {
  return value ? Number(value) : null;
}
