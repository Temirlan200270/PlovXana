import { z } from "zod";

/**
 * Typed tenant theme contract (v1).
 * Это API, которым пользуется UI: не `record(unknown)`.
 */
export const TenantThemeSchema = z.object({
  id: z.string().min(1).default("system-dark"),
  colors: z
    .object({
      background: z.string().min(1).optional(),
      surface: z.string().min(1).optional(),
      surface2: z.string().min(1).optional(),
      border: z.string().min(1).optional(),
      muted: z.string().min(1).optional(),
      primary: z.string().min(1).optional(),
      primaryForeground: z.string().min(1).optional(),
      primarySoft: z.string().min(1).optional(),
      primaryGlow: z.string().min(1).optional(),
      text: z.string().min(1).optional(),
    })
    .partial()
    .optional(),
  ornament: z
    .object({
      patternUrl: z.string().min(1).optional(),
      opacity: z.number().min(0).max(1).optional(),
    })
    .partial()
    .optional(),
});

export type TenantTheme = z.infer<typeof TenantThemeSchema>;

