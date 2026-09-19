"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export function Switch({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "relative h-5 w-9 shrink-0 rounded-input border border-line bg-paper transition-ui",
        "data-[state=checked]:border-accent data-[state=checked]:bg-accent",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="block h-3 w-3 translate-x-1 rounded-[2px] bg-ink-muted transition-ui data-[state=checked]:translate-x-5 data-[state=checked]:bg-on-accent" />
    </SwitchPrimitive.Root>
  );
}
