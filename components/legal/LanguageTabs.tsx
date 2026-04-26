"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils/cn";

export type LanguageTabsProps = {
  ru: React.ReactNode;
  en: React.ReactNode;
  defaultLang?: "ru" | "en";
  showControls?: boolean;
  useUrlLang?: boolean;
};

export function LanguageTabs({
  ru,
  en,
  defaultLang = "ru",
  showControls = true,
  useUrlLang = false,
}: LanguageTabsProps) {
  const params = useSearchParams();
  const initial = useMemo<"ru" | "en">(() => defaultLang, [defaultLang]);
  const [lang, setLang] = useState<"ru" | "en">(initial);
  const urlLang = params.get("lang") === "en" ? "en" : "ru";
  const activeLang = useUrlLang ? urlLang : lang;

  return (
    <div>
      {showControls ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLang("ru")}
            className={cn(
              "px-3 py-2 rounded-none ring-1 text-xs font-medium tracking-[0.25em] uppercase transition-colors duration-600 ease-heritage",
              activeLang === "ru"
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
              activeLang === "en"
                ? "bg-gold-500/15 ring-gold-500/60 text-gold-500"
                : "bg-umber-900/40 ring-gold-500/20 text-cream-100/80 hover:text-gold-500",
            )}
          >
            ENG
          </button>
        </div>
      ) : null}

      <div className={showControls ? "mt-8" : ""}>{activeLang === "ru" ? ru : en}</div>
    </div>
  );
}

