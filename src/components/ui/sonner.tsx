"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

/** Zone d'affichage des Toasts : à placer une seule fois, dans le layout racine. */
function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="top-center"
      offset={16}
      toastOptions={{
        classNames: {
          toast: "!bg-secondary !text-secondary-foreground !border-0 !rounded-lg !font-sans !text-[15px]",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
export { toast } from "sonner";
