"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { BRAND_NAME } from "@/lib/branding";

type SiteLang = "ru" | "en";

function labels(lang: SiteLang) {
  if (lang === "en") {
    return {
      home: "Home",
      features: "Features",
      how: "How it works",
      demo: "Use case",
      about: "About",
      contact: "Contact",
    };
  }
  return {
    home: "Главная",
    features: "Возможности",
    how: "Как работает",
    demo: "Сценарий",
    about: "О сервисе",
    contact: "Контакты",
  };
}

export function TopNav() {
  const params = useSearchParams();
  const pathname = usePathname();
  const lang: SiteLang = params.get("lang") === "en" ? "en" : "ru";
  const text = labels(lang);
  const pagePath = pathname || "/";
  const isHome = pagePath === "/";

  const withLang = (targetPath: string) => `${targetPath}?lang=${lang}`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-700/60 bg-[#0f172a]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6 md:px-12">
        <Link href={withLang("/")} className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e2e8f0]">
          {BRAND_NAME}
        </Link>

        {isHome ? (
          <nav className="hidden items-center gap-6 md:flex">
            <Link href={`/?lang=${lang}#features`} className="text-xs text-slate-300 hover:text-[#22c55e]">
              {text.features}
            </Link>
            <Link href={`/?lang=${lang}#how`} className="text-xs text-slate-300 hover:text-[#22c55e]">
              {text.how}
            </Link>
            <Link href={`/?lang=${lang}#demo`} className="text-xs text-slate-300 hover:text-[#22c55e]">
              {text.demo}
            </Link>
            <Link href={`/?lang=${lang}#about`} className="text-xs text-slate-300 hover:text-[#22c55e]">
              {text.about}
            </Link>
            <Link href={`/?lang=${lang}#contact`} className="text-xs text-slate-300 hover:text-[#22c55e]">
              {text.contact}
            </Link>
          </nav>
        ) : (
          <nav className="hidden items-center gap-6 md:flex">
            <Link href={withLang("/")} className="text-xs text-slate-300 hover:text-[#22c55e]">
              {text.home}
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-2">
          <Link
            href={`${pagePath}?lang=ru`}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold ${lang === "ru" ? "bg-[#22c55e] text-[#0f172a]" : "bg-[#1e293b] text-slate-300"}`}
          >
            RUS
          </Link>
          <Link
            href={`${pagePath}?lang=en`}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold ${lang === "en" ? "bg-[#22c55e] text-[#0f172a]" : "bg-[#1e293b] text-slate-300"}`}
          >
            ENG
          </Link>
        </div>
      </div>
    </header>
  );
}
