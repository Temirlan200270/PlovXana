import type { ReactNode } from "react";
import { CartDrawer } from "@/components/cart/CartDrawer";

export default function MenuLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <CartDrawer currency="KZT" />
    </>
  );
}

