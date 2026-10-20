import { cn } from "@/lib/utils";

/** Bloc de chargement à la forme du contenu attendu (règle : pas de liste sans skeleton). */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="skeleton" aria-hidden="true" className={cn("animate-pulse rounded-lg bg-muted", className)} {...props} />;
}

export { Skeleton };
