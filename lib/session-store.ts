"use client";

/**
 * The in-progress attempt, held in sessionStorage.
 *
 * This is the only client-side persistence in Stage 1. It exists so that
 * finishing a test and opening its review shows the answers you actually gave
 * rather than the canned mock attempt. Stage 2 writes attempts to Postgres as
 * they happen and this module is deleted.
 */

export interface StoredAttempt {
  sessionId: string;
  answers: Record<string, string>;
  flags: Record<string, boolean>;
  timeSpent: Record<string, number>;
  completedAt: string;
}

const KEY_PREFIX = "mogsat.attempt.";

export function saveAttempt(attempt: StoredAttempt): void {
  try {
    window.sessionStorage.setItem(`${KEY_PREFIX}${attempt.sessionId}`, JSON.stringify(attempt));
  } catch {
    // Storage can be unavailable or full; the review simply falls back to the
    // mock attempt, which is a degraded but working experience.
  }
}

export function loadAttempt(sessionId: string): StoredAttempt | null {
  try {
    const raw = window.sessionStorage.getItem(`${KEY_PREFIX}${sessionId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredAttempt;
    return parsed?.sessionId === sessionId ? parsed : null;
  } catch {
    return null;
  }
}

export function clearAttempt(sessionId: string): void {
  try {
    window.sessionStorage.removeItem(`${KEY_PREFIX}${sessionId}`);
  } catch {
    // Nothing to do.
  }
}
