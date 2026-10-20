import { describe, expect, it } from "vitest";
import { formatDate, formatFCFA, formatPhoneSN, normalizePhoneSN, parseFCFA } from "./format";

describe("formatFCFA", () => {
  it("sépare les milliers par une espace", () => {
    expect(formatFCFA(25000)).toBe("25 000 FCFA");
    expect(formatFCFA(1250000)).toBe("1 250 000 FCFA");
    expect(formatFCFA(500)).toBe("500 FCFA");
    expect(formatFCFA(0)).toBe("0 FCFA");
  });
  it("gère les montants négatifs", () => {
    expect(formatFCFA(-15000)).toBe("-15 000 FCFA");
  });
  it("refuse les centimes", () => {
    expect(() => formatFCFA(10.5)).toThrow();
  });
});

describe("parseFCFA", () => {
  it("lit les saisies courantes", () => {
    expect(parseFCFA("25 000")).toBe(25000);
    expect(parseFCFA("25.000 FCFA")).toBe(25000);
    expect(parseFCFA("25000f")).toBe(25000);
  });
  it("renvoie null sans chiffre", () => {
    expect(parseFCFA("")).toBeNull();
    expect(parseFCFA("abc")).toBeNull();
  });
});

describe("formatDate", () => {
  it("affiche jj/mm/aaaa", () => {
    expect(formatDate("2026-03-09")).toBe("09/03/2026");
    expect(formatDate(new Date(2027, 4, 16))).toBe("16/05/2027");
  });
  it("ne décale pas le jour selon le fuseau horaire", () => {
    expect(formatDate("2026-12-31")).toBe("31/12/2026");
  });
});

describe("normalizePhoneSN", () => {
  it.each([
    ["77 123 45 67", "+221771234567"],
    ["771234567", "+221771234567"],
    ["+221 77 123 45 67", "+221771234567"],
    ["00221771234567", "+221771234567"],
    ["221781234567", "+221781234567"],
    ["70 123 45 67", "+221701234567"],
    ["33 822 00 00", "+221338220000"],
  ])("%s → %s", (input, expected) => {
    expect(normalizePhoneSN(input)).toBe(expected);
  });
  it.each(["", "12345", "79 123 45 67", "77 123 45 6", "+33 6 12 34 56 78"])("refuse %s", (input) => {
    expect(normalizePhoneSN(input)).toBeNull();
  });
});

describe("formatPhoneSN", () => {
  it("regroupe les chiffres pour la lecture", () => {
    expect(formatPhoneSN("+221771234567")).toBe("77 123 45 67");
  });
});
