import type { ReactNode } from "react";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { getLegalInfo } from "@/lib/legal";
import { getTenant } from "@/lib/tenant/getTenant";
import { getHomePublicCopy } from "@/lib/services/home-content";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const tenant = await getTenant();
  const copy = await getHomePublicCopy(tenant);
  const legal = getLegalInfo();

  return (
    <>
      <TopNav />
      {children}
      <Footer copy={copy} legal={legal} />
    </>
  );
}
