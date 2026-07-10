import { z } from "zod";

export const habitSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  targetDays: z.coerce
    .number<number>()
    .int()
    .min(1, "At least 1 day per week")
    .max(7, "At most 7 days per week"),
});

export type HabitInput = z.infer<typeof habitSchema>;
