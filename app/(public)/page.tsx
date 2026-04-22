import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SignatureMenuSection } from "@/components/sections/SignatureMenuSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { ReserveSection } from "@/components/sections/ReserveSection";
import { getHomePublicCopy } from "@/lib/services/home-content";
import { buildHomeMetadata } from "@/lib/seo/seo";
import { buildRestaurantJsonLd } from "@/lib/seo/schema";
import { getTenant } from "@/lib/tenant/getTenant";
import { getMenu } from "@/services/menu/getMenu";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenant();
  const copy = await getHomePublicCopy(tenant);
  return buildHomeMetadata(tenant, copy);
}

/**
 * Главная (Heritage Edition): server-first, мультитенант через getTenant.
 * Композиция секций: Hero → About → SignatureMenu → Gallery → Reserve.
 * TopNav и Footer подключены в `app/(public)/layout.tsx`.
 */
export default async function HomePage() {
  const tenant = await getTenant();
  const copy = await getHomePublicCopy(tenant);
  const currency = tenant.currency?.trim() ? tenant.currency : "KZT";
  const menuHref = `/${tenant.slug}/menu`;
  const menuResult = await getMenu(tenant.id);

  return (
    <main className="relative bg-umber-950">
      <JsonLd data={buildRestaurantJsonLd(tenant, copy)} />

      <HeroSection copy={copy} menuHref={menuHref} />
      <AboutSection copy={copy} />
      <SignatureMenuSection
        copy={copy}
        menuHref={menuHref}
        currency={currency}
        menu={menuResult.menu}
      />
      <GallerySection copy={copy} />
      <ReserveSection copy={copy} />
    </main>
  );
}
