import { headers } from "next/headers";

import { auth } from "@/lib/auth";

/** Returns the current session or null. Server-side only. */
export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/**
 * Guard for server actions: resolves to true when a valid session exists.
 * Actions must return an error result when this is false (defense in depth —
 * middleware alone does not protect action endpoints).
 */
export async function isAuthenticated(): Promise<boolean> {
  return Boolean(await getSession());
}
