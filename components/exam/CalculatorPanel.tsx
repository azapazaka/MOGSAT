"use client";

import { X } from "lucide-react";

/**
 * Calculator slot. Stage 1 reserves the panel and its layout; Stage 2 drops a
 * real graphing calculator in here without changing the test screen around it.
 */
export function CalculatorPanel({ onClose }: { onClose: () => void }) {
  return (
    <aside
      aria-label="Calculator"
      className="flex w-full shrink-0 flex-col rounded-card border border-line bg-surface lg:w-[340px]"
    >
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <h2 className="text-[14px] font-medium text-ink">Calculator</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close the calculator"
          className="rounded-input border border-transparent p-1 text-ink-muted transition-ui hover:border-line hover:text-ink"
        >
          <X size={16} />
        </button>
      </div>
      <div className="flex flex-1 items-center justify-center p-6">
        <p className="max-w-[28ch] text-center text-meta text-ink-muted">
          The graphing calculator arrives in Stage 2. This panel reserves its position and size.
        </p>
      </div>
    </aside>
  );
}
