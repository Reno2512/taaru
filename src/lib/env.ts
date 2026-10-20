import { z } from "zod";

// Variables publiques : visibles dans le navigateur, donc jamais de clé secrète ici.
// Chaque variable est lue explicitement pour que Next.js puisse l'inclure dans le code client.
const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url({ message: "NEXT_PUBLIC_SUPABASE_URL doit être l'URL du projet (https://xxxx.supabase.co)" }),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z
    .string({ message: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY est manquante" })
    .min(20, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY est trop courte")
    .refine((k) => !k.startsWith("sb_secret_") && !isServiceRoleJwt(k), {
      message: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY contient une clé secrète : utilisez la clé publique (sb_publishable_… ou anon)",
    }),
});

/** Détecte une ancienne clé service_role (JWT dont le rôle est « service_role »). */
function isServiceRoleJwt(key: string): boolean {
  const payload = key.split(".")[1];
  if (!payload) return false;
  try {
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return json?.role === "service_role";
  } catch {
    return false;
  }
}

export type PublicEnv = z.infer<typeof publicSchema>;

export function parsePublicEnv(source: Record<string, string | undefined>): PublicEnv {
  const result = publicSchema.safeParse(source);
  if (!result.success) {
    const details = result.error.issues.map((i) => `- ${i.message}`).join("\n");
    throw new Error(`Configuration invalide (voir .env.example) :\n${details}`);
  }
  return result.data;
}

let cached: PublicEnv | undefined;

export function publicEnv(): PublicEnv {
  cached ??= parsePublicEnv({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });
  return cached;
}
