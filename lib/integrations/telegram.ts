import "server-only";

type NotifyOrderInput = Readonly<{
  botToken: string;
  chatId: string;
  text: string;
}>;

/**
 * Отправка сообщения в Telegram Bot API. Не бросает наружу — только для фоновых вызовов.
 */
export async function sendTelegramMessage(
  input: NotifyOrderInput,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const url = `https://api.telegram.org/bot${encodeURIComponent(input.botToken)}/sendMessage`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: input.chatId,
        text: input.text,
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(12_000),
    });
    const body = (await res.json()) as { ok?: boolean; description?: string };
    if (!res.ok || body.ok !== true) {
      return {
        ok: false,
        message: body.description ?? `HTTP ${res.status}`,
      };
    }
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { ok: false, message };
  }
}

export function buildOrderTelegramText(params: {
  tenantName: string;
  orderId: string;
  totalTenge: number;
  currency: string;
  customerName: string;
  customerPhone: string;
  lineCount: number;
}): string {
  const cur = params.currency.trim() || "KZT";
  return [
    `🍽 Новый заказ — ${params.tenantName}`,
    `№ \`${params.orderId}\``,
    `Сумма: ${params.totalTenge} ${cur}`,
    `Позиций: ${params.lineCount}`,
    `${params.customerName} · ${params.customerPhone}`,
  ].join("\n");
}
