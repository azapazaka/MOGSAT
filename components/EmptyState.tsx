import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The single empty state used by every list, table and chart in the app.
 * `action` is an already-rendered button or link so callers keep control of
 * whether it navigates or toggles something.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-card border border-dashed border-line px-6 py-12 text-center",
        className,
      )}
    >
      {Icon ? <Icon size={20} className="mb-3 text-ink-muted" aria-hidden /> : null}
      <p className="text-[14px] font-medium text-ink">{title}</p>
      {description ? (
        <p className="mt-1 max-w-[42ch] text-meta text-ink-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
