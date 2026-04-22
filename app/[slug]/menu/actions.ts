"use server";

// Legacy файл. Write-path v1 переехал в `app/actions/order.actions.ts`.

export type CreateOrderActionResult =
  | Readonly<{ ok: true; orderId: string }>
  | Readonly<{ ok: false; error: string }>;

export async function createOrderAction(input: unknown): Promise<CreateOrderActionResult> {
  void input;
  return { ok: false, error: "Используйте submitOrderAction (app/actions/order.actions.ts)" };
}

