"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useRole } from "@/providers/role-provider";
import { RoleSwitcher } from "./RoleSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { SidebarNav } from "./AppSidebar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * Top bar with search, the dev role switcher and the theme toggle.
 *
 * The admin side is marked by a 1px --ink bottom border instead of --line, so
 * it is always obvious which side of the app you are on.
 */
export function TopBar() {
  const { role } = useRole();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const isAdmin = role === "admin";

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-30 flex h-[56px] shrink-0 items-center gap-4 border-b bg-surface px-4 lg:px-6",
          isAdmin ? "border-ink" : "border-line",
        )}
      >
        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open navigation menu"
          className="flex h-9 w-9 items-center justify-center rounded-input border border-line text-ink-muted transition-ui hover:text-ink lg:hidden"
        >
          <Menu size={16} />
        </button>

        <Link href={isAdmin ? "/admin" : "/dashboard"} className="text-[15px] font-semibold text-ink lg:hidden">
          MOGSAT
        </Link>

        <div className="relative hidden max-w-[360px] flex-1 md:block">
          <Search
            size={16}
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
          />
          <Input
            type="search"
            placeholder={isAdmin ? "Search students and questions" : "Search questions"}
            aria-label={isAdmin ? "Search students and questions" : "Search questions"}
            className="pl-9"
          />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <RoleSwitcher />
          <ThemeToggle />
        </div>
      </header>

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMobileNavOpen(false)}
            className="absolute inset-0 bg-ink/30"
          />
          <div className="absolute left-0 top-0 h-full w-[240px] border-r border-line bg-surface">
            <div className="flex h-[56px] items-center justify-between border-b border-line px-4">
              <span className="text-[15px] font-semibold text-ink">MOGSAT</span>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close navigation menu"
                className="flex h-9 w-9 items-center justify-center rounded-input border border-line text-ink-muted transition-ui hover:text-ink"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-4">
              <SidebarNav onNavigate={() => setMobileNavOpen(false)} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
