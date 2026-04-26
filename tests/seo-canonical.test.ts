import { afterEach, describe, expect, it, vi } from "vitest";
import { BRAND_NAME } from "@/lib/branding";

const tenant = {
  id: "a0000000-0000-4000-8000-000000000001",
  slug: "plovxana",
  name: BRAND_NAME,
  currency: "KZT",
  theme: null,
  is_active: true,
};

const copy = {
  slug: "plovxana",
  displayName: BRAND_NAME,
  heroBadge: "",
  heroTitle: "",
  heroTitleAccent: "",
  heroSubtitle: "",
  themeId: "kazakh-luxury",
  primaryCtaLabel: "",
  secondaryCtaLabel: "",
  featuresSectionEyebrow: "",
  featuresSectionTitle: "",
  featuresSectionSubtitle: "",
  features: [],
  aiBadge: "",
  aiTitle: "",
  aiTitleAccent: "",
  aiDescription: "",
  demoUserMessage: "",
  demoAssistantMessage: "",
  navFeaturesHref: "",
  navAiHref: "",
  navMenuHref: "/plovxana/menu",
  menuPreviewTitle: "",
  menuPreviewSubtitle: "",
  aiDemoUserAvatarLabel: "G",
  footerCreditLine: "",
  footerInstagramLabel: "Instagram",
  footerBookingPrefix: "Бронь:",
  footerDeliveryPrefix: "Доставка:",
  contacts: {
    addressLine: "addr",
    hoursLine: "Mo-Su 11:00-24:00",
    bookingPhoneDisplay: "",
    bookingPhoneE164: "+77774007728",
    deliveryPhoneDisplay: "",
    deliveryPhoneE164: "+77074007728",
    instagramUrl: "https://example.com",
    supportingContactLine: "",
    serviceTagline: "WhatsApp solutions for restaurants.",
  },
  menuSnippet: [],
};

/**
 * Изолированные тесты: `getSiteUrl` читает `process.env` при вызове;
 * `vi.resetModules()` нужен, чтобы подхватить stub env до загрузки `seo.ts`
 * (в т.ч. константы Next в том же модуле).
 */
describe("SEO canonical vs NEXT_PUBLIC_SITE_URL", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("getSiteUrl strips trailing slash from env", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://preview.example.com/");
    const { getSiteUrl } = await import("@/lib/seo/seo");
    expect(getSiteUrl()).toBe("https://preview.example.com");
  });

  it("home canonical is absolute URL on configured host", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://production.example.com");
    const { buildHomeMetadata } = await import("@/lib/seo/seo");
    const md = buildHomeMetadata(tenant as never, copy as never);
    const c = md.alternates?.canonical;
    expect(c).toBeDefined();
    expect(String(c)).toBe("https://production.example.com/");
  });

  it("menu canonical includes tenant slug path", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://production.example.com");
    const { buildMenuMetadata } = await import("@/lib/seo/seo");
    const md = buildMenuMetadata(tenant as never, copy as never);
    const c = md.alternates?.canonical;
    expect(String(c)).toBe("https://production.example.com/plovxana/menu");
  });
});
