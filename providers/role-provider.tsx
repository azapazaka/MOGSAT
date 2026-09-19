"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import type { Role } from "@/lib/types";

/**
 * Stage 1 has no auth, so the current role is a dev-only toggle rather than a
 * property of a session. Stage 2 deletes this file and reads the role from the
 * Supabase session user.
 *
 * The role is held in a tiny external store rather than component state so that
 * `useSyncExternalStore` can serve "student" during server rendering and the
 * stored value immediately afterwards, without a hydration mismatch and without
 * a cascading re-render from a setState inside an effect.
 */

const STORAGE_KEY = "mogsat.dev-role";

let cachedRole: Role | null = null;
const listeners = new Set<() => void>();

function readStoredRole(): Role {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "admin" || stored === "student") return stored;
  } catch {
    // Private browsing or blocked storage: fall through to the default.
  }
  return "student";
}

function getSnapshot(): Role {
  if (cachedRole === null) cachedRole = readStoredRole();
  return cachedRole;
}

/** The server always renders the student experience. */
function getServerSnapshot(): Role {
  return "student";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Keep other tabs in step with the switcher.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    cachedRole = null;
    listeners.forEach((notify) => notify());
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function writeRole(next: Role) {
  cachedRole = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // The role still applies for this page view.
  }
  listeners.forEach((notify) => notify());
}

interface RoleContextValue {
  role: Role;
  setRole: (role: Role) => void;
  /** False until hydration completes, for skipping first-paint flashes. */
  ready: boolean;
}

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const role = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const value = useMemo(() => ({ role, setRole: writeRole, ready }), [role, ready]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole(): RoleContextValue {
  const context = useContext(RoleContext);
  if (!context) throw new Error("useRole must be used inside a RoleProvider");
  return context;
}
