import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getSession } from "@/lib/require-auth";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar user={{ name: session.user.name, email: session.user.email }} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
