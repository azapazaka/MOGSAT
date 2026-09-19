"use client";

import { useSyncExternalStore } from "react";

/** Never fires: the value is constant once the client has taken over. */
function subscribe() {
  return () => {};
}

/**
 * False during server rendering and the hydration pass, true afterwards.
 *
 * Used by the few components whose output legitimately depends on something
 * only the browser knows (the resolved theme, sessionStorage, localStorage).
 * `useSyncExternalStore` is the supported way to express that, and unlike a
 * `setState` in an effect it does not schedule a cascading re-render.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
