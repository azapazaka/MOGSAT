import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-input border text-[14px] font-medium transition-ui disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap",
  {
    variants: {
      variant: {
        primary: "border-accent bg-accent text-on-accent hover:opacity-90",
        secondary: "border-line bg-transparent text-ink hover:border-ink-muted",
        ghost: "border-transparent bg-transparent text-ink-muted hover:text-ink hover:bg-accent-soft",
        destructive: "border-incorrect bg-transparent text-incorrect hover:bg-incorrect/10",
      },
      size: {
        sm: "h-8 px-3",
        md: "h-9 px-4",
        lg: "h-11 px-6 text-body",
        icon: "h-9 w-9 px-0",
      },
    },
    defaultVariants: { variant: "secondary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

/**
 * Every icon-only button must still carry an accessible name, so `size="icon"`
 * requires an `aria-label` from the caller.
 */
export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
