import type { Metadata } from "next";
import { ExternalLink, ListTodo, Pencil, Plus } from "lucide-react";

import { deleteTaskAction } from "@/actions/task.actions";
import { PageHeader } from "@/components/layout/page-header";
import { DbOfflineBanner } from "@/components/shared/db-offline-banner";
import { TableToolbar } from "@/components/shared/table-toolbar";
import { DeleteButton } from "@/components/shared/delete-button";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TaskFormDialog } from "@/features/tasks/components/task-form-dialog";
import { PRIORITIES, TASK_STATUSES } from "@/constants/enums";
import { safeQuery } from "@/lib/safe-query";
import { listProjectOptions } from "@/repositories/project.repository";
import { listTasks } from "@/repositories/task.repository";
import { formatDate, formatEnumLabel } from "@/utils/format";
import { pickEnum } from "@/utils/search-params";

export const metadata: Metadata = { title: "Tasks" };

export const dynamic = "force-dynamic";

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const filters = {
    q: params.q,
    status: pickEnum(params.status, TASK_STATUSES),
    priority: pickEnum(params.priority, PRIORITIES),
  };
  const filtered = Boolean(filters.q || filters.status || filters.priority);

  const [tasks, projects] = await Promise.all([
    safeQuery(() => listTasks(filters), []),
    safeQuery(() => listProjectOptions(), []),
  ]);

  return (
    <>
      <PageHeader
        title="Tasks"
        description="Every development task across your projects"
      >
        <TaskFormDialog
          projects={projects.data}
          trigger={
            <Button size="sm">
              <Plus className="size-4" />
              New Task
            </Button>
          }
        />
      </PageHeader>
      <main className="flex flex-col gap-6 p-4 md:p-6">
        {!tasks.ok ? <DbOfflineBanner /> : null}

        <TableToolbar
          searchPlaceholder="Search tasks…"
          filters={[
            { param: "status", placeholder: "All statuses", options: TASK_STATUSES },
            { param: "priority", placeholder: "All priorities", options: PRIORITIES },
          ]}
        />

        {tasks.data.length === 0 ? (
          <EmptyState
            icon={ListTodo}
            title={filtered ? "No tasks match your filters" : "No tasks yet"}
            description={
              filtered
                ? "Try a different search or clear the filters."
                : "Tasks track development work from backlog to done."
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right">Due</TableHead>
                  <TableHead className="w-20" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.data.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">
                      <span className="inline-flex items-center gap-1.5">
                        {task.title}
                        {task.clickupUrl ? (
                          <a
                            href={task.clickupUrl}
                            target="_blank"
                            rel="noreferrer"
                            title="Open in ClickUp"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <ExternalLink className="size-3.5" />
                          </a>
                        ) : null}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {task.project?.name ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatEnumLabel(task.type)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge value={task.status} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge value={task.priority} />
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {task.dueDate ? formatDate(task.dueDate) : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end">
                        <TaskFormDialog
                          projects={projects.data}
                          task={task}
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label="Edit task"
                            >
                              <Pencil className="size-4 text-muted-foreground" />
                            </Button>
                          }
                        />
                        <DeleteButton
                          action={deleteTaskAction.bind(null, task.id)}
                          title="Delete task?"
                          description={`"${task.title}" will be permanently removed.`}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </>
  );
}
