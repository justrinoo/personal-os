/** Returns the value only when it is one of the allowed enum members. */
export function pickEnum<T extends string>(
  value: string | undefined,
  allowed: readonly T[]
): T | undefined {
  return allowed.includes(value as T) ? (value as T) : undefined;
}
