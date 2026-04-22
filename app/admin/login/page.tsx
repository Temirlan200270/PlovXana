import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { StaffAccessDenied } from "@/components/admin/StaffAccessDenied";
import { safeAdminRedirect } from "@/lib/auth/adminRedirects";
import { getStaffForUser } from "@/lib/auth/getStaff";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Metadata } from "next";

const ERROR_MESSAGES: Record<string, string> = {
  no_staff: "Учётная запись не привязана к ресторану.",
  supabase: "Сервер не настроен (переменные NEXT_PUBLIC_SUPABASE_*).",
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Вход · Админка",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ redirect?: string; error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const redirectTo = safeAdminRedirect(sp.redirect);
  const initialError = sp.error ? ERROR_MESSAGES[sp.error] : undefined;

  if (!isSupabaseConfigured()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 p-6">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0A0A0A] p-8">
          <h1 className="mb-2 font-serif text-xl text-white">Вход для персонала</h1>
          <p className="text-sm text-amber-200/90">{ERROR_MESSAGES.supabase}</p>
        </div>
      </div>
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const staff = await getStaffForUser(supabase, user.id);
    if (staff) {
      redirect(redirectTo);
    }
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 p-6">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0A0A0A] p-8">
          <h1 className="mb-4 font-serif text-xl text-white">Вход для персонала</h1>
          <StaffAccessDenied />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0A0A0A] p-8">
        <h1 className="mb-6 font-serif text-xl text-white">Вход для персонала</h1>
        <LoginForm redirectTo={redirectTo} initialError={initialError} />
      </div>
    </div>
  );
}
