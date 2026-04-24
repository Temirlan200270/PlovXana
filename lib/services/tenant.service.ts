import { isSupabaseConfigured } from "@/lib/supabase/server";
import { getTenantBySlug } from "@/lib/tenant/getTenant";
import { BRAND_NAME } from "@/lib/branding";
import type { TenantPublicConfig } from "./tenant.types";
import type { TenantRow } from "@/lib/validation/menu";
import { HomeConfigSchema } from "@/lib/validation/tenantLanding";

const PILOT_SLUG = "plovxana";

/** Пилотный маркетинговый слой (fallback, если `home_config` в БД пуст). */
function getPilotTenant(): TenantPublicConfig {
  return {
    slug: PILOT_SLUG,
    displayName: BRAND_NAME,
    themeId: "kazakh-luxury",

    heroEyebrow: "KZ · ПАВЛОДАР · 2026",
    heroTitleLine1: "Вкус шёлкового пути,",
    heroTitleAccent: "рождённый в огне.",
    heroSub:
      "Кочевое наследие Центральной Азии — на открытом пламени, в окружении старинной чеканки, шёлка и запаха дымящегося казана.",
    primaryCtaLabel: "Забронировать у огня",
    secondaryCtaLabel: "Смотреть меню",

    aboutEyebrow: "01 — НАША ИСТОРИЯ",
    aboutTitleLine1: "Огонь, который",
    aboutTitleAccent: "помнит предков.",
    aboutLead:
      "Plovxana — это не ресторан. Это дастархан, за которым встречаются поколения. Наши казаны — из меди, привезённой из Бухары. Рис — из Ферганской долины. А рецепт плова передаётся в семье шеф-повара уже четыре поколения.",
    aboutClosingItalic:
      "Каждое блюдо — это рассказ. Каждая специя — строчка в эпосе, звучащем под струны домбры.",
    aboutStats: [
      { value: "04", label: "ПОКОЛЕНИЯ" },
      { value: "37", label: "БЛЮД В МЕНЮ" },
      { value: "1924", label: "ГОД РЕЦЕПТА" },
    ],
    aboutPhotoUrl: "/photo/atmosphere-warm.webp",

    signatureEyebrow: "02 — ФИРМЕННЫЕ БЛЮДА",
    signatureTitleLine1: "Вкус, высеченный",
    signatureTitleAccent: "на кости времени.",

    galleryEyebrow: "03 — АТМОСФЕРА",
    galleryTitleLine1: "Зал, где время",
    galleryTitleAccent: "течёт медленнее.",
    galleryTiles: [
      { caption: "ОСНОВНОЙ ЗАЛ", variant: "default" },
      { caption: "РУЧНАЯ КЕРАМИКА", variant: "tea" },
      { caption: "ЖИВАЯ МУЗЫКА · ПТ–ВС", variant: "samsa" },
      { caption: "ОТКРЫТЫЙ ТАНДЫР", variant: "dessert" },
    ],

    reserveEyebrow: "04 — БРОНИРОВАНИЕ",
    reserveTitleLine1: "Забронируйте стол",
    reserveTitleAccent: "на вечер у огня.",
    reserveSub: "Мы держим для вас место. Принесём чай, пока вы идёте.",

    footerClosingItalic: "Приходите, пока казан горячий.",
    footerCreditLine: "",
    footerInstagramLabel: "Instagram",
    contacts: {
      // Было (откат адреса):
      // addressLine:
      //   "ТЦ Saida Plaza, пр. Нурсултана Назарбаева, 60/5, 1 этаж, Павлодар",
      // streetAddress:
      //   "проспект Нурсултана Назарбаева, 60/5, ТЦ Saida Plaza, 1 этаж",
      addressLine: "Естая 83, Павлодар, почтовый индекс 140003",
      streetAddress: "Естая 83, 140003",
      addressLocality: "Павлодар",
      publicEmail: null,
      hoursLine: "Пн — Вс, 11:00–24:00",
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
      kazansLine: "Казаны: 12:00 • 16:00 • 19:00",
      halalNote: "Заведение халяльное.",
    },
  };
}

function mergePilotWithNonPilotTenantRow(tenant: TenantRow): TenantPublicConfig {
  const base = getPilotTenant();
  const phone = tenant.contact_phone?.trim();
  return {
    ...base,
    slug: tenant.slug,
    displayName: tenant.name,
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
          displayName: tenant.name?.trim() || pilot.displayName,
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
