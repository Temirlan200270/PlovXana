import type { ThemePreset } from "@/lib/theme/theme-types";
import type { TenantRow } from "@/lib/validation/menu";

const BASE_THEME: ThemePreset = {
  id: "system-dark",
  colors: {
    background: "#050505",
    surface: "#121212",
    surface2: "#171717",
    border: "#262626",
    muted: "#737373",
    primary: "#C9A96E",
    primaryForeground: "#0A0A0A",
    primarySoft: "rgba(201,169,110,0.10)",
    primaryGlow: "rgba(201,169,110,0.18)",
    text: "#FFFFFF",
  },
  ornament: {
    patternUrl: "",
    opacity: 0,
  },
};

function readString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function readNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

/**
 * v1: резолвим тему из tenants.theme (jsonb) с fallback на BASE_THEME.
 * Формат theme в БД можно расширять без переписывания UI: меняются только переменные CSS.
 */
export function resolveThemePreset(tenant: TenantRow): ThemePreset {
  const t = tenant.theme ?? null;
  const colors = t?.colors;
  const ornament = t?.ornament;

  return {
    ...BASE_THEME,
    id: readString(t?.id) ?? BASE_THEME.id,
    colors: {
      ...BASE_THEME.colors,
      background: readString(colors?.background) ?? BASE_THEME.colors.background,
      surface: readString(colors?.surface) ?? BASE_THEME.colors.surface,
      surface2: readString(colors?.surface2) ?? BASE_THEME.colors.surface2,
      border: readString(colors?.border) ?? BASE_THEME.colors.border,
      muted: readString(colors?.muted) ?? BASE_THEME.colors.muted,
      primary: readString(colors?.primary) ?? BASE_THEME.colors.primary,
      primaryForeground:
        readString(colors?.primaryForeground) ??
        BASE_THEME.colors.primaryForeground,
      primarySoft: readString(colors?.primarySoft) ?? BASE_THEME.colors.primarySoft,
      primaryGlow: readString(colors?.primaryGlow) ?? BASE_THEME.colors.primaryGlow,
      text: readString(colors?.text) ?? BASE_THEME.colors.text,
    },
    ornament: {
      ...BASE_THEME.ornament,
      patternUrl: readString(ornament?.patternUrl) ?? BASE_THEME.ornament.patternUrl,
      opacity: readNumber(ornament?.opacity) ?? BASE_THEME.ornament.opacity,
    },
  };
}

export type ThemeCssVars = Record<`--${string}`, string>;

export function themeToCssVars(theme: ThemePreset): ThemeCssVars {
  return {
    "--bg": theme.colors.background,
    "--surface": theme.colors.surface,
    "--surface-2": theme.colors.surface2,
    "--border": theme.colors.border,
    "--muted": theme.colors.muted,
    "--primary": theme.colors.primary,
    "--primary-foreground": theme.colors.primaryForeground,
    "--primary-soft": theme.colors.primarySoft,
    "--primary-glow": theme.colors.primaryGlow,
    "--text": theme.colors.text,
    "--ornament-opacity": String(theme.ornament.opacity),
    "--ornament-url": theme.ornament.patternUrl ? `url('${theme.ornament.patternUrl}')` : "none",
  };
}

