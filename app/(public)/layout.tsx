import type { ReactNode } from "react";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { getTenant } from "@/lib/tenant/getTenant";
import { getHomePublicCopy } from "@/lib/services/home-content";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const tenant = await getTenant();
  const copy = await getHomePublicCopy(tenant);
  const menuHref = `/${tenant.slug}/menu`;

  return (
    <>
      <TopNav menuHref={menuHref} />
      {children}
      <Footer copy={copy} />
      <CartDrawer currency="KZT" />
    </>
  );
}

