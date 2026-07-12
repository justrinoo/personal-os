export class UptimeKumaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UptimeKumaError";
  }
}

export interface KumaMonitorStatus {
  kumaId: string;
  name: string;
  url: string | null;
  status: "up" | "down" | "unknown";
  lastCheckedAt: Date | null;
}

function getConfig() {
  const base = process.env.UPTIME_KUMA_URL?.replace(/\/+$/, "");
  const slug = process.env.UPTIME_KUMA_STATUS_SLUG;
  if (!base || !slug) {
    throw new UptimeKumaError(
      "Uptime Kuma not configured — set UPTIME_KUMA_URL and UPTIME_KUMA_STATUS_SLUG in .env"
    );
  }
  return { base, slug };
}

/**
 * Pulls monitor names + latest heartbeat from an Uptime Kuma public status
 * page (no API key needed; create a status page in Kuma and use its slug).
 */
export async function fetchKumaMonitors(): Promise<KumaMonitorStatus[]> {
  const { base, slug } = getConfig();

  const [configRes, heartbeatRes] = await Promise.all([
    fetch(`${base}/api/status-page/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    }),
    fetch(`${base}/api/status-page/heartbeat/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    }),
  ]);
  if (!configRes.ok || !heartbeatRes.ok) {
    throw new UptimeKumaError(
      `Uptime Kuma responded ${configRes.ok ? heartbeatRes.status : configRes.status} — check the URL and status page slug`
    );
  }

  const config = (await configRes.json()) as {
    publicGroupList?: {
      monitorList?: { id: number; name: string; url?: string | null }[];
    }[];
  };
  const heartbeat = (await heartbeatRes.json()) as {
    heartbeatList?: Record<string, { status: number; time: string }[]>;
  };

  const monitors: KumaMonitorStatus[] = [];
  for (const group of config.publicGroupList ?? []) {
    for (const monitor of group.monitorList ?? []) {
      const beats = heartbeat.heartbeatList?.[String(monitor.id)] ?? [];
      const last = beats[beats.length - 1];
      monitors.push({
        kumaId: String(monitor.id),
        name: monitor.name,
        url: monitor.url ?? null,
        status: last ? (last.status === 1 ? "up" : "down") : "unknown",
        lastCheckedAt: last ? new Date(last.time) : null,
      });
    }
  }
  return monitors;
}
