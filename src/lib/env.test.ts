import { describe, expect, it } from "vitest";
import { parsePublicEnv } from "./env";

const url = "https://abcdefgh.supabase.co";
const jwt = (role: string) => `eyJhbGciOiJIUzI1NiJ9.${btoa(JSON.stringify({ role }))}.signature`;

describe("parsePublicEnv", () => {
  it("accepte une clé publishable", () => {
    const env = parsePublicEnv({ NEXT_PUBLIC_SUPABASE_URL: url, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_abcdefghijklmnop" });
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBe(url);
  });
  it("accepte une ancienne clé anon", () => {
    expect(() => parsePublicEnv({ NEXT_PUBLIC_SUPABASE_URL: url, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: jwt("anon") })).not.toThrow();
  });
  it("refuse une clé secrète", () => {
    expect(() => parsePublicEnv({ NEXT_PUBLIC_SUPABASE_URL: url, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_secret_abcdefghijklmnopqrst" })).toThrow(/clé secrète/);
  });
  it("refuse une clé service_role", () => {
    expect(() => parsePublicEnv({ NEXT_PUBLIC_SUPABASE_URL: url, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: jwt("service_role") })).toThrow(/clé secrète/);
  });
  it("explique ce qui manque", () => {
    expect(() => parsePublicEnv({})).toThrow(/Configuration invalide/);
  });
});
