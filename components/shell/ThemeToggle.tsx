"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

/**
 * The icon is chosen by CSS from the theme class on <html>, and the label is
 * phrased so it reads correctly in either theme. That keeps the button free of
 * any state that differs between the server and the first client render.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle dark mode"
      className="flex h-9 w-9 items-center justify-center rounded-input border border-line text-ink-muted transition-ui hover:border-ink-muted hover:text-ink"
    >
      <Sun size={16} className="dark:hidden" aria-hidden />
      <Moon size={16} className="hidden dark:block" aria-hidden />
    </button>
  );
}
