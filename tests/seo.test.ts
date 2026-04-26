import { describe, expect, it } from "vitest";
import { buildHomeMetadata, buildMenuMetadata } from "@/lib/seo/seo";
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

describe("SEO builders", () => {
  it("buildHomeMetadata sets canonical and OG basics", () => {
    const md = buildHomeMetadata(tenant as any, copy as any);
    expect(md.title).toBeTruthy();
    expect(md.description).toBeTruthy();
    expect(md.alternates?.canonical).toBeTruthy();
    expect(md.openGraph?.title).toBeTruthy();
  });

  it("buildMenuMetadata includes slug in canonical", () => {
    const md = buildMenuMetadata(tenant as any, copy as any);
    const canonical = md.alternates?.canonical?.toString() ?? "";
    expect(canonical).toContain("/plovxana/menu");
  });
});

