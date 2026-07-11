"use client";

import { useEffect, useState } from "react";
import {
  animate,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  CalendarCheck,
  Clock,
  FolderKanban,
  ListTodo,
  type LucideIcon,
} from "lucide-react";

import { formatMinutes } from "@/utils/format";

const STAT_ICONS = {
  projects: FolderKanban,
  tasks: ListTodo,
  clock: Clock,
  habits: CalendarCheck,
} satisfies Record<string, LucideIcon>;

export interface DashboardStat {
  key: string;
  title: string;
  value: number;
  format: "count" | "minutes";
  icon: keyof typeof STAT_ICONS;
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const tile: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 24 },
  },
};

function formatStat(value: number, format: DashboardStat["format"]): string {
  return format === "minutes" ? formatMinutes(value) : String(Math.round(value));
}

function CountUp({ value, format }: Pick<DashboardStat, "value" | "format">) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(() =>
    reduceMotion ? formatStat(value, format) : formatStat(0, format)
  );

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(formatStat(value, format));
      return;
    }
    const controls = animate(0, value, {
      duration: 0.9,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(formatStat(latest, format)),
    });
    return () => controls.stop();
  }, [value, format, reduceMotion]);

  return (
    <span className="font-mono text-3xl font-semibold tracking-tight tabular-nums">
      {display}
    </span>
  );
}

export function AnimatedStats({ stats }: { stats: DashboardStat[] }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
    >
      {stats.map((stat) => {
        const Icon = STAT_ICONS[stat.icon];
        return (
          <motion.div
            key={stat.key}
            variants={tile}
            className="neu-panel flex items-start justify-between p-6"
          >
            <div className="flex flex-col gap-1.5">
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <CountUp value={stat.value} format={stat.format} />
            </div>
            <div className="flex size-11 items-center justify-center rounded-full bg-primary/20">
              <Icon className="size-5 text-(--primary-deep)" />
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
