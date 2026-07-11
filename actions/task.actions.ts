"use server";

import { revalidatePath } from "next/cache";

import {
  createTask,
  deleteTask,
  updateTask,
  type TaskData,
} from "@/repositories/task.repository";
import { taskSchema, type TaskInput } from "@/schemas/task.schema";
import { isAuthenticated } from "@/lib/require-auth";
import { ACTION_OK, actionError, type ActionResult } from "@/types/action";
import { emptyToNull } from "@/utils/normalize";

function revalidate() {
  revalidatePath("/tasks");
  revalidatePath("/projects");
  revalidatePath("/");
}

function toTaskData(input: TaskInput): TaskData {
  return {
    title: input.title.trim(),
    description: emptyToNull(input.description),
    type: input.type,
    status: input.status,
    priority: input.priority,
    dueDate: input.dueDate ? new Date(input.dueDate) : null,
    projectId: input.projectId || null,
    gitBranch: emptyToNull(input.gitBranch),
  };
}

export async function createTaskAction(input: TaskInput): Promise<ActionResult> {
  if (!(await isAuthenticated())) return actionError("Unauthorized");
  const parsed = taskSchema.safeParse(input);
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message ?? "Invalid input");
  }
  try {
    await createTask(toTaskData(parsed.data));
    revalidate();
    return ACTION_OK;
  } catch {
    return actionError("Failed to create task");
  }
}

export async function updateTaskAction(
  id: string,
  input: TaskInput
): Promise<ActionResult> {
  if (!(await isAuthenticated())) return actionError("Unauthorized");
  const parsed = taskSchema.safeParse(input);
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message ?? "Invalid input");
  }
  try {
    await updateTask(id, toTaskData(parsed.data));
    revalidate();
    return ACTION_OK;
  } catch {
    return actionError("Failed to update task");
  }
}

export async function deleteTaskAction(id: string): Promise<ActionResult> {
  if (!(await isAuthenticated())) return actionError("Unauthorized");
  try {
    await deleteTask(id);
    revalidate();
    return ACTION_OK;
  } catch {
    return actionError("Failed to delete task");
  }
}
