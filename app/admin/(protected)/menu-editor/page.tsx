import { redirect } from "next/navigation";
import { MenuKillSwitchList } from "@/components/admin/MenuKillSwitchList";
import { getStaffForUser } from "@/lib/auth/getStaff";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Редактор меню",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminMenuEditorPage() {
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

  const { data: rawItems, error } = await supabase
    .from("menu_items")
    .select("id, name, is_available")
    .eq("tenant_id", staff.tenant_id)
    .order("name", { ascending: true });

  if (error) {
    return (
      <div>
        <h1 className="font-serif text-2xl text-white">Редактор меню</h1>
        <p className="mt-2 text-sm text-red-300" role="alert">
          {error.message}
        </p>
      </div>
    );
  }

  const items = rawItems ?? [];

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="font-serif text-2xl text-white">Редактор меню</h1>
      <p className="text-sm text-neutral-400">
        Стоп-лист: скрывает позицию с публичного меню (кэш сбрасывается
        автоматически). Полный CRUD — отдельная задача.
      </p>
      {items.length === 0 ? (
        <p className="text-sm text-neutral-500">Нет позиций в меню.</p>
      ) : (
        <MenuKillSwitchList items={items} />
      )}
    </div>
  );
}
