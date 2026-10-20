"use client";

import * as React from "react";
import { AlertDialog } from "radix-ui";
import { Button } from "@/components/ui/button";

type ConfirmDialogProps = {
  /** Élément qui ouvre la confirmation (souvent un Button). */
  trigger: React.ReactNode;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  /** Peut être asynchrone : le bouton reste désactivé pendant l'exécution. */
  onConfirm: () => void | Promise<void>;
};

/** Remplace window.confirm(), interdit dans le projet. */
export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel,
  cancelLabel = "Annuler",
  destructive = false,
  onConfirm,
}: ConfirmDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);

  async function handleConfirm(event: React.MouseEvent) {
    event.preventDefault();
    setPending(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setPending(false);
    }
  }

  return (
    <AlertDialog.Root open={open} onOpenChange={(next) => !pending && setOpen(next)}>
      <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-[#0a0e28]/50" />
        <AlertDialog.Content className="fixed inset-x-0 bottom-0 z-50 grid gap-3 rounded-t-2xl bg-card p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-xl sm:inset-auto sm:top-1/2 sm:left-1/2 sm:w-full sm:max-w-sm sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl">
          <AlertDialog.Title className="font-display text-xl font-bold">{title}</AlertDialog.Title>
          {description ? (
            <AlertDialog.Description className="text-muted-foreground">{description}</AlertDialog.Description>
          ) : (
            <AlertDialog.Description className="sr-only">{title}</AlertDialog.Description>
          )}
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <AlertDialog.Action asChild>
              <Button variant={destructive ? "destructive" : "default"} disabled={pending} onClick={handleConfirm}>
                {pending ? "Un instant…" : confirmLabel}
              </Button>
            </AlertDialog.Action>
            <AlertDialog.Cancel asChild>
              <Button variant="outline" disabled={pending} className="sm:order-first">
                {cancelLabel}
              </Button>
            </AlertDialog.Cancel>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
