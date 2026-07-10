import { z } from "zod";

import { ACTIVITY_CATEGORIES } from "@/constants/enums";

const RATING_VALUES = ["", "1", "2", "3", "4", "5"] as const;

export const activitySchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  category: z.enum(ACTIVITY_CATEGORIES),
  // From <input type="datetime-local">.
  date: z.string().min(1, "Date is required"),
  durationMin: z.coerce
    .number<number>()
    .int("Must be a whole number")
    .min(1, "Must be at least 1 minute")
    .max(1440, "Cannot exceed 24 hours"),
  notes: z.string().max(1000).optional(),
  // Empty string means "not rated".
  mood: z.enum(RATING_VALUES).optional(),
  productivity: z.enum(RATING_VALUES).optional(),
  // Empty string means "no project".
  projectId: z.string().optional(),
});

export type ActivityInput = z.infer<typeof activitySchema>;
