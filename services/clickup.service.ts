import type { Priority, TaskStatus } from "@/lib/generated/prisma/client";

const CLICKUP_API = "https://api.clickup.com/api/v2";

export class ClickUpError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ClickUpError";
  }
}

interface RemoteList {
  id: string;
  name: string;
}

export interface RemoteTask {
  id: string;
  name: string;
  description: string | null;
  status: string; // lowercase remote status name
  priority: Priority;
  url: string;
  dueDate: Date | null;
  remoteUpdatedAt: Date;
}

interface ClickUpTaskPayload {
  id: string;
  name: string;
  description?: string | null;
  status?: { status?: string };
  priority?: { priority?: string } | null;
  url: string;
  due_date?: string | null;
  date_updated?: string;
}

function getToken(): string {
  const token = process.env.CLICKUP_TOKEN;
  if (!token) {
    throw new ClickUpError(
      "ClickUp token not configured — set CLICKUP_TOKEN in .env"
    );
  }
  return token;
}

async function clickupFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${CLICKUP_API}${path}`, {
    headers: { Authorization: getToken() },
    cache: "no-store",
  });
  if (response.status === 401) {
    throw new ClickUpError("ClickUp rejected the token (401) — check CLICKUP_TOKEN");
  }
  if (response.status === 404) {
    throw new ClickUpError("ClickUp list not found (404) — check the list ID");
  }
  if (response.status === 429) {
    throw new ClickUpError("ClickUp rate limit hit (429) — try again in a minute");
  }
  if (!response.ok) {
    throw new ClickUpError(`ClickUp API error (${response.status})`);
  }
  return response.json() as Promise<T>;
}

/** Validates a list exists and returns its name. */
export async function fetchList(listId: string): Promise<RemoteList> {
  const list = await clickupFetch<{ id: string; name: string }>(
    `/list/${encodeURIComponent(listId)}`
  );
  return { id: list.id, name: list.name };
}

const PRIORITY_MAP: Record<string, Priority> = {
  urgent: "URGENT",
  high: "HIGH",
  normal: "MEDIUM",
  low: "LOW",
};

function mapRemoteTask(task: ClickUpTaskPayload): RemoteTask {
  return {
    id: task.id,
    name: task.name,
    description: task.description?.trim() || null,
    status: task.status?.status?.toLowerCase() ?? "unknown",
    priority: PRIORITY_MAP[task.priority?.priority ?? ""] ?? "MEDIUM",
    url: task.url,
    dueDate: task.due_date ? new Date(Number(task.due_date)) : null,
    remoteUpdatedAt: task.date_updated
      ? new Date(Number(task.date_updated))
      : new Date(),
  };
}

/** Fetches every task in a list (paginated, includes closed). */
export async function fetchAllListTasks(listId: string): Promise<RemoteTask[]> {
  const tasks: RemoteTask[] = [];
  for (let page = 0; ; page++) {
    const data = await clickupFetch<{
      tasks: ClickUpTaskPayload[];
      last_page?: boolean;
    }>(
      `/list/${encodeURIComponent(listId)}/task?page=${page}&include_closed=true`
    );
    tasks.push(...data.tasks.map(mapRemoteTask));
    if (data.last_page !== false || data.tasks.length === 0) break;
  }
  return tasks;
}

/**
 * Heuristic default when a remote status has no mapping yet. The result is
 * persisted to clickup_status_map so it can be corrected there later.
 */
export function guessLocalStatus(remoteStatus: string): TaskStatus {
  const s = remoteStatus.toLowerCase();
  if (/(complete|closed|done)/.test(s)) return "DONE";
  if (/(progress|doing|development|dev)/.test(s)) return "DEVELOPMENT";
  if (/review/.test(s)) return "REVIEW";
  if (/(test|qa)/.test(s)) return "TESTING";
  if (/ready/.test(s)) return "READY";
  if (/(plan)/.test(s)) return "PLANNING";
  return "BACKLOG";
}
