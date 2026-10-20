import { createClient } from "@/lib/supabase/server";

type Status = { tone: "ok" | "warn" | "error"; title: string; detail: string };

// Codes renvoyés quand la table n'existe pas (PostgREST, puis PostgreSQL).
const MISSING_TABLE = new Set(["PGRST205", "42P01"]);
// Droit refusé : la table existe mais n'est pas lisible sans connexion. C'est le cas attendu.
const PERMISSION_DENIED = "42501";

function unreachableDetail(message: string): string {
  return /fetch failed|network|ENOTFOUND|ECONNREFUSED/i.test(message)
    ? "Le serveur ne parvient pas à joindre Supabase. Vérifiez NEXT_PUBLIC_SUPABASE_URL et la connexion internet."
    : message;
}

async function checkDatabase(): Promise<Status> {
  let supabase;
  try {
    supabase = await createClient();
  } catch (error) {
    return { tone: "error", title: "Configuration manquante", detail: (error as Error).message };
  }
  try {
    const { error } = await supabase.from("measurement_templates").select("id", { head: true, count: "exact" });
    if (!error || error.code === PERMISSION_DENIED) {
      return { tone: "ok", title: "Base de données connectée", detail: "Le schéma est installé." };
    }
    if (MISSING_TABLE.has(error.code)) {
      return { tone: "warn", title: "Base connectée, schéma absent", detail: "Appliquez la migration de supabase/migrations/ sur le projet." };
    }
    return { tone: "error", title: "Base de données injoignable", detail: unreachableDetail(error.message) };
  } catch (error) {
    return { tone: "error", title: "Base de données injoignable", detail: unreachableDetail((error as Error).message) };
  }
}

const toneClass: Record<Status["tone"], string> = {
  ok: "bg-success-soft text-success",
  warn: "bg-warning-soft text-warning",
  error: "bg-warning-soft text-destructive",
};

export async function DatabaseStatus() {
  const status = await checkDatabase();
  return (
    <div className={`rounded-lg px-4 py-3 ${toneClass[status.tone]}`} role="status">
      <p className="font-semibold">{status.title}</p>
      <p className="text-sm opacity-90 break-words">{status.detail}</p>
    </div>
  );
}

export function DatabaseStatusSkeleton() {
  return <div className="h-[68px] animate-pulse rounded-lg bg-muted" aria-label="Vérification de la base de données" />;
}
