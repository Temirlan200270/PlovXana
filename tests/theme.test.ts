import { describe, expect, it } from "vitest";
import { resolveThemePreset, themeToCssVars } from "@/lib/theme/theme-resolver";
import { BRAND_NAME } from "@/lib/branding";

describe("Theme runtime", () => {
  it("resolves base theme when tenant theme is null", () => {
    const preset = resolveThemePreset({
      id: "a0000000-0000-4000-8000-000000000001",
      slug: "plovxana",
      name: BRAND_NAME,
      theme: null,
    } as any);

    const vars = themeToCssVars(preset);
    expect(vars["--bg"]).toBeTruthy();
    expect(vars["--primary"]).toBeTruthy();
  });
});

