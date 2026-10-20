"use client";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input, Label } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import { formatFCFA } from "@/lib/format";

const STATUSES = [
  { label: "prête", className: "bg-success-soft text-success" },
  { label: "en retard", className: "bg-warning-soft text-warning" },
  { label: "couture", className: "bg-primary-soft text-primary" },
  { label: "livrée", className: "border text-muted-foreground" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-3">
      <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">{title}</h2>
      {children}
    </section>
  );
}

export function ComponentsShowcase() {
  return (
    <div className="grid gap-8 pb-10">
      <Section title="Boutons">
        <Button block>+ Nouvelle commande</Button>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="primary">Passer à : Couture</Button>
          <Button variant="success">Marquer livrée</Button>
          <Button variant="whatsapp">WhatsApp</Button>
          <Button variant="outline">Reçu</Button>
        </div>
        <Button variant="dashed" block>
          + Ajouter une tenue
        </Button>
      </Section>

      <Section title="Champs">
        <div className="grid gap-1.5">
          <Label htmlFor="demo-nom">Nom du client</Label>
          <Input id="demo-nom" placeholder="Ex. Mariama Diallo" autoComplete="off" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="demo-prix">Prix (FCFA)</Label>
          <Input id="demo-prix" inputMode="numeric" placeholder="25 000" className="font-semibold tabular-nums" />
        </div>
      </Section>

      <Section title="Statuts des tenues">
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <span key={s.label} className={`rounded-full px-2.5 py-1 font-mono text-xs ${s.className}`}>
              {s.label}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Montants">
        <div className="flex items-baseline justify-between gap-3 rounded-xl border bg-card p-4">
          <span className="whitespace-nowrap">Reste à payer</span>
          <span className="font-display text-lg font-extrabold text-warning tabular-nums whitespace-nowrap">{formatFCFA(20000)}</span>
        </div>
      </Section>

      <Section title="Chargement">
        <div className="grid gap-2 rounded-xl border bg-card p-3">
          <div className="flex items-center gap-3">
            <Skeleton className="size-12" />
            <div className="grid flex-1 gap-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        </div>
      </Section>

      <Section title="Retours">
        <Button variant="outline" block onClick={() => toast("Commande C-0146 enregistrée")}>
          Afficher un Toast
        </Button>
        <ConfirmDialog
          trigger={
            <Button variant="outline" block>
              Supprimer un client (confirmation)
            </Button>
          }
          title="Supprimer Awa Diop ?"
          description="Ses mesures et son historique seront effacés. Les commandes passées restent visibles."
          confirmLabel="Supprimer"
          destructive
          onConfirm={async () => {
            await new Promise((resolve) => setTimeout(resolve, 600));
            toast("Client supprimé (démonstration)");
          }}
        />
      </Section>
    </div>
  );
}
