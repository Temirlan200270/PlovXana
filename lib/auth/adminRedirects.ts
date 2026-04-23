/** Защита от open redirect: только внутренние пути `/admin/...`. */
export function safeAdminRedirect(path: string | null | undefined): string {
  if (!path || !path.startsWith("/admin")) return "/admin/dashboard";
  if (path.startsWith("//")) return "/admin/dashboard";
  return path;
}
