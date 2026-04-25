"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils/cn";

export type LanguageTabsProps = {
  ru: React.ReactNode;
  en: React.ReactNode;
  defaultLang?: "ru" | "en";
};

export function LanguageTabs({ ru, en, defaultLang = "ru" }: LanguageTabsProps) {
  const initial = useMemo<"ru" | "en">(() => defaultLang, [defaultLang]);
  const [lang, setLang] = useState<"ru" | "en">(initial);

  return (
    <div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setLang("ru")}
          className={cn(
            "px-3 py-2 rounded-none ring-1 text-xs font-medium tracking-[0.25em] uppercase transition-colors duration-600 ease-heritage",
            lang === "ru"
              ? "bg-gold-500/15 ring-gold-500/60 text-gold-500"
              : "bg-umber-900/40 ring-gold-500/20 text-cream-100/80 hover:text-gold-500",
          )}
        >
          RUS
        </button>
        <button
          type="button"
          onClick={() => setLang("en")}
          className={cn(
            "px-3 py-2 rounded-none ring-1 text-xs font-medium tracking-[0.25em] uppercase transition-colors duration-600 ease-heritage",
            lang === "en"
              ? "bg-gold-500/15 ring-gold-500/60 text-gold-500"
              : "bg-umber-900/40 ring-gold-500/20 text-cream-100/80 hover:text-gold-500",
          )}
        >
          ENG
        </button>
      </div>

      <div className="mt-8">{lang === "ru" ? ru : en}</div>
    </div>
  );
}

