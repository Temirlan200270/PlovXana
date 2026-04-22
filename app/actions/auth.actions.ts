"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { safeAdminRedirect } from "@/lib/auth/adminRedirects";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function signInAction(
  _prev: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase не настроен (NEXT_PUBLIC_SUPABASE_*)." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = safeAdminRedirect(String(formData.get("redirect") ?? ""));

  if (!email || !password) {
    return { error: "Введите email и пароль." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin", "layout");
  redirect(redirectTo);
}

export async function signOutAction() {
  if (!isSupabaseConfigured()) {
    redirect("/admin/login");
  }
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/admin/login");
}
