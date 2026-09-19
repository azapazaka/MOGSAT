"use client";

import { cn } from "@/lib/utils";

/**
 * Shared chart chrome.
 *
 * Every chart in the app is single-series, so none carries a legend: the card
 * title names the series. Data is the accent colour, the grid is --line, axis
 * labels are 11px --ink-muted, and there are no chart borders or fills.
 */

export const AXIS_TICK = { fontSize: 11, fill: "var(--ink-muted)" } as const;

export const GRID_PROPS = {
  stroke: "var(--line)",
  strokeDasharray: "0",
  vertical: false,
} as const;

/** Tooltips use surface + line + the panel shadow, and text keeps ink tokens. */
export function ChartTooltip({
  label,
  rows,
}: {
  label?: React.ReactNode;
  rows: { label: string; value: React.ReactNode }[];
}) {
  return (
    <div className="rounded-input border border-line bg-surface px-3 py-2 shadow-panel">
      {label ? <p className="mb-1 text-label uppercase tracking-[0.04em] text-ink-muted">{label}</p> : null}
      {rows.map((row) => (
        <p key={row.label} className="text-meta text-ink">
          <span className="text-ink-muted">{row.label}: </span>
          <span className="tabular-nums">{row.value}</span>
        </p>
      ))}
    </div>
  );
}

export function ChartFrame({
  height = 260,
  children,
  className,
}: {
  height?: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      {children}
    </div>
  );
}
