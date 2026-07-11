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

/** Surfaces ClickUp's own error message ("err" field) instead of a bare status. */
async function throwClickUpError(response: Response): Promise<never> {
  let detail = "";
  try {
    const body = (await response.json()) as { err?: string };
    detail = body.err ?? "";
  } catch {
    // non-JSON body — keep the status-based message
  }
  if (response.status === 401) {
    throw new ClickUpError("ClickUp rejected the token (401) — check CLICKUP_TOKEN and restart the dev server");
  }
  if (response.status === 404) {
    throw new ClickUpError("Not found in ClickUp (404) — check the ID");
  }
  if (response.status === 429) {
    throw new ClickUpError("ClickUp rate limit hit (429) — try again in a minute");
  }
  throw new ClickUpError(
    detail
      ? `ClickUp error (${response.status}): ${detail}`
      : `ClickUp API error (${response.status})`
  );
}

async function clickupFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${CLICKUP_API}${path}`, {
    headers: { Authorization: getToken() },
    cache: "no-store",
  });
  if (!response.ok) await throwClickUpError(response);
  return response.json() as Promise<T>;
}

/** Validates a list exists and returns its name. */
export async function fetchList(listId: string): Promise<RemoteList> {
  const list = await clickupFetch<{ id: string; name: string }>(
    `/list/${encodeURIComponent(listId)}`
  );
  return { id: list.id, name: list.name };
}

/** The list a ClickUp task belongs to. */
export async function fetchTaskList(taskId: string): Promise<RemoteList> {
  const task = await clickupFetch<{
    list?: { id: string; name: string };
  }>(`/task/${encodeURIComponent(taskId)}`);
  if (!task.list?.id) {
    throw new ClickUpError("ClickUp task found, but it has no parent list");
  }
  return { id: task.list.id, name: task.list.name };
}

/**
 * Resolves any user-pasted ClickUp reference to a list:
 * a numeric list ID, a ticket ID (e.g. "86d3nb3aj"), a task URL
 * (…/t/<id>), or a list URL (…/v/li/<id>).
 */
export async function resolveListReference(raw: string): Promise<RemoteList> {
  const input = raw.trim();
  // task URLs: app.clickup.com/t/<task-id> or /t/<team-id>/<task-id>
  const taskUrl = input.match(/\/t\/(?:\d+\/)?([a-z0-9_-]+)/i);
  if (taskUrl) return fetchTaskList(taskUrl[1]);
  const listUrl = input.match(/\/li\/(\d+)/i);
  if (listUrl) return fetchList(listUrl[1]);
  if (/^\d+$/.test(input)) return fetchList(input);
  return fetchTaskList(input);
}

/** The status options configured on a ClickUp list, in board order. */
export async function fetchListStatuses(listId: string): Promise<string[]> {
  const list = await clickupFetch<{
    statuses?: { status: string; orderindex?: number }[];
  }>(`/list/${encodeURIComponent(listId)}`);
  return (list.statuses ?? []).map((s) => s.status.toLowerCase());
}

// ClickUp priority levels: 1=urgent, 2=high, 3=normal, 4=low
const PRIORITY_TO_REMOTE: Record<Priority, number> = {
  URGENT: 1,
  HIGH: 2,
  MEDIUM: 3,
  LOW: 4,
};

/** Pushes a status and/or priority change to ClickUp. */
export async function updateRemoteTask(
  taskId: string,
  change: { status?: string; priority?: Priority }
): Promise<void> {
  const body: Record<string, unknown> = {};
  if (change.status) body.status = change.status;
  if (change.priority) body.priority = PRIORITY_TO_REMOTE[change.priority];

  const response = await fetch(
    `${CLICKUP_API}/task/${encodeURIComponent(taskId)}`,
    {
      method: "PUT",
      headers: {
        Authorization: getToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    }
  );
  if (!response.ok) await throwClickUpError(response);
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

/** The ClickUp user the configured token belongs to. */
export async function fetchAuthorizedUserId(): Promise<number> {
  const data = await clickupFetch<{ user: { id: number } }>("/user");
  return data.user.id;
}

/**
 * Fetches every task in a list (paginated, includes closed). When
 * `assigneeId` is given, ClickUp filters server-side to tasks assigned
 * to that user.
 */
export async function fetchAllListTasks(
  listId: string,
  assigneeId?: number
): Promise<RemoteTask[]> {
  const assigneeFilter = assigneeId ? `&assignees[]=${assigneeId}` : "";
  const tasks: RemoteTask[] = [];
  for (let page = 0; ; page++) {
    const data = await clickupFetch<{
      tasks: ClickUpTaskPayload[];
      last_page?: boolean;
    }>(
      `/list/${encodeURIComponent(listId)}/task?page=${page}&include_closed=true${assigneeFilter}`
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
