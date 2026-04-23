"use client";

import { useEffect, useRef, useState } from "react";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import {
  LiveOrderRowSchema,
  type LiveOrderRow,
} from "@/lib/validation/liveOrder";

function sortDesc(a: LiveOrderRow, b: LiveOrderRow): number {
  const ta = Date.parse(a.created_at);
  const tb = Date.parse(b.created_at);
  if (tb !== ta) return tb - ta;
  return a.id.localeCompare(b.id);
}

function mergeRow(
  list: readonly LiveOrderRow[],
  row: LiveOrderRow,
): LiveOrderRow[] {
  const without = list.filter((x) => x.id !== row.id);
  return [...without, row].sort(sortDesc);
}

/**
 * Подписка на изменения `orders` для одного tenant (RLS + JWT в браузере).
 */
export function useLiveOrders(
  tenantId: string,
  initialOrders: readonly LiveOrderRow[],
): Readonly<{
  orders: readonly LiveOrderRow[];
  status: "idle" | "subscribed" | "error";
}> {
  const [orders, setOrders] = useState<readonly LiveOrderRow[]>(() => [
    ...initialOrders,
  ]);
  const [status, setStatus] = useState<"idle" | "subscribed" | "error">(
    "idle",
  );

  useEffect(() => {
    setOrders([...initialOrders]);
  }, [initialOrders]);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const channel = supabase
      .channel(`live-orders-${tenantId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `tenant_id=eq.${tenantId}`,
        },
        (payload: RealtimePostgresChangesPayload<{ [key: string]: unknown }>) => {
          if (payload.eventType === "INSERT") {
            const parsed = LiveOrderRowSchema.safeParse(payload.new);
            if (!parsed.success) return;
            const row = parsed.data;
            setOrders((prev) => mergeRow(prev, row));
            return;
          }
          if (payload.eventType === "UPDATE") {
            const parsed = LiveOrderRowSchema.safeParse(payload.new);
            if (!parsed.success) return;
            setOrders((prev) => mergeRow(prev, parsed.data));
            return;
          }
          if (payload.eventType === "DELETE" && payload.old) {
            const id = String(
              (payload.old as { id?: string }).id ?? "",
            ).trim();
            if (!id) return;
            setOrders((prev) => prev.filter((o) => o.id !== id));
          }
        },
      )
      .subscribe((subStatus, err) => {
        if (subStatus === "SUBSCRIBED") {
          setStatus("subscribed");
        }
        if (subStatus === "CHANNEL_ERROR" || err) {
          setStatus("error");
        }
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [tenantId]);

  return { orders, status };
}

function playBeep(): void {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.value = 0.08;
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch {
    /* AudioContext может быть заблокирован до жеста пользователя */
  }
}

/** Короткий сигнал при появлении нового `id` относительно первой серверной выборки. */
export function useNewOrderChime(
  orders: readonly LiveOrderRow[],
  seedIds: readonly string[],
): void {
  const seenRef = useRef<Set<string> | null>(null);
  if (seenRef.current === null) {
    seenRef.current = new Set(seedIds);
  }

  useEffect(() => {
    const seen = seenRef.current;
    if (!seen) return;
    for (const o of orders) {
      if (!seen.has(o.id)) {
        seen.add(o.id);
        playBeep();
      }
    }
  }, [orders]);
}
