import { z } from "zod";

import { PRIORITIES, TASK_STATUSES, TASK_TYPES } from "@/constants/enums";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional(),
  type: z.enum(TASK_TYPES),
  status: z.enum(TASK_STATUSES),
  priority: z.enum(PRIORITIES),
  // From <input type="date">; empty string means no due date.
  dueDate: z.string().optional(),
  // Empty string means "no project".
  projectId: z.string().optional(),
});

export type TaskInput = z.infer<typeof taskSchema>;
