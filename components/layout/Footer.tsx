"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { TenantPublicConfig } from "@/lib/services/tenant.types";
import type { LegalInfo } from "@/lib/legal";
import { BRAND_NAME } from "@/lib/branding";
import { DOMAIN_BRAND_NOTE } from "@/lib/content/saas-landing";

type FooterProps = {
  copy: TenantPublicConfig;
  legal: LegalInfo;
};

export function Footer({ copy, legal }: FooterProps) {
  const params = useSearchParams();
  const lang = params.get("lang") === "en" ? "en" : "ru";
  const email = copy.contacts.publicEmail?.trim() || legal.publicEmail;
  const iin = legal.iinBin?.trim();
  const labels =
    lang === "en"
      ? {
          docs: "Documents",
          iin: "IIN",
          address: "Address",
          privacy: "Политика конфиденциальности / Privacy Policy",
          terms: "Условия использования / Terms of Service",
        }
      : {
          docs: "Документы",
          iin: "ИИН",
          address: "Адрес",
          privacy: "Политика конфиденциальности / Privacy Policy",
          terms: "Условия использования / Terms of Service",
        };

  return (
    <footer className="border-t border-slate-700/50 bg-[#0f172a]">
      <div className="mx-auto max-w-[1200px] px-6 py-12 md:px-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-sm font-semibold text-[#e2e8f0]">{BRAND_NAME}</div>
            <p className="mt-2 max-w-md text-sm text-slate-400">{copy.contacts.serviceTagline}</p>
            <p className="mt-4 text-xs text-slate-500">
              {lang === "en" ? DOMAIN_BRAND_NOTE.en : DOMAIN_BRAND_NOTE.ru}
            </p>
          </div>
          <div className="space-y-2 text-sm text-slate-300 md:text-right">
            <a href={`mailto:${email}`} className="block hover:text-[#22c55e]">
              {email}
            </a>
            <a href={`tel:${copy.contacts.bookingPhoneE164}`} className="block hover:text-[#22c55e]">
              {copy.contacts.bookingPhoneDisplay}
            </a>
            <div className="pt-2 text-xs text-slate-200">{legal.operatorNameRu}</div>
            {iin ? (
              <div className="text-xs text-slate-500">
                {labels.iin}: {iin}
              </div>
            ) : null}
            <div className="text-xs text-slate-500">
              {labels.address}: {legal.addressLine}
            </div>
            <div className="pt-2 text-xs">
              <span className="mr-2 text-slate-500">{labels.docs}:</span>
              <Link href={`/privacy?lang=${lang}`} className="hover:text-[#22c55e]">
                {labels.privacy}
              </Link>
              <span className="px-2 text-slate-600">|</span>
              <Link href={`/terms?lang=${lang}`} className="hover:text-[#22c55e]">
                {labels.terms}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
