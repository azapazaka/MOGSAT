import { cn } from "@/lib/utils";

/**
 * The one ring in the design system: the large score display on the dashboard,
 * drawn with a 6px stroke. Everywhere else uses `ProgressBar` at 4px.
 */
export function ProgressRing({
  value,
  max,
  size = 176,
  label,
  caption,
  className,
}: {
  value: number;
  max: number;
  size?: number;
  label: React.ReactNode;
  caption?: React.ReactNode;
  className?: string;
}) {
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = max === 0 ? 0 : Math.min(1, Math.max(0, value / max));
  const dash = circumference * ratio;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} aria-hidden className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--line)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={stroke}
          strokeLinecap="butt"
          strokeDasharray={`${dash} ${circumference - dash}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-[34px] font-medium leading-none tabular-nums text-ink">{label}</span>
        {caption ? <span className="mt-2 text-meta text-ink-muted">{caption}</span> : null}
      </div>
    </div>
  );
}

/** Thin 4px bar used for every other progress indicator. */
export function ProgressBar({
  value,
  max = 1,
  className,
  tone = "accent",
  label,
}: {
  value: number;
  max?: number;
  className?: string;
  tone?: "accent" | "ink";
  label?: string;
}) {
  const ratio = max === 0 ? 0 : Math.min(1, Math.max(0, value / max));
  return (
    <div
      className={cn("h-1 w-full overflow-hidden rounded-[2px] bg-line", className)}
      role="progressbar"
      aria-valuenow={Math.round(ratio * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        className={cn("h-full", tone === "accent" ? "bg-accent" : "bg-ink")}
        style={{ width: `${ratio * 100}%` }}
      />
    </div>
  );
}
