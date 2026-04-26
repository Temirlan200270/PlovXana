import type { PlateVariant } from "@/components/ornaments/PlateIcon";

/** Контакты и часы — канон как в blueprint.md (пилот PlovXana PVL). */
export type TenantContacts = {
  /** Одна строка для футера и UI. */
  addressLine: string;
  /** schema.org PostalAddress.streetAddress (blueprint §4.A). */
  streetAddress: string;
  /** schema.org addressLocality. */
  addressLocality: string;
  /** Публичный email (Meta / юр. страницы); TBD в blueprint — оставить пустым, не подставлять выдуманный. */
  publicEmail: string | null;
  hoursLine: string;
  bookingPhoneDisplay: string;
  /** Для ссылок tel: в формате E.164 без пробелов. */
  bookingPhoneE164: string;
  deliveryPhoneDisplay: string;
  /** Для ссылок tel: в формате E.164 без пробелов. */
  deliveryPhoneE164: string;
  instagramUrl: string;
  /** Доп. строка в футере (SLA, время ответа и т.п.). */
  supportingContactLine: string;
  /** Краткое описание услуг для SEO и доверия (в т.ч. Meta). */
  serviceTagline: string;
};

export type TenantStat = {
  value: string;
  label: string;
};

export type TenantGalleryTile = {
  caption: string;
  variant: PlateVariant;
};

/** Конфиг тенанта для UI главной; без any — единый контракт для сервера и клиентских секций. */
export type TenantPublicConfig = {
  slug: string;
  displayName: string;
  themeId: string;

  heroEyebrow: string;
  heroTitleLine1: string;
  heroTitleAccent: string;
  heroSub: string;
  /** Главная кнопка Hero (например, связь / заявка). */
  primaryCtaLabel: string;
  /** Вторая кнопка Hero (например, якорь на блок «как работает»). */
  secondaryCtaLabel: string;

  aboutEyebrow: string;
  aboutTitleLine1: string;
  aboutTitleAccent: string;
  aboutLead: string;
  aboutClosingItalic: string;
  aboutStats: TenantStat[];
  aboutPhotoUrl: string;

  signatureEyebrow: string;
  signatureTitleLine1: string;
  signatureTitleAccent: string;

  galleryEyebrow: string;
  galleryTitleLine1: string;
  galleryTitleAccent: string;
  galleryTiles: TenantGalleryTile[];

  reserveEyebrow: string;
  reserveTitleLine1: string;
  reserveTitleAccent: string;
  reserveSub: string;

  footerClosingItalic: string;
  /** Строка под копирайтом (white-label); пустая — не показывать. */
  footerCreditLine: string;
  /** Подпись к ссылке Instagram в футере. */
  footerInstagramLabel: string;
  contacts: TenantContacts;
};
