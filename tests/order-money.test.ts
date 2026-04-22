import { describe, expect, it } from "vitest";
import { lineTotalTenge, moneyToIntTenge } from "@/lib/domain/order-money";

describe("order-money", () => {
  it("moneyToIntTenge rounds to integer tenge", () => {
    expect(moneyToIntTenge(100.4)).toBe(100);
    expect(moneyToIntTenge(100.5)).toBe(101);
    expect(moneyToIntTenge(Number.NaN)).toBe(0);
  });

  it("lineTotalTenge matches server line total pattern", () => {
    expect(lineTotalTenge(350, 2)).toBe(700);
    expect(lineTotalTenge(199.7, 1)).toBe(200);
  });
});
