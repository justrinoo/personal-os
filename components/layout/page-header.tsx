import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <header className="flex items-center gap-3 px-4 py-3 shadow-[0_8px_14px_-10px_var(--neu-dark)] md:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-5" />
      <div className="flex flex-1 flex-col">
        <h1 className="text-base font-semibold md:text-lg">{title}</h1>
        {description ? (
          <p className="text-xs text-muted-foreground md:text-sm">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </header>
  );
}
