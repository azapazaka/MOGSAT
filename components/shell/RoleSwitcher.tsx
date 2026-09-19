"use client";

import { useRouter } from "next/navigation";
import { useRole } from "@/providers/role-provider";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";

const OPTIONS: { value: Role; label: string }[] = [
  { value: "student", label: "Student" },
  { value: "admin", label: "Admin" },
];

/**
 * DEV ONLY. Stage 1 has no auth, so this previews both experiences. Stage 2
 * removes it entirely and the role comes from the Supabase session.
 */
export function RoleSwitcher() {
  const { role, setRole } = useRole();
  const router = useRouter();

  const handleChange = (next: Role) => {
    setRole(next);
    router.push(next === "admin" ? "/admin" : "/dashboard");
  };

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-badge uppercase tracking-[0.04em] text-ink-muted sm:inline">
        Dev role
      </span>
      <div
        role="group"
        aria-label="Preview role (development only)"
        className="flex rounded-input border border-line p-0.5"
      >
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={role === option.value}
            onClick={() => handleChange(option.value)}
            className={cn(
              "rounded-[2px] px-3 py-1 text-meta transition-ui",
              role === option.value
                ? "bg-ink text-paper"
                : "text-ink-muted hover:text-ink",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
