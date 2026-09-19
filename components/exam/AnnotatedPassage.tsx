"use client";

import { useRef, useState } from "react";
import { Highlighter, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Highlighting for Reading and Writing passages.
 *
 * Selecting text reveals a control that stores the selected string; stored
 * strings are then marked wherever they appear in the passage. Ranges are kept
 * as text rather than DOM offsets so they survive re-renders and the split view
 * collapsing on smaller screens.
 */
export function AnnotatedPassage({
  text,
  highlights,
  onAdd,
  onClear,
}: {
  text: string;
  highlights: string[];
  onAdd: (snippet: string) => void;
  onClear: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pending, setPending] = useState<string | null>(null);

  const handleSelection = () => {
    const selection = window.getSelection();
    const value = selection?.toString().trim() ?? "";
    // Ignore stray clicks and selections that run outside this passage.
    if (value.length < 3 || !selection?.anchorNode) {
      setPending(null);
      return;
    }
    if (!containerRef.current?.contains(selection.anchorNode)) {
      setPending(null);
      return;
    }
    setPending(value);
  };

  const commit = () => {
    if (pending) onAdd(pending);
    setPending(null);
    window.getSelection()?.removeAllRanges();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={commit}
          disabled={!pending}
          className={cn(
            "inline-flex items-center gap-2 rounded-input border px-3 py-1.5 text-meta transition-ui",
            pending
              ? "border-flagged text-ink hover:bg-flagged/10"
              : "border-line text-ink-muted opacity-60",
          )}
        >
          <Highlighter size={16} aria-hidden />
          Highlight selection
        </button>

        {highlights.length > 0 ? (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-2 rounded-input border border-line px-3 py-1.5 text-meta text-ink-muted transition-ui hover:border-ink-muted hover:text-ink"
          >
            <Trash2 size={16} aria-hidden />
            Clear {highlights.length}
          </button>
        ) : null}
      </div>

      <div
        ref={containerRef}
        onMouseUp={handleSelection}
        onKeyUp={handleSelection}
        className="passage space-y-4 text-ink"
      >
        {text.split("\n\n").map((paragraph, index) => (
          <p key={index} className="whitespace-pre-line">
            {renderWithHighlights(paragraph, highlights)}
          </p>
        ))}
      </div>
    </div>
  );
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Splits a paragraph around every stored snippet and wraps the matches. */
function renderWithHighlights(paragraph: string, highlights: string[]) {
  if (highlights.length === 0) return paragraph;

  const pattern = new RegExp(`(${highlights.map(escapeRegExp).join("|")})`, "g");
  const parts = paragraph.split(pattern);

  return parts.map((part, index) =>
    highlights.includes(part) ? (
      <mark
        key={index}
        className="rounded-[2px] bg-flagged/30 px-0.5 text-ink"
      >
        {part}
      </mark>
    ) : (
      part
    ),
  );
}
