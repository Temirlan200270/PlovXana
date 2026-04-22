import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function CardFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative bg-umber-900 shadow-lift-md", className)}>
      <div className="absolute inset-0 ring-1 ring-gold-500/80" aria-hidden />
      <div
        className="absolute inset-[6px] ring-[0.5px] ring-gold-500/20 pointer-events-none"
        aria-hidden
      />
      <div className="relative">{children}</div>
    </div>
  );
}

