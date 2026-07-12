// Enum value lists shared by Zod schemas and select inputs.
// Values must match the Prisma schema enums exactly.

export const WORKSPACE_TYPES = [
  "OFFICE",
  "FREELANCE",
  "PERSONAL",
  "OPEN_SOURCE",
] as const;

export const PROJECT_STATUSES = [
  "PLANNING",
  "ACTIVE",
  "ON_HOLD",
  "COMPLETED",
  "ARCHIVED",
] as const;

export const TASK_TYPES = [
  "DEVELOPMENT",
  "BUG",
  "RESEARCH",
  "MEETING",
  "DOCUMENTATION",
  "TESTING",
  "DEPLOYMENT",
] as const;

export const TASK_STATUSES = [
  "BACKLOG",
  "PLANNING",
  "READY",
  "DEVELOPMENT",
  "REVIEW",
  "TESTING",
  "DONE",
  "ARCHIVED",
] as const;

export const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

export const DEPLOY_ENVIRONMENTS = [
  "LOCAL",
  "DEVELOPMENT",
  "STAGING",
  "PRODUCTION",
] as const;

export const INCIDENT_SEVERITIES = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
] as const;

export const ACTIVITY_CATEGORIES = [
  "CODING",
  "MEETING",
  "LEARNING",
  "READING",
  "RESEARCH",
  "WORKOUT",
  "WRITING",
  "GAMING",
  "OTHER",
] as const;

export const JOURNAL_TYPES = ["MORNING", "NIGHT"] as const;

export const LEARNING_TYPES = [
  "COURSE",
  "BOOK",
  "VIDEO",
  "ARTICLE",
  "CERTIFICATION",
  "OTHER",
] as const;

export const LEARNING_STATUSES = [
  "BACKLOG",
  "IN_PROGRESS",
  "FINISHED",
  "ABANDONED",
] as const;
