import { z } from "zod";

/**
 * Частичные переопределения лендинга из `tenants.home_config` (JSONB).
 * Все поля опциональны: в БД задаётся только то, что отличается от пилотного шаблона.
 */
export const HomeConfigSchema = z.object({
  displayName: z.string().min(1).optional(),
  heroEyebrow: z.string().optional(),
  heroTitleLine1: z.string().optional(),
  heroTitleAccent: z.string().optional(),
  heroSub: z.string().optional(),
  primaryCtaLabel: z.string().optional(),
  secondaryCtaLabel: z.string().optional(),
  aboutEyebrow: z.string().optional(),
  aboutTitleLine1: z.string().optional(),
  aboutTitleAccent: z.string().optional(),
  aboutLead: z.string().optional(),
  aboutClosingItalic: z.string().optional(),
  aboutStats: z
    .array(
      z.object({
        value: z.string().min(1),
        label: z.string().min(1),
      }),
    )
    .max(6)
    .optional(),
  aboutPhotoUrl: z.string().min(1).optional(),

  signatureEyebrow: z.string().optional(),
  signatureTitleLine1: z.string().optional(),
  signatureTitleAccent: z.string().optional(),

  galleryEyebrow: z.string().optional(),
  galleryTitleLine1: z.string().optional(),
  galleryTitleAccent: z.string().optional(),
  galleryTiles: z
    .array(
      z.object({
        caption: z.string().min(1),
        variant: z.enum(["plov", "kazy", "samsa", "tea", "dessert", "default"]),
      }),
    )
    .max(8)
    .optional(),

  reserveEyebrow: z.string().optional(),
  reserveTitleLine1: z.string().optional(),
  reserveTitleAccent: z.string().optional(),
  reserveSub: z.string().optional(),

  footerClosingItalic: z.string().optional(),
  footerCreditLine: z.string().optional(),
  footerInstagramLabel: z.string().optional(),
});

export type HomeConfig = z.infer<typeof HomeConfigSchema>;
