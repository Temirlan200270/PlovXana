import type { TenantPublicConfig } from "@/lib/services/tenant.types";
import type { TenantRow } from "@/lib/validation/menu";
import type { MenuCategoryWithItems } from "@/lib/validation/menu";
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
  // Преобразуем "Пн — Вс, 11:00–24:00" -> "Mo-Su 11:00-24:00" (best-effort).
  const line = copy.contacts.hoursLine.trim();
  const timeMatch = line.match(/(\d{1,2}:\d{2}).*?(\d{1,2}:\d{2})/);
  if (!timeMatch) return undefined;
  const from = timeMatch[1];
  const to = timeMatch[2];
  return [`Mo-Su ${from}-${to}`];
}

export function buildRestaurantJsonLd(
  tenant: TenantRow,
  copy: TenantPublicConfig,
): Record<string, unknown> {
  const base = getSiteUrl();
  const openingHours = openingHoursFromCopy(copy);
  const publicEmail = copy.contacts.publicEmail?.trim();

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: tenant.name,
    url: base,
    telephone: copy.contacts.bookingPhoneE164,
    sameAs: [copy.contacts.instagramUrl],
    address: toPostalAddress(copy),
    openingHours,
    ...(publicEmail ? { email: publicEmail } : {}),
    // Доп. информация из канона
    servesCuisine: ["Узбекская кухня", "Плов"],
  };
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

