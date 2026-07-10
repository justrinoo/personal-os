import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Terminal } from "lucide-react";

import { LoginForm } from "@/features/auth/components/login-form";
import { getSession } from "@/lib/require-auth";

export const metadata: Metadata = { title: "Sign in" };

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect("/");
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 p-4">
      <div className="flex items-center gap-2">
        <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Terminal className="size-5" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-lg font-semibold">Personal OS</span>
          <span className="text-xs text-muted-foreground">
            Engineering Workspace
          </span>
        </div>
      </div>
      <LoginForm />
    </main>
  );
}
