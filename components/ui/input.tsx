import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, type = "text", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={cn(
        "h-9 w-full rounded-input border border-line bg-surface px-3 text-[14px] text-ink transition-ui",
        "placeholder:text-ink-muted hover:border-ink-muted disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-input border border-line bg-surface p-3 text-[14px] text-ink transition-ui",
        "placeholder:text-ink-muted hover:border-ink-muted disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("block text-label font-medium uppercase tracking-[0.04em] text-ink-muted", className)}
      {...props}
    />
  );
}

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-9 w-full rounded-input border border-line bg-surface px-3 text-[14px] text-ink transition-ui hover:border-ink-muted",
        className,
      )}
      {...props}
    />
  );
}

export function FieldError({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return (
    <p role="alert" className="text-meta text-incorrect">
      {children}
    </p>
  );
}
