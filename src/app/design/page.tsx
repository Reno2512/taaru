import type { Metadata } from "next";
import Link from "next/link";
import { ComponentsShowcase } from "./showcase";

export const metadata: Metadata = { title: "Composants", robots: { index: false } };

export default function DesignPage() {
  return (
    <main className="mx-auto grid max-w-md gap-6 px-[max(1rem,env(safe-area-inset-left))] py-6">
      <div className="flex items-center gap-3">
        <Link href="/" className="grid size-11 place-items-center rounded-lg border bg-card text-lg" aria-label="Retour à l'accueil">
          ←
        </Link>
        <h1 className="font-display text-2xl font-extrabold">Composants</h1>
      </div>
      <p className="text-muted-foreground">
        Les briques de l&apos;interface, à valider avant de construire les écrans. Référence : docs/design-system.md.
      </p>
      <ComponentsShowcase />
    </main>
  );
}
