import { BRAND_NAME } from "@/lib/branding";

export type LegalInfo = {
  brandName: string;
  operatorNameRu: string;
  operatorNameEn: string;
  domain: string;
  publicEmail: string;
  phoneDisplay: string | null;
  city: string;
  country: string;
  addressLine: string;
  iinBin: string | null;
};

function readRequiredEnv(key: string, fallback: string): string {
  const raw = process.env[key];
  const v = raw?.trim();
  return v && v.length > 0 ? v : fallback;
}

function readOptionalEnv(key: string): string | null {
  const raw = process.env[key];
  const v = raw?.trim();
  return v && v.length > 0 ? v : null;
}

/**
 * Единое место для юр/контактных данных, которые реально проверяют Meta/WhatsApp Business.
 *
 * Почему так:
 * - один источник правды для футера + policy-страниц;
 * - удобно подставлять реальные реквизиты через env на проде без правок контента.
 */
export function getLegalInfo(): LegalInfo {
  return {
    brandName: readRequiredEnv("LEGAL_BRAND_NAME", BRAND_NAME),
    operatorNameRu: readRequiredEnv("LEGAL_OPERATOR_NAME_RU", "ИП АБИШЕВ"),
    operatorNameEn: readRequiredEnv(
      "LEGAL_OPERATOR_NAME_EN",
      "Individual Entrepreneur Abishev (Kazakhstan)",
    ),
    domain: readRequiredEnv("LEGAL_DOMAIN", "plovxanapvl.com"),
    publicEmail: readRequiredEnv("LEGAL_PUBLIC_EMAIL", "info@plovxanapvl.com"),
    phoneDisplay: readRequiredEnv("LEGAL_PUBLIC_PHONE", "+77011000570"),
    city: readRequiredEnv("LEGAL_CITY", "Павлодар"),
    country: readRequiredEnv("LEGAL_COUNTRY", "Казахстан"),
    addressLine: readRequiredEnv(
      "LEGAL_ADDRESS_LINE",
      "Казахстан, г. Павлодар, ул. Естая, д. 81/1, офис 19",
    ),
    iinBin: readRequiredEnv("LEGAL_IIN_BIN", "830520350723"),
  };
}

