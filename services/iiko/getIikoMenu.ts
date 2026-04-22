export type IikoMenuPayload = {
  organizationId: string;
};

/**
 * Опциональный мост к Python FastAPI-адаптеру iiko.
 * URL: IIKO_ADAPTER_URL (см. .env.example).
 */
export async function getIikoMenu(
  payload: IikoMenuPayload,
): Promise<unknown> {
  const base = process.env.IIKO_ADAPTER_URL?.replace(/\/$/, "");
  if (!base) {
    throw new Error("IIKO_ADAPTER_URL не задан");
  }

  const res = await fetch(`${base}/menu`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`iiko adapter: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<unknown>;
}
