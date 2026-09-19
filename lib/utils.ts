import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge has to be told about the design system's custom font sizes.
 * Without this it reads `text-badge` as a text *colour* and, on meeting
 * `text-ink-muted` later in the same class string, discards the size.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["badge", "label", "meta", "body", "passage", "timer"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 65 -> "65%" with no decimals. Accepts a 0..1 ratio. */
export function formatPercent(ratio: number, digits = 0) {
  return `${(ratio * 100).toFixed(digits)}%`;
}

/** 95 -> "1:35". Used for timers and time-per-question readouts. */
export function formatDuration(totalSeconds: number) {
  const safe = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/** 3725 -> "1:02:05" for long sessions, "2:05" for short ones. */
export function formatClock(totalSeconds: number) {
  const safe = Math.max(0, Math.round(totalSeconds));
  const hours = Math.floor(safe / 3600);
  if (hours === 0) return formatDuration(safe);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

/** ISO string -> "12 Mar 2026". Fixed locale so server and client agree. */
export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

/** "4 days ago" style, computed against a caller-supplied "now" so that
 *  server and client renders stay in agreement. */
export function formatRelative(iso: string, now: number) {
  const diffMs = now - new Date(iso).getTime();
  const days = Math.floor(diffMs / 86_400_000);
  if (days <= 0) {
    const hours = Math.floor(diffMs / 3_600_000);
    if (hours <= 0) return "just now";
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  }
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
}

export function signed(value: number) {
  return value > 0 ? `+${value}` : `${value}`;
}
