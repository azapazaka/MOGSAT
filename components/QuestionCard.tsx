import Link from "next/link";
import { Bookmark, Check, Flag, X } from "lucide-react";
import type { QuestionWithState } from "@/lib/types";
import { DifficultyBadge, DomainBadge } from "@/components/DomainBadge";
import { cn } from "@/lib/utils";

const STATUS_META = {
  correct: { icon: Check, label: "Answered correctly", className: "text-correct" },
  incorrect: { icon: X, label: "Answered incorrectly", className: "text-incorrect" },
  unattempted: null,
} as const;

/** One row in the question bank list: stem preview, domain tag, difficulty. */
export function QuestionCard({ question }: { question: QuestionWithState }) {
  const status = STATUS_META[question.state.status];
  const preview = question.passage
    ? `${question.passage.replace(/\s+/g, " ").slice(0, 120)}…`
    : question.stem;

  return (
    <Link
      href={`/question-bank/${question.id}`}
      className="block rounded-card border border-line bg-surface p-4 transition-ui hover:border-ink-muted"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[14px] text-ink">{question.stem}</p>
          {question.passage ? (
            <p className="mt-1 truncate text-meta text-ink-muted">{preview}</p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {question.state.saved ? (
            <Bookmark size={16} className="text-ink-muted" aria-label="Saved" />
          ) : null}
          {question.state.flagged ? (
            <Flag size={16} className="text-flagged" aria-label="Flagged for review" />
          ) : null}
          {status ? (
            <status.icon size={16} className={status.className} aria-label={status.label} />
          ) : null}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <DomainBadge domain={question.domain} />
        <DifficultyBadge difficulty={question.difficulty} />
        <span className="text-meta text-ink-muted">{question.skill}</span>
      </div>
    </Link>
  );
}

export function QuestionRowSkeletonList({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn("rounded-card border border-line bg-surface p-4")}
          aria-hidden
        >
          <div className="h-3 w-3/4 animate-pulse rounded-input bg-line/70" />
          <div className="mt-3 h-3 w-1/3 animate-pulse rounded-input bg-line/70" />
        </div>
      ))}
    </div>
  );
}
