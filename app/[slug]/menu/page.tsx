import { notFound } from "next/navigation";
import { MenuClient } from "@/components/menu/MenuClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/ui/primitives/Section";
import { atmosphere } from "@/config/atmosphere";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { getHomePublicCopy } from "@/lib/services/home-content";
import { buildMenuMetadata } from "@/lib/seo/seo";
import { buildMenuJsonLd, buildRestaurantJsonLd } from "@/lib/seo/schema";
import { getTenantConfig } from "@/lib/services/tenant.service";
import { getTenantBySlug } from "@/lib/tenant/getTenant";
import { getMenu } from "@/services/menu/getMenu";
import type { Metadata } from "next";

type PageProps = { params: Promise<{ slug: string }> };

/** ISR: меню обновляется без деплоя. */
export const revalidate = 30;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const configured = isSupabaseConfigured();
  const tenantRow = configured ? await getTenantBySlug(slug) : null;

  if (!tenantRow) {
    const pilotCopy = await getTenantConfig("plovxana");
    return buildMenuMetadata(
      { id: slug, slug, name: slug, currency: "KZT", theme: null, is_active: true },
      pilotCopy,
    );
  }

  const copy = await getHomePublicCopy(tenantRow);
  return buildMenuMetadata(tenantRow, copy);
}

/**
 * Меню тенанта: SSR → getTenant + getMenu → MenuClient.
 * Заказ оформляется в боте; локальной корзины нет.
 */
export default async function MenuPage({ params }: PageProps) {
  const { slug } = await params;
  const configured = isSupabaseConfigured();
  const tenantRow = configured ? await getTenantBySlug(slug) : null;

  let displayName = slug;
  let tenantId = "";
  let currency = "KZT";
  let pilotCopy: Awaited<ReturnType<typeof getTenantConfig>> | null = null;

  if (tenantRow) {
    displayName = tenantRow.name;
    tenantId = tenantRow.id;
    currency = tenantRow.currency?.trim() ? tenantRow.currency : "KZT";
  } else if (configured) {
    notFound();
  } else {
    try {
      pilotCopy = await getTenantConfig(slug);
      displayName = pilotCopy.displayName;
    } catch {
      notFound();
    }
  }

  const menuResult =
    tenantId.length > 0
      ? await getMenu(tenantId)
      : { ok: true, menu: [], error: null as string | null };

  const copyForSchema = tenantRow
    ? await getHomePublicCopy(tenantRow)
    : (pilotCopy ?? (await getTenantConfig("plovxana")));

  const schemaTenant = tenantRow ?? {
    id: `pilot-${slug}`,
    slug,
    name: displayName,
    currency,
    theme: null,
    is_active: true,
  };

  const a = atmosphere.menu;
  const menuHref = `/${slug}/menu`;
  const orderHref = process.env.NEXT_PUBLIC_ORDER_URL?.trim() || null;

  return (
    <>
      <TopNav menuHref={menuHref} />

      <main className="bg-umber-950">
        <JsonLd data={buildRestaurantJsonLd(schemaTenant, copyForSchema)} />
        {buildMenuJsonLd(schemaTenant, menuResult.menu) ? (
          <JsonLd data={buildMenuJsonLd(schemaTenant, menuResult.menu)!} />
        ) : null}

        <Section
          texture="brick"
          textureOpacity={a.textureBrick.opacity}
          textureBlendMode={a.textureBrick.blendMode}
          grainOpacity={a.grain.opacity}
          className="min-h-screen"
        >
          <MenuClient
            initialMenu={menuResult.menu}
            tenantId={tenantId}
            tenantName={displayName}
            tenantSlug={slug}
            currency={currency}
            loadError={menuResult.error}
            showDevHint={!configured}
            orderHref={orderHref}
          />
        </Section>
      </main>

      <Footer copy={copyForSchema} />
    </>
  );
}
