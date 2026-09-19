"use client";

import { cn } from "@/lib/utils";

export interface NavigatorItem {
  index: number;
  questionId: string;
  answered: boolean;
  flagged: boolean;
}

/**
 * Grid of numbered squares: unanswered outlined, answered filled with --ink,
 * flagged carrying a small triangle in --flagged in the corner.
 *
 * Exposed as a grid so screen readers announce position and state together.
 */
export function QuestionNavigator({
  items,
  current,
  onSelect,
  columns = 8,
}: {
  items: NavigatorItem[];
  current: number;
  onSelect: (index: number) => void;
  columns?: number;
}) {
  return (
    <div>
      <div
        role="grid"
        aria-label="Question navigator"
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {items.map((item) => {
          const isCurrent = item.index === current;
          const state = item.answered ? "answered" : "unanswered";
          return (
            <button
              key={item.questionId}
              type="button"
              role="gridcell"
              aria-current={isCurrent ? "true" : undefined}
              aria-label={`Question ${item.index + 1}, ${state}${item.flagged ? ", marked for review" : ""}`}
              onClick={() => onSelect(item.index)}
              className={cn(
                "relative flex h-9 w-9 items-center justify-center rounded-input border text-[13px] tabular-nums transition-ui",
                item.answered
                  ? "border-ink bg-ink text-paper"
                  : "border-line bg-surface text-ink hover:border-ink-muted",
                isCurrent && "ring-2 ring-accent ring-offset-2 ring-offset-surface",
              )}
            >
              {item.index + 1}
              {item.flagged ? (
                <span
                  aria-hidden
                  className="absolute right-0 top-0 h-0 w-0 border-l-[8px] border-t-[8px] border-l-transparent"
                  style={{ borderTopColor: "var(--flagged)" }}
                />
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-line pt-3 text-meta text-ink-muted">
        <span className="flex items-center gap-2">
          <span aria-hidden className="h-3 w-3 rounded-[2px] border border-line bg-surface" />
          Unanswered
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden className="h-3 w-3 rounded-[2px] border border-ink bg-ink" />
          Answered
        </span>
        <span className="flex items-center gap-2">
          <span
            aria-hidden
            className="h-0 w-0 border-l-[8px] border-t-[8px] border-l-transparent"
            style={{ borderTopColor: "var(--flagged)" }}
          />
          Marked for review
        </span>
      </div>
    </div>
  );
}
