import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-4", className)}>
      <div>
        <h1 className="text-[24px] font-semibold leading-tight text-ink">{title}</h1>
        {description ? <p className="mt-1 max-w-[70ch] text-[14px] text-ink-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
    </div>
  );
}

/** Compact metric block used across the dashboard, progress and admin pages. */
export function StatTile({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  tone?: "default" | "positive" | "negative";
}) {
  return (
    <div className="rounded-card border border-line bg-surface p-6">
      <p className="text-label font-medium uppercase tracking-[0.04em] text-ink-muted">{label}</p>
      <p
        className={cn(
          "mt-2 text-[28px] font-medium leading-none tabular-nums",
          tone === "positive" && "text-correct",
          tone === "negative" && "text-incorrect",
          tone === "default" && "text-ink",
        )}
      >
        {value}
      </p>
      {hint ? <p className="mt-2 text-meta text-ink-muted">{hint}</p> : null}
    </div>
  );
}

export function SectionHeading({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="text-[15px] font-medium text-ink">{title}</h2>
      {action}
    </div>
  );
}
