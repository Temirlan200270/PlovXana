import { NextResponse } from "next/server";
import { syncMenuWithIiko } from "@/lib/services/menu/sync.service";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tenantId = url.searchParams.get("tenantId") ?? process.env.IIKO_SYNC_TENANT_ID ?? "";
  const organizationId =
    url.searchParams.get("organizationId") ?? process.env.IIKO_SYNC_ORGANIZATION_ID ?? "";

  if (!tenantId.trim() || !organizationId.trim()) {
    return NextResponse.json(
      {
        error:
          "Missing tenantId/organizationId. Provide query params or set IIKO_SYNC_TENANT_ID and IIKO_SYNC_ORGANIZATION_ID.",
      },
      { status: 400 },
    );
  }

  const result = await syncMenuWithIiko(tenantId, organizationId);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ message: "Sync successful", data: result.data });
}

