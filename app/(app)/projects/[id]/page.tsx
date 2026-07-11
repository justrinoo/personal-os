import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {
  ExternalLink,
  FolderGit2,
  GitBranch,
  GitCommitHorizontal,
  GitPullRequest,
} from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { RepoLinkForm } from "@/features/github/components/repo-link-form";
import { RepoSyncButton } from "@/features/github/components/repo-sync-button";
import {
  getProjectDetail,
  getTasksByBranch,
  listCommits,
  listPullRequests,
} from "@/repositories/github.repository";
import { safeQuery } from "@/lib/safe-query";
import { formatDateTime } from "@/utils/format";

export const metadata: Metadata = { title: "Project" };

export const dynamic = "force-dynamic";

const PR_STATE_STYLES: Record<string, string> = {
  open: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  merged: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
  closed: "bg-red-500/10 text-red-700 dark:text-red-400",
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await safeQuery(() => getProjectDetail(id), null);
  if (project.ok && !project.data) notFound();
  if (!project.data) notFound();

  const repo = project.data.repository;
  const [commits, pulls, tasksByBranch] = repo
    ? await Promise.all([
        safeQuery(() => listCommits(repo.id), []),
        safeQuery(() => listPullRequests(repo.id), []),
        safeQuery(() => getTasksByBranch(id), {}),
      ])
    : [{ ok: true, data: [] }, { ok: true, data: [] }, { ok: true, data: {} }];

  const sortedPulls = [...pulls.data].sort((a, b) => {
    if (a.state === "open" && b.state !== "open") return -1;
    if (b.state === "open" && a.state !== "open") return 1;
    return b.openedAt.getTime() - a.openedAt.getTime();
  });

  return (
    <>
      <PageHeader
        title={project.data.name}
        description={`${project.data.workspace.name} · ${project.data._count.tasks} tasks`}
      >
        <StatusBadge value={project.data.status} />
      </PageHeader>
      <main className="flex flex-col gap-6 p-4 md:p-6">
        {project.data.description ? (
          <p className="max-w-3xl text-muted-foreground">
            {project.data.description}
          </p>
        ) : null}

        <Card>
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <CardTitle className="flex items-center gap-2">
                <FolderGit2 className="size-5" />
                Repository
              </CardTitle>
              {repo ? (
                <CardDescription className="flex items-center gap-2">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 hover:text-foreground"
                  >
                    {repo.fullName}
                    <ExternalLink className="size-3.5" />
                  </a>
                  {repo.syncedAt
                    ? `· synced ${formatDistanceToNow(repo.syncedAt, { addSuffix: true })}`
                    : "· never synced"}
                </CardDescription>
              ) : (
                <CardDescription>
                  Link the GitHub repository to see commits and pull requests
                  here.
                </CardDescription>
              )}
            </div>
            {repo ? <RepoSyncButton projectId={id} /> : null}
          </CardHeader>
          <CardContent>
            {!repo ? (
              <RepoLinkForm projectId={id} />
            ) : (
              <Tabs defaultValue="commits">
                <TabsList>
                  <TabsTrigger value="commits">
                    <GitCommitHorizontal className="size-4" />
                    Commits ({commits.data.length})
                  </TabsTrigger>
                  <TabsTrigger value="pulls">
                    <GitPullRequest className="size-4" />
                    Pull Requests ({sortedPulls.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="commits">
                  {commits.data.length === 0 ? (
                    <p className="py-6 text-sm text-muted-foreground">
                      No commits synced yet — hit Sync.
                    </p>
                  ) : (
                    <ul className="flex flex-col divide-y">
                      {commits.data.map((commit) => (
                        <li
                          key={commit.sha}
                          className="flex items-center justify-between gap-3 py-3"
                        >
                          <div className="flex min-w-0 flex-col">
                            <a
                              href={commit.url}
                              target="_blank"
                              rel="noreferrer"
                              className="truncate font-medium hover:underline"
                            >
                              {commit.message}
                            </a>
                            <span className="text-xs text-muted-foreground">
                              {commit.authorLogin ?? commit.authorName ?? "unknown"}{" "}
                              · {formatDateTime(commit.committedAt)}
                            </span>
                          </div>
                          <code className="shrink-0 rounded bg-muted px-2 py-0.5 font-mono text-xs">
                            {commit.sha.slice(0, 7)}
                          </code>
                        </li>
                      ))}
                    </ul>
                  )}
                </TabsContent>

                <TabsContent value="pulls">
                  {sortedPulls.length === 0 ? (
                    <p className="py-6 text-sm text-muted-foreground">
                      No pull requests synced yet — hit Sync.
                    </p>
                  ) : (
                    <ul className="flex flex-col divide-y">
                      {sortedPulls.map((pull) => {
                        const linkedTask = pull.headBranch
                          ? tasksByBranch.data[pull.headBranch]
                          : undefined;
                        return (
                          <li
                            key={pull.id}
                            className="flex flex-wrap items-center justify-between gap-3 py-3"
                          >
                            <div className="flex min-w-0 flex-col gap-1">
                              <a
                                href={pull.url}
                                target="_blank"
                                rel="noreferrer"
                                className="truncate font-medium hover:underline"
                              >
                                #{pull.number} {pull.title}
                              </a>
                              <span className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                {pull.authorLogin ?? "unknown"} ·{" "}
                                {formatDateTime(pull.openedAt)}
                                {pull.headBranch ? (
                                  <span className="inline-flex items-center gap-1">
                                    <GitBranch className="size-3" />
                                    {pull.headBranch}
                                  </span>
                                ) : null}
                                {linkedTask ? (
                                  <Link
                                    href="/tasks"
                                    className="text-primary-foreground"
                                  >
                                    <Badge className="bg-primary/20 text-(--primary-deep)">
                                      {linkedTask.title}
                                    </Badge>
                                  </Link>
                                ) : null}
                              </span>
                            </div>
                            <Badge
                              className={PR_STATE_STYLES[pull.state] ?? "bg-muted"}
                            >
                              {pull.state}
                            </Badge>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
