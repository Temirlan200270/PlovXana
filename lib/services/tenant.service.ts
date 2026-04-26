import { isSupabaseConfigured } from "@/lib/supabase/server";
import { getTenantBySlug } from "@/lib/tenant/getTenant";
import { BRAND_NAME } from "@/lib/branding";
import type { TenantPublicConfig } from "./tenant.types";
import type { TenantRow } from "@/lib/validation/menu";
import { HomeConfigSchema } from "@/lib/validation/tenantLanding";

const PILOT_SLUG = "plovxana";

/** Пилотный маркетинговый слой (fallback, если `home_config` в БД пуст). */
function getPilotTenant(): TenantPublicConfig {
  const publicEmail =
    process.env.LEGAL_PUBLIC_EMAIL?.trim() || "info@plovxanapvl.com";
  return {
    slug: PILOT_SLUG,
    displayName: BRAND_NAME,
    themeId: "saas-dark",

    heroEyebrow: "KZ · СЕРВИС ОБРАБОТКИ ЗАКАЗОВ",
    heroTitleLine1: "Сервис заказов",
    heroTitleAccent: "для кафе",
    heroSub:
      "Приём заявок, подтверждения и статусы для кафе. Юридический оператор — ИП Абишев; позиционирование как сервис для бизнеса, а не как сайт кафе.",
    primaryCtaLabel: "Обсудить подключение",
    secondaryCtaLabel: "Как это работает",

    aboutEyebrow: "01 — О КОМПАНИИ",
    aboutTitleLine1: "Сервис для",
    aboutTitleAccent: "общепита",
    aboutLead:
      `${BRAND_NAME} оказывает услуги по обработке заказов для кафе: приём заявки, подтверждение, статусы. Мы не продаём еду — помогаем заведению выстроить стабильный процесс обслуживания гостей.`,
    aboutClosingItalic:
      "Единый смысл сервиса: обработка заказов для кафе с быстрым и понятным рабочим процессом.",
    aboutStats: [
      { value: "OPS", label: "ORDER FLOW" },
      { value: "B2B", label: "ДЛЯ КАФЕ" },
      { value: "KZ", label: "КАЗАХСТАН" },
    ],
    aboutPhotoUrl: "/photo/atmosphere-warm.webp",

    signatureEyebrow: "02 — СЕРВИС",
    signatureTitleLine1: "Обработка",
    signatureTitleAccent: "заказов для кафе",

    galleryEyebrow: "03 — ПРОЦЕСС",
    galleryTitleLine1: "От запроса",
    galleryTitleAccent: "к заявке",
    galleryTiles: [
      { caption: "ЗАПРОС ГОСТЯ", variant: "default" },
      { caption: "СБОР ЗАКАЗА", variant: "tea" },
      { caption: "СТАТУСЫ", variant: "samsa" },
      { caption: "ПЕРЕДАЧА НА КУХНЮ", variant: "dessert" },
    ],

    reserveEyebrow: "04 — СВЯЗЬ",
    reserveTitleLine1: "Обсудим",
    reserveTitleAccent: "внедрение",
    reserveSub: "Расскажите о формате заведения и текущем процессе заказов — предложим архитектуру сценария.",

    footerClosingItalic: "Работаем с кафе по всему Казахстану.",
    footerCreditLine: "",
    footerInstagramLabel: "Instagram",
    contacts: {
      // Было (откат адреса):
      // addressLine:
      //   "ТЦ Saida Plaza, пр. Нурсултана Назарбаева, 60/5, 1 этаж, Павлодар",
      // streetAddress:
      //   "проспект Нурсултана Назарбаева, 60/5, ТЦ Saida Plaza, 1 этаж",
      addressLine: "Естая 81/1, офис 19, Павлодар, почтовый индекс 140003",
      streetAddress: "Естая 81/1, офис 19, 140003",
      addressLocality: "Павлодар",
      publicEmail: publicEmail,
      hoursLine: "Пн — Пт, 09:00–18:00 (местное время)",
      // Было (откат телефонов):
      // bookingPhoneDisplay: "+7 777 400 77 28",
      // bookingPhoneE164: "+77774007728",
      // deliveryPhoneDisplay: "+7 707 400 77 28",
      // deliveryPhoneE164: "+77074007728",
      bookingPhoneDisplay: "+7 701 100 05 70",
      bookingPhoneE164: "+77011000570",
      deliveryPhoneDisplay: "+7 701 100 05 70",
      deliveryPhoneE164: "+77011000570",
      instagramUrl: "https://www.instagram.com/plovxana.pvl/",
      supportingContactLine: "Ответ на запрос — в течение 1 рабочего дня.",
      serviceTagline:
        "Сервис приёма и обработки заказов для кафе (Казахстан).",
    },
  };
}

function mergePilotWithNonPilotTenantRow(tenant: TenantRow): TenantPublicConfig {
  const base = getPilotTenant();
  const phone = tenant.contact_phone?.trim();
  return {
    ...base,
    slug: tenant.slug,
    displayName: BRAND_NAME,
    contacts: {
      ...base.contacts,
      addressLine: tenant.address?.trim() || base.contacts.addressLine,
      streetAddress: tenant.address?.trim() || base.contacts.streetAddress,
      addressLocality: base.contacts.addressLocality,
      publicEmail: tenant.contact_email?.trim() || base.contacts.publicEmail,
      ...(phone
        ? {
            bookingPhoneDisplay: phone,
            deliveryPhoneDisplay: phone,
          }
        : {}),
    },
  };
}

/**
 * Накладывает `tenants.home_config` (JSONB) на базовый конфиг. Контакты из `contacts` не перезаписываются из JSON.
 */
function applyHomeConfig(
  config: TenantPublicConfig,
  raw: unknown,
): TenantPublicConfig {
  if (raw == null) return config;
  const parsed = HomeConfigSchema.safeParse(raw);
  if (!parsed.success) {
    console.warn("[applyHomeConfig] invalid home_config", parsed.error.flatten());
    return config;
  }
  const h = parsed.data;
  return {
    ...config,
    ...h,
    footerCreditLine: h.footerCreditLine ?? config.footerCreditLine,
    footerInstagramLabel: h.footerInstagramLabel ?? config.footerInstagramLabel,
    contacts: config.contacts,
  };
}

/**
 * Полный публичный DTO лендинга: пилотный шаблон + строка `tenants` + опциональный `home_config`.
 */
export function buildPublicConfigFromRow(tenant: TenantRow): TenantPublicConfig {
  const pilot = getPilotTenant();
  const base: TenantPublicConfig =
    tenant.slug === PILOT_SLUG
      ? {
          ...pilot,
          displayName: BRAND_NAME,
        }
      : mergePilotWithNonPilotTenantRow(tenant);

  return applyHomeConfig(base, tenant.home_config ?? null);
}

/**
 * Публичный конфиг по slug: при наличии Supabase — активная строка `tenants` + `home_config`;
 * без .env — только пилотный slug для локальной вёрстки.
 */
export async function getTenantConfig(slug: string): Promise<TenantPublicConfig> {
  if (!isSupabaseConfigured()) {
    if (slug !== PILOT_SLUG) {
      throw new Error(`Неизвестный тенант: ${slug}`);
    }
    return getPilotTenant();
  }

  const row = await getTenantBySlug(slug);
  if (!row) {
    throw new Error(`Неизвестный тенант: ${slug}`);
  }
  return buildPublicConfigFromRow(row);
}
