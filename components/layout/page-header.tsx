import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-center gap-3 border-b px-4 py-5 md:px-8">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-5" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        {/* FitFlow display-md: 30px/600, tight tracking */}
        <h1 className="truncate text-2xl font-semibold tracking-[-0.5px] md:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="truncate text-sm text-muted-foreground md:text-base">
            {description}
          </p>
        ) : null}
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </header>
  );
}
