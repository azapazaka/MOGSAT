"use client";

import { useCallback, useRef } from "react";
import { Undo2 } from "lucide-react";
import type { Choice } from "@/lib/types";
import { MathExpression } from "@/components/MathExpression";
import { cn } from "@/lib/utils";

export type ChoiceTone = "default" | "correct" | "incorrect";

/**
 * Answer choices as a keyboard-navigable radio group.
 *
 * Arrow keys move between options with a roving tabindex, Space and Enter
 * select, and crossing out is a separate control so it never steals selection.
 */
export function ChoiceList({
  choices,
  value,
  onChange,
  crossedOut = [],
  onToggleCrossOut,
  disabled = false,
  toneFor,
  name,
}: {
  choices: Choice[];
  value: string | null;
  onChange: (choiceId: string) => void;
  crossedOut?: string[];
  onToggleCrossOut?: (choiceId: string) => void;
  disabled?: boolean;
  /** Review mode marks the correct and chosen answers. */
  toneFor?: (choiceId: string) => ChoiceTone;
  name: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const focusAt = useCallback(
    (index: number) => {
      const bounded = (index + choices.length) % choices.length;
      refs.current[bounded]?.focus();
    },
    [choices.length],
  );

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      focusAt(index + 1);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      focusAt(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusAt(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusAt(choices.length - 1);
    }
  };

  const selectedIndex = choices.findIndex((choice) => choice.id === value);

  return (
    <div role="radiogroup" aria-label="Answer choices" className="space-y-3">
      {choices.map((choice, index) => {
        const selected = choice.id === value;
        const struck = crossedOut.includes(choice.id);
        const tone = toneFor?.(choice.id) ?? "default";

        return (
          <div key={choice.id} className="flex items-start gap-2">
            <button
              type="button"
              role="radio"
              aria-checked={selected}
              aria-describedby={struck ? `${name}-${choice.id}-struck` : undefined}
              disabled={disabled}
              // Roving tabindex: only one choice is in the tab order.
              tabIndex={selected || (selectedIndex === -1 && index === 0) ? 0 : -1}
              ref={(node) => {
                refs.current[index] = node;
              }}
              onKeyDown={(event) => handleKeyDown(event, index)}
              onClick={() => onChange(choice.id)}
              className={cn(
                "flex w-full items-start gap-3 rounded-input border p-3 text-left transition-ui",
                "disabled:cursor-default",
                tone === "default" && selected && "border-accent bg-accent-soft",
                tone === "default" && !selected && "border-line bg-surface hover:border-ink-muted",
                tone === "correct" && "border-correct bg-accent-soft",
                tone === "incorrect" && "border-incorrect",
                struck && "opacity-40",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-input border text-[13px] font-medium",
                  selected || tone === "correct" ? "border-accent text-ink" : "border-line text-ink-muted",
                  tone === "incorrect" && "border-incorrect text-incorrect",
                )}
              >
                {choice.label}
              </span>
              <span className="min-w-0 flex-1">
                <span className="sr-only">{choice.label}. </span>
                {choice.expression ? (
                  <MathExpression expression={choice.expression} block={false} />
                ) : (
                  <span
                    className={cn(
                      "text-body text-ink",
                      struck && "line-through decoration-ink-muted",
                    )}
                  >
                    {choice.text}
                  </span>
                )}
                {struck ? (
                  <span id={`${name}-${choice.id}-struck`} className="sr-only">
                    crossed out
                  </span>
                ) : null}
              </span>
            </button>

            {onToggleCrossOut ? (
              <button
                type="button"
                onClick={() => onToggleCrossOut(choice.id)}
                disabled={disabled}
                aria-label={
                  struck
                    ? `Restore answer choice ${choice.label}`
                    : `Cross out answer choice ${choice.label}`
                }
                className={cn(
                  // A compact secondary control, so it never competes with the
                  // answer rows for attention.
                  "mt-2 flex h-8 w-8 shrink-0 self-start items-center justify-center rounded-input border border-line text-ink-muted transition-ui",
                  "hover:border-ink-muted hover:text-ink disabled:opacity-40",
                )}
              >
                {struck ? (
                  <Undo2 size={16} />
                ) : (
                  <span aria-hidden className="text-[13px] font-medium line-through">
                    {choice.label}
                  </span>
                )}
              </button>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

/** Student-produced responses take a text entry instead of choices. */
export function ResponseInput({
  value,
  onChange,
  disabled,
  id = "spr-answer",
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  id?: string;
}) {
  return (
    <div className="max-w-[320px] space-y-2">
      <label htmlFor={id} className="block text-label font-medium uppercase tracking-[0.04em] text-ink-muted">
        Your answer
      </label>
      <input
        id={id}
        type="text"
        inputMode="text"
        autoComplete="off"
        disabled={disabled}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-input border border-line bg-surface px-3 font-serif text-[19px] text-ink transition-ui hover:border-ink-muted focus:border-accent disabled:opacity-50"
      />
      <p className="text-meta text-ink-muted">
        Enter a number. Fractions and decimals are both accepted.
      </p>
    </div>
  );
}
