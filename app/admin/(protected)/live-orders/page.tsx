import { redirect } from "next/navigation";
import { LiveOrdersList } from "@/components/admin/LiveOrdersList";
import { getStaffForUser } from "@/lib/auth/getStaff";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getRecentOrdersForTenant } from "@/services/orders/getRecentOrdersForTenant";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Заказы live",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLiveOrdersPage() {
  if (!isSupabaseConfigured()) {
    redirect("/admin/login?error=supabase");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const staff = await getStaffForUser(supabase, user.id);
  if (!staff) {
    redirect("/admin/login?error=no_staff");
  }

  const initialOrders = await getRecentOrdersForTenant(supabase, staff.tenant_id, 50);

  return (
    <LiveOrdersList tenantId={staff.tenant_id} initialOrders={initialOrders} />
  );
}
