import { describe, expect, it } from "vitest";
import {
  buildCartLineId,
  validateModifierSelectionByGroup,
} from "@/lib/domain/modifier-selection";
import type { ModifierGroup } from "@/lib/domain/modifier-selection";

describe("modifier-selection", () => {
  it("buildCartLineId стабилен при разном порядке id", () => {
    const a = buildCartLineId("550e8400-e29b-41d4-a716-446655440000", [
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    ]);
    const b = buildCartLineId("550e8400-e29b-41d4-a716-446655440000", [
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    ]);
    expect(a).toBe(b);
  });

  it("validateModifierSelectionByGroup учитывает min", () => {
    const groups: ModifierGroup[] = [
      {
        id: "11111111-1111-1111-1111-111111111111",
        name: "Размер",
        min_selection: 1,
        max_selection: 1,
        modifiers: [
          {
            id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
            name: "M",
            price: 0,
            is_available: true,
          },
        ],
      },
    ];
    const bad = validateModifierSelectionByGroup(groups, {
      "11111111-1111-1111-1111-111111111111": [],
    });
    expect(bad.ok).toBe(false);
    const good = validateModifierSelectionByGroup(groups, {
      "11111111-1111-1111-1111-111111111111": [
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      ],
    });
    expect(good.ok).toBe(true);
  });
});
