import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

// Hauteurs minimales de 44 px (zones tactiles) : voir docs/design-system.md.
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        success: "bg-success text-white hover:bg-success/90",
        whatsapp: "bg-whatsapp text-white hover:bg-whatsapp/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border bg-card hover:bg-muted",
        ghost: "hover:bg-muted",
        dashed: "border border-dashed text-primary hover:bg-primary-soft",
      },
      size: {
        default: "h-12 px-5 text-base",
        sm: "h-11 px-3.5 text-sm",
        lg: "h-14 px-6 text-base",
        icon: "size-11",
      },
      block: { true: "w-full" },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Button({
  className,
  variant,
  size,
  block,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, block, className }))} {...props} />;
}

export { Button, buttonVariants };
