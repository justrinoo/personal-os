import { DatabaseZap } from "lucide-react";

export function DbOfflineBanner() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm">
      <DatabaseZap className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
      <p>
        Database is not reachable. Set <code className="font-mono">DATABASE_URL</code>{" "}
        in <code className="font-mono">.env</code> and run{" "}
        <code className="font-mono">npx prisma migrate dev</code> to get started.
      </p>
    </div>
  );
}
