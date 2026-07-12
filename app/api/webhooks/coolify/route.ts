import { NextResponse, type NextRequest } from "next/server";

import { createDeployment } from "@/repositories/deployment.repository";
import { pickEnum } from "@/utils/search-params";
import { DEPLOY_ENVIRONMENTS } from "@/constants/enums";

/**
 * Coolify deployment webhook. Configure in Coolify as:
 *   POST {APP_URL}/api/webhooks/coolify?projectId=<id>&environment=PRODUCTION
 * with header  X-Webhook-Secret: $COOLIFY_WEBHOOK_SECRET
 *
 * The body is treated leniently — Coolify payloads vary by version, so we
 * read the common fields and fall back to sensible defaults.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.COOLIFY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { data: null, error: "Webhook not configured (COOLIFY_WEBHOOK_SECRET missing)", status: 503 },
      { status: 503 }
    );
  }
  if (request.headers.get("x-webhook-secret") !== secret) {
    return NextResponse.json(
      { data: null, error: "Invalid webhook secret", status: 401 },
      { status: 401 }
    );
  }

  const projectId = request.nextUrl.searchParams.get("projectId");
  if (!projectId) {
    return NextResponse.json(
      { data: null, error: "projectId query param is required", status: 400 },
      { status: 400 }
    );
  }
  const environment =
    pickEnum(
      request.nextUrl.searchParams.get("environment") ?? undefined,
      DEPLOY_ENVIRONMENTS
    ) ?? "PRODUCTION";

  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    // empty or non-JSON body is fine
  }

  const commit =
    typeof body.commit === "string"
      ? body.commit
      : typeof body.sha === "string"
        ? body.sha
        : null;
  const status =
    typeof body.status === "string" ? body.status.toLowerCase() : "success";
  const version =
    typeof body.version === "string" && body.version
      ? body.version
      : commit
        ? commit.slice(0, 7)
        : new Date().toISOString().slice(0, 16).replace("T", " ");

  try {
    const deployment = await createDeployment({
      version,
      environment,
      projectId,
      commitHash: commit,
      releaseNotes:
        typeof body.message === "string" ? body.message.slice(0, 2000) : null,
      success: !["failed", "error", "failure"].includes(status),
      rollbackOfId: null,
    });
    return NextResponse.json({ data: { id: deployment.id }, error: null, status: 201 }, { status: 201 });
  } catch {
    return NextResponse.json(
      { data: null, error: "Failed to record deployment (check projectId)", status: 500 },
      { status: 500 }
    );
  }
}
