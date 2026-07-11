"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  getProjectRepository,
  linkRepository,
  markRepositorySynced,
  unlinkRepository,
  upsertCommits,
  upsertPullRequests,
} from "@/repositories/github.repository";
import {
  fetchPullRequests,
  fetchRecentCommits,
  fetchRepo,
  GitHubError,
  parseRepoReference,
} from "@/services/github.service";
import { isAuthenticated } from "@/lib/require-auth";
import { ACTION_OK, actionError, type ActionResult } from "@/types/action";

const repoReferenceSchema = z
  .string()
  .trim()
  .min(1, "Paste an owner/name or a github.com URL")
  .max(300);

function revalidate(projectId: string) {
  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/projects");
  revalidatePath("/");
}

function toActionError(error: unknown, fallback: string): ActionResult {
  if (error instanceof GitHubError) return actionError(error.message);
  return actionError(fallback);
}

export async function linkGitHubRepoAction(
  projectId: string,
  reference: string
): Promise<ActionResult> {
  if (!(await isAuthenticated())) return actionError("Unauthorized");
  const parsed = repoReferenceSchema.safeParse(reference);
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message ?? "Invalid repository");
  }
  try {
    const fullName = parseRepoReference(parsed.data);
    const repo = await fetchRepo(fullName);
    await linkRepository(projectId, repo);
    revalidate(projectId);
    return ACTION_OK;
  } catch (error) {
    return toActionError(error, "Failed to link repository");
  }
}

export async function unlinkGitHubRepoAction(
  projectId: string
): Promise<ActionResult> {
  if (!(await isAuthenticated())) return actionError("Unauthorized");
  try {
    await unlinkRepository(projectId);
    revalidate(projectId);
    return ACTION_OK;
  } catch {
    return actionError("Failed to unlink repository");
  }
}

export interface GitHubSyncResult extends ActionResult {
  commits?: number;
  pullRequests?: number;
}

export async function syncGitHubAction(
  projectId: string
): Promise<GitHubSyncResult> {
  if (!(await isAuthenticated())) return actionError("Unauthorized");
  try {
    const repo = await getProjectRepository(projectId);
    if (!repo) return actionError("Project has no linked repository");

    const [commits, pulls] = await Promise.all([
      fetchRecentCommits(repo.fullName),
      fetchPullRequests(repo.fullName),
    ]);
    const [commitCount, prCount] = await Promise.all([
      upsertCommits(repo.id, commits),
      upsertPullRequests(repo.id, pulls),
    ]);
    await markRepositorySynced(repo.id);
    revalidate(projectId);
    return { ok: true, commits: commitCount, pullRequests: prCount };
  } catch (error) {
    return toActionError(error, "GitHub sync failed");
  }
}
