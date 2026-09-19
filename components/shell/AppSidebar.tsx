"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/providers/role-provider";
import { navForRole } from "./nav-items";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { role } = useRole();
  const items = navForRole(role);

  return (
    <nav aria-label="Main" className="space-y-1">
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-input px-3 py-2 text-[14px] transition-ui",
              active
                ? "bg-accent-soft font-medium text-accent"
                : "text-ink-muted hover:bg-accent-soft/50 hover:text-ink",
            )}
          >
            <item.icon size={16} aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** Persistent 240px left sidebar. Hidden below lg, where the top bar opens it. */
export function AppSidebar() {
  const { role } = useRole();

  return (
    <aside className="hidden w-[240px] shrink-0 flex-col border-r border-line bg-surface lg:flex">
      <div className="flex h-[56px] items-center border-b border-line px-6">
        <Link href={role === "admin" ? "/admin" : "/dashboard"} className="text-[15px] font-semibold text-ink">
          MOGSAT
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <SidebarNav />
      </div>
      <div className="border-t border-line p-4">
        <p className="text-badge uppercase tracking-[0.04em] text-ink-muted">
          {role === "admin" ? "Tutor view" : "Student view"}
        </p>
      </div>
    </aside>
  );
}
