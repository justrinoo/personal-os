import {
  Activity,
  BookOpen,
  Boxes,
  CalendarCheck,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  Ticket,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", href: "/", icon: LayoutDashboard }],
  },
  {
    label: "Work",
    items: [
      { title: "Workspaces", href: "/workspaces", icon: Boxes },
      { title: "Projects", href: "/projects", icon: FolderKanban },
      { title: "Tasks", href: "/tasks", icon: ListTodo },
      { title: "ClickUp", href: "/clickup", icon: Ticket },
      { title: "Activities", href: "/activities", icon: Activity },
    ],
  },
  {
    label: "Personal",
    items: [
      { title: "Journal", href: "/journal", icon: BookOpen },
      { title: "Habits", href: "/habits", icon: CalendarCheck },
    ],
  },
];
