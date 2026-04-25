import type { Metadata } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import type { TenantRow } from "@/lib/validation/menu";
import type { TenantPublicConfig } from "@/lib/services/tenant.types";

export type SeoContext = {
  /** Канонический базовый URL (для OG/metadataBase). */
  siteUrl: string;
};

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) {
    // Во время `next build` допускаем localhost, чтобы не ломать пререндер в CI.
    // Fail-closed применяется к реальному прод-рантайму.
    if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
      return "http://localhost:3000";
    }
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "SEO: NEXT_PUBLIC_SITE_URL обязателен в production (canonical/OG).",
      );
    }
    return "http://localhost:3000";
  }
  return raw.replace(/\/$/, "");
}

export function buildHomeMetadata(
  tenant: TenantRow,
  copy: TenantPublicConfig,
): Metadata {
  const base = getSiteUrl();
  const title = `${copy.displayName} — Павлодар`;
  const description = `${copy.contacts.halalNote} ${copy.contacts.hoursLine}. ${copy.contacts.addressLine}`;
  const url = `${base}/`;

  return {
    metadataBase: new URL(base),
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url,
      siteName: copy.displayName,
      locale: "ru_RU",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}

export function buildMenuMetadata(
  tenant: TenantRow,
  copy: TenantPublicConfig,
): Metadata {
  const base = getSiteUrl();
  const title = `Меню — ${copy.displayName}`;
  const description = `Актуальное меню ${copy.displayName}. ${copy.contacts.hoursLine}. Доставка и бронь столов.`;
  const url = `${base}/${tenant.slug}/menu`;

  return {
    metadataBase: new URL(base),
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url,
      siteName: copy.displayName,
      locale: "ru_RU",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}

