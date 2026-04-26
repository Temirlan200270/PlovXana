import type { TenantPublicConfig } from "@/lib/services/tenant.types";
import type { TenantRow } from "@/lib/validation/menu";
import type { MenuCategoryWithItems } from "@/lib/validation/menu";
import { getLegalInfo } from "@/lib/legal";
import { getSiteUrl } from "@/lib/seo/seo";

function toPostalAddress(copy: TenantPublicConfig): Record<string, unknown> {
  const street =
    copy.contacts.streetAddress?.trim() || copy.contacts.addressLine;
  const locality = copy.contacts.addressLocality?.trim();
  const base: Record<string, unknown> = {
    "@type": "PostalAddress",
    streetAddress: street,
    addressCountry: "KZ",
  };
  if (locality) {
    base.addressLocality = locality;
  }
  return base;
}

function openingHoursFromCopy(copy: TenantPublicConfig): string[] | undefined {
  const line = copy.contacts.hoursLine.trim();
  const timeMatch = line.match(/(\d{1,2}:\d{2}).*?(\d{1,2}:\d{2})/);
  if (!timeMatch) return undefined;
  const from = timeMatch[1];
  const to = timeMatch[2];
  const isWeekdays = /Пн[^В]*Пт/i.test(line) || /Mon[^S]*Fri/i.test(line);
  const spec = isWeekdays ? "Mo-Fr" : "Mo-Su";
  return [`${spec} ${from}-${to}`];
}

/**
 * JSON-LD: исполнитель услуги (ИП), не ресторан — Organization + ProfessionalService.
 */
export function buildOrganizationJsonLd(
  _tenant: TenantRow,
  copy: TenantPublicConfig,
): Record<string, unknown> {
  const base = getSiteUrl();
  const openingHours = openingHoursFromCopy(copy);
  const legal = getLegalInfo();
  const publicEmail = (copy.contacts.publicEmail?.trim() || legal.publicEmail).trim();
  const instagram = copy.contacts.instagramUrl?.trim();
  const sameAs: string[] = [];
  if (instagram) sameAs.push(instagram);

  const payload: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    name: legal.operatorNameRu,
    alternateName: legal.brandName,
    url: base,
    telephone: copy.contacts.bookingPhoneE164,
    email: publicEmail,
    address: toPostalAddress(copy),
    areaServed: { "@type": "Country", name: "Kazakhstan" },
    serviceType:
      "Операционный сервис по приёму и обработке заказов для кафе",
    knowsAbout: [
      "Cafe order handling",
      "Order confirmations and status updates",
      "Customer communication for cafes",
    ],
    description: copy.contacts.serviceTagline,
  };
  if (openingHours) payload.openingHours = openingHours;
  if (sameAs.length > 0) payload.sameAs = sameAs;
  return payload;
}

export function buildMenuJsonLd(
  tenant: TenantRow,
  menu: MenuCategoryWithItems[],
): Record<string, unknown> | null {
  if (menu.length === 0) return null;
  const base = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: `Меню — ${tenant.name}`,
    url: `${base}/${tenant.slug}/menu`,
    hasMenuSection: menu.map((cat) => ({
      "@type": "MenuSection",
      name: cat.name,
      hasMenuItem: cat.items.slice(0, 50).map((item) => ({
        "@type": "MenuItem",
        name: item.name,
        description: item.description ?? undefined,
        offers: {
          "@type": "Offer",
          priceCurrency: tenant.currency?.trim() || "KZT",
          price: item.price,
        },
      })),
    })),
  };
}

