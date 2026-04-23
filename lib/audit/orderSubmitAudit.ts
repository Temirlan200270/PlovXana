import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/** Структурированный stderr для service_role-пути (RLS не защитит от багов в коде). */
export function logOrderSubmitStructured(
  level: "error" | "warn" | "info",
  stage: string,
  context: Readonly<{
    tenantId: string;
    orderId?: string;
    message?: string;
    extra?: Record<string, unknown>;
  }>,
): void {
  const line = JSON.stringify({
    source: "submitCheckoutOrder",
    level,
    stage,
    tenantId: context.tenantId,
    orderId: context.orderId,
    message: context.message,
    ...context.extra,
    at: new Date().toISOString(),
  });
  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.info(line);
  }
}

export type OrderAuditAction =
  | "order_submit_success"
  | "order_submit_failed"
  | "order_submit_rollback";

/**
 * Запись в `audit_logs` через service_role. Ошибки глотаются — заказ для гостя важнее.
 */
export async function tryWriteOrderAudit(params: {
  tenantId: string;
  action: OrderAuditAction;
  orderId?: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("audit_logs").insert({
      tenant_id: params.tenantId,
      action: params.action,
      entity: "order",
      entity_id: params.orderId ?? null,
      metadata: params.metadata ?? {},
    });
    if (error) {
      logOrderSubmitStructured("warn", "audit_insert_skipped", {
        tenantId: params.tenantId,
        orderId: params.orderId,
        message: error.message,
      });
    }
  } catch (e) {
    logOrderSubmitStructured("warn", "audit_insert_exception", {
      tenantId: params.tenantId,
      orderId: params.orderId,
      message: e instanceof Error ? e.message : String(e),
    });
  }
}
