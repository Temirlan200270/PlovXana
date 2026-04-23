/** Склейка className без лишних зависимостей. */
export function cn(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(" ");
}
