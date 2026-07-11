import { prisma } from "@/lib/prisma";
import type {
  RemoteCommit,
  RemotePullRequest,
  RemoteRepo,
} from "@/services/github.service";

export function getProjectRepository(projectId: string) {
  return prisma.repository.findUnique({ where: { projectId } });
}

/** Links (or re-links) a project to a GitHub repository. */
export function linkRepository(projectId: string, repo: RemoteRepo) {
  const fields = {
    owner: repo.owner,
    name: repo.name,
    fullName: repo.fullName,
    url: repo.url,
    defaultBranch: repo.defaultBranch,
  };
  return prisma.repository.upsert({
    where: { projectId },
    update: fields,
    create: { ...fields, projectId },
  });
}

export function unlinkRepository(projectId: string) {
  return prisma.repository.delete({ where: { projectId } });
}

/** Idempotent: commits upsert by unique sha. */
export async function upsertCommits(
  repositoryId: string,
  commits: RemoteCommit[]
): Promise<number> {
  for (const commit of commits) {
    const fields = {
      message: commit.message,
      authorName: commit.authorName,
      authorLogin: commit.authorLogin,
      committedAt: commit.committedAt,
      url: commit.url,
    };
    await prisma.commit.upsert({
      where: { sha: commit.sha },
      update: fields,
      create: { ...fields, sha: commit.sha, repositoryId },
    });
  }
  return commits.length;
}

/** Idempotent: PRs upsert by [repositoryId, number]; state stays truthful. */
export async function upsertPullRequests(
  repositoryId: string,
  pulls: RemotePullRequest[]
): Promise<number> {
  for (const pull of pulls) {
    const fields = {
      title: pull.title,
      state: pull.state,
      authorLogin: pull.authorLogin,
      headBranch: pull.headBranch,
      url: pull.url,
      openedAt: pull.openedAt,
      mergedAt: pull.mergedAt,
      closedAt: pull.closedAt,
    };
    await prisma.pullRequest.upsert({
      where: {
        repositoryId_number: { repositoryId, number: pull.number },
      },
      update: fields,
      create: { ...fields, number: pull.number, repositoryId },
    });
  }
  return pulls.length;
}

export function markRepositorySynced(repositoryId: string) {
  return prisma.repository.update({
    where: { id: repositoryId },
    data: { syncedAt: new Date() },
  });
}

export function listCommits(repositoryId: string, take = 30) {
  return prisma.commit.findMany({
    where: { repositoryId },
    orderBy: { committedAt: "desc" },
    take,
  });
}

export function listPullRequests(repositoryId: string, take = 50) {
  return prisma.pullRequest.findMany({
    where: { repositoryId },
    orderBy: [{ state: "asc" }, { openedAt: "desc" }], // merged < open — resorted in UI
    take,
  });
}

/** Tasks in a project keyed by their linked git branch (manual convention). */
export async function getTasksByBranch(
  projectId: string
): Promise<Record<string, { id: string; title: string }>> {
  const tasks = await prisma.task.findMany({
    where: { projectId, gitBranch: { not: null } },
    select: { id: true, title: true, gitBranch: true },
  });
  return Object.fromEntries(
    tasks.map((task) => [task.gitBranch as string, { id: task.id, title: task.title }])
  );
}

/** Project header data for the detail page. */
export function getProjectDetail(projectId: string) {
  return prisma.project.findUnique({
    where: { id: projectId },
    include: {
      workspace: true,
      repository: true,
      _count: { select: { tasks: true } },
    },
  });
}
