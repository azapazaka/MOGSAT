import type { Difficulty, Domain } from "@/lib/types";
import { DIFFICULTY_LABELS } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";

const badgeBase =
  "inline-flex items-center rounded-full border border-line px-2 py-0.5 text-badge font-medium uppercase tracking-[0.04em] text-ink-muted whitespace-nowrap";

/** 11px uppercase, 0.04em tracking, muted ink on a 1px line border, no fill. */
export function DomainBadge({ domain, className }: { domain: Domain; className?: string }) {
  return <span className={cn(badgeBase, className)}>{domain}</span>;
}

export function DifficultyBadge({
  difficulty,
  className,
}: {
  difficulty: Difficulty;
  className?: string;
}) {
  return <span className={cn(badgeBase, className)}>{DIFFICULTY_LABELS[difficulty]}</span>;
}

export function MetaBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn(badgeBase, className)}>{children}</span>;
}
