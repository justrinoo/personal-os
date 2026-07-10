export interface SafeQueryResult<T> {
  data: T;
  /** false when the database was unreachable and the fallback was used */
  ok: boolean;
}

/**
 * Runs a database query and falls back to a default value when the
 * database is unreachable, so pages stay renderable before the local
 * PostgreSQL instance is configured.
 */
export async function safeQuery<T>(
  query: () => Promise<T>,
  fallback: T
): Promise<SafeQueryResult<T>> {
  try {
    return { data: await query(), ok: true };
  } catch {
    return { data: fallback, ok: false };
  }
}
