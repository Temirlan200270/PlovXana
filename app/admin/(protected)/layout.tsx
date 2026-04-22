import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getStaffForUser } from "@/lib/auth/getStaff";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default async function AdminProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
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

  const tenantLabel =
    staff.tenants?.name?.trim() ||
    staff.tenants?.slug?.trim() ||
    staff.tenant_id.slice(0, 8);

  return (
    <div className="flex min-h-screen bg-neutral-950 text-white">
      <AdminSidebar role={staff.role} tenantLabel={tenantLabel} />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
