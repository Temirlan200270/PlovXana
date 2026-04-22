import { redirect } from "next/navigation";
import { OrderAnalyticsPanel } from "@/components/admin/OrderAnalyticsPanel";
import { getStaffForUser } from "@/lib/auth/getStaff";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getOrderAnalytics } from "@/services/orders/getOrderAnalytics";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Дашборд",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
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

  const currency = staff.tenants?.currency?.trim() || "KZT";

  let analytics7;
  let analytics30;
  try {
    [analytics7, analytics30] = await Promise.all([
      getOrderAnalytics(supabase, staff.tenant_id, 7),
      getOrderAnalytics(supabase, staff.tenant_id, 30),
    ]);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Ошибка загрузки аналитики";
    return (
      <div>
        <h1 className="font-serif text-2xl text-white">Дашборд</h1>
        <p className="mt-2 text-sm text-red-300" role="alert">
          {message}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-white">Дашборд</h1>
      <p className="mt-2 text-sm text-neutral-400">
        Краткая аналитика заказов. Подробный CRUD меню и отчёты — по roadmap.
      </p>
      <div className="mt-8">
        <OrderAnalyticsPanel
          currency={currency}
          analytics7={analytics7}
          analytics30={analytics30}
        />
      </div>
    </div>
  );
}
