import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { DatabaseStatus, DatabaseStatusSkeleton } from "./database-status";

const READY = [
  "Application Next.js installable sur le téléphone",
  "Couleurs, polices et composants de la maquette",
  "Connexion sécurisée à Supabase préparée",
  "Base de données protégée atelier par atelier",
];

const NEXT = [
  "Semaine 2 : connexion et création de votre atelier",
  "Semaine 3 : clients et prise de mesures",
  "Semaine 4 : nouvelle commande",
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col">
      <header className="bg-brand px-[max(1rem,env(safe-area-inset-left))] pt-[max(1.5rem,env(safe-area-inset-top))] pb-6 text-brand-foreground">
        <p className="font-mono text-xs tracking-widest uppercase opacity-80">Atelier de couture</p>
        <h1 className="font-display text-4xl font-extrabold">Taaru</h1>
        <p className="mt-1 opacity-90">Le cahier de l&apos;atelier, dans le téléphone.</p>
      </header>

      <div className="grid gap-6 px-[max(1rem,env(safe-area-inset-left))] py-6">
        <section className="grid gap-3" aria-labelledby="etat">
          <h2 id="etat" className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            État du service
          </h2>
          <Suspense fallback={<DatabaseStatusSkeleton />}>
            <DatabaseStatus />
          </Suspense>
        </section>

        <section className="grid gap-3 rounded-xl border bg-card p-4" aria-labelledby="pret">
          <h2 id="pret" className="font-semibold">Ce qui est prêt</h2>
          <ul className="grid gap-2">
            {READY.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-success" aria-hidden="true">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-3" aria-labelledby="suite">
          <h2 id="suite" className="font-semibold">Prochaines étapes</h2>
          <ol className="grid gap-2 text-muted-foreground">
            {NEXT.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>

        <Button asChild variant="outline" block>
          <Link href="/design">Voir les composants de l&apos;interface</Link>
        </Button>
      </div>
    </main>
  );
}
