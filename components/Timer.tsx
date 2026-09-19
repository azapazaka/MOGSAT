"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import { cn } from "@/lib/utils";

/**
 * Countdown for the test screen: 20px tabular numerals with a hide toggle that
 * collapses the readout to an eye icon. Hiding stops the display, not the clock.
 */
export function Timer({
  secondsRemaining,
  hidden,
  onToggleHidden,
  className,
}: {
  secondsRemaining: number;
  hidden: boolean;
  onToggleHidden: () => void;
  className?: string;
}) {
  const isLow = secondsRemaining <= 300;
  // The live region announces when its text changes, so deriving the message
  // is enough: it speaks once, as the clock crosses five minutes.
  const announce = isLow ? "Five minutes remaining." : "";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {hidden ? (
        <span className="text-meta text-ink-muted">Timer hidden</span>
      ) : (
        <span
          className={cn(
            "text-timer font-medium tabular-nums",
            isLow ? "text-incorrect" : "text-ink",
          )}
        >
          {formatDuration(secondsRemaining)}
        </span>
      )}
      <button
        type="button"
        onClick={onToggleHidden}
        aria-label={hidden ? "Show the timer" : "Hide the timer"}
        aria-pressed={hidden}
        className="rounded-input border border-transparent p-1 text-ink-muted transition-ui hover:border-line hover:text-ink"
      >
        {hidden ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {announce}
      </span>
    </div>
  );
}

/** Drives a countdown without re-rendering the whole test screen every tick. */
export function useCountdown(totalSeconds: number, running: boolean) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const [previousTotal, setPreviousTotal] = useState(totalSeconds);

  // Starting a new module hands the hook a different duration. Adjusting state
  // during render is React's documented way to reset on a changed prop; doing
  // it in an effect would render the old module's time for one frame first.
  if (previousTotal !== totalSeconds) {
    setPreviousTotal(totalSeconds);
    setRemaining(totalSeconds);
  }

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setRemaining((current) => (current <= 0 ? 0 : current - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  return remaining;
}
