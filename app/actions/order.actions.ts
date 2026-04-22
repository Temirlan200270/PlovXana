"use server";

import { assertTenantIdMatchesOrderContext } from "@/lib/tenant/assertOrderTenantContext";
import { submitCheckoutOrder } from "@/services/orders/submitOrder";
import { CheckoutDraftSchema } from "@/lib/validation/order";

export type ActionError = Readonly<{
  message: string;
  fieldErrors?: Record<string, string[]>;
}>;

export type Result<T> =
  | Readonly<{ success: true; data: T }>
  | Readonly<{ success: false; error: ActionError }>;

export async function submitOrderAction(
  payload: unknown,
): Promise<Result<{ orderId: string }>> {
  const parsed = CheckoutDraftSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      success: false,
      error: {
        message: "Ошибка валидации формы",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
    };
  }

  const tenantCheck = await assertTenantIdMatchesOrderContext(
    parsed.data.tenant_id,
  );
  if (!tenantCheck.ok) {
    return {
      success: false,
      error: { message: tenantCheck.message },
    };
  }

  const result = await submitCheckoutOrder(parsed.data);
  if (!result.success) {
    return {
      success: false,
      error: { message: result.error },
    };
  }

  return { success: true, data: { orderId: result.data.orderId } };
}

