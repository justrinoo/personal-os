import type { Metadata } from "next";
import { ListTodo } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { DbOfflineBanner } from "@/components/shared/db-offline-banner";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { safeQuery } from "@/lib/safe-query";
import { listTasks } from "@/repositories/task.repository";
import { formatDate, formatEnumLabel } from "@/utils/format";

export const metadata: Metadata = { title: "Tasks" };

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const tasks = await safeQuery(() => listTasks(), []);

  return (
    <>
      <PageHeader
        title="Tasks"
        description="Every development task across your projects"
      />
      <main className="flex flex-col gap-6 p-4 md:p-6">
        {!tasks.ok ? <DbOfflineBanner /> : null}

        {tasks.data.length === 0 ? (
          <EmptyState
            icon={ListTodo}
            title="No tasks yet"
            description="Tasks track development work from backlog to done."
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.data.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
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
