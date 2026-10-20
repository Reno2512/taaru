import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { publicEnv } from "@/lib/env";

/**
 * Client Supabase pour les Server Components, Server Actions et Route Handlers.
 * Il agit au nom de l'utilisateur connecté : la RLS s'applique à chaque requête.
 */
export async function createClient() {
  const env = publicEnv();
  const cookieStore = await cookies();

  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Appelé depuis un Server Component, qui ne peut pas écrire de cookies.
          // Sans conséquence : src/proxy.ts rafraîchit la session à chaque navigation.
        }
      },
    },
  });
}
