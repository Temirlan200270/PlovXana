import type { ReactNode } from "react";

export function ItalicAccent({ children }: { children: ReactNode }) {
  return (
    <span className="italic bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 bg-clip-text text-transparent">
      {children}
    </span>
  );
}

