import type { ReactNode } from "react";
import { OrnamentCorner } from "@/components/ornaments/OrnamentCorner";
import { cn } from "@/lib/utils/cn";

export function HeroFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-0 ring-1 ring-gold-500" aria-hidden />
      <div
        className="absolute inset-2 ring-[0.5px] ring-gold-500/40 [border-style:dashed] pointer-events-none"
        aria-hidden
      />
      <OrnamentCorner position="tl" />
      <OrnamentCorner position="tr" />
      <OrnamentCorner position="bl" />
      <OrnamentCorner position="br" />
      <div className="relative z-10 px-8 py-12 md:px-16 md:py-16">
        {children}
      </div>
    </div>
  );
}

