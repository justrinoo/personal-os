import { prisma } from "@/lib/prisma";
import type {
  JournalEntry,
  JournalType,
} from "@/lib/generated/prisma/client";

export function listJournalEntries(limit?: number): Promise<JournalEntry[]> {
  return prisma.journalEntry.findMany({
    orderBy: { date: "desc" },
    take: limit,
  });
}

export interface JournalData {
  type: JournalType;
  date: Date;
  goals: string | null;
  focus: string | null;
  reflection: string | null;
  wins: string | null;
  problems: string | null;
  lessons: string | null;
  tomorrow: string | null;
}

/** One entry per day+type: saving the same slot updates it. */
export function upsertJournalEntry(data: JournalData): Promise<JournalEntry> {
  const { type, date, ...fields } = data;
  return prisma.journalEntry.upsert({
    where: { date_type: { date, type } },
    update: fields,
    create: data,
  });
}

export function deleteJournalEntry(id: string): Promise<JournalEntry> {
  return prisma.journalEntry.delete({ where: { id } });
}

export function listEntriesBetween(
  start: Date,
  end: Date
): Promise<JournalEntry[]> {
  return prisma.journalEntry.findMany({
    where: { date: { gte: start, lte: end } },
    orderBy: [{ date: "asc" }, { type: "asc" }],
  });
}

/** Distinct journal days (for streaks / completion stats). */
export async function listJournalDays(): Promise<Date[]> {
  const rows = await prisma.journalEntry.findMany({
    select: { date: true },
    distinct: ["date"],
    orderBy: { date: "desc" },
  });
  return rows.map((row) => row.date);
}

export async function countCompletePairs(): Promise<number> {
  const rows = await prisma.journalEntry.groupBy({
    by: ["date"],
    _count: { _all: true },
    having: { date: { _count: { gte: 2 } } },
  });
  return rows.length;
}
