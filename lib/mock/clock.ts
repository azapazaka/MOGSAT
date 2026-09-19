/**
 * Mock data is anchored to a fixed "today" rather than the real clock.
 *
 * Two reasons: a server render and a client render must agree (a live
 * `Date.now()` on each side produces hydration mismatches in relative
 * timestamps), and a fixed anchor keeps screenshots and reviews reproducible.
 * Stage 2 drops this module and uses real timestamps from the database.
 */
export const MOCK_TODAY = "2026-09-19T09:00:00.000Z";

export const MOCK_NOW = Date.parse(MOCK_TODAY);

const DAY_MS = 86_400_000;

export function daysBefore(days: number, hour = 9): string {
  const date = new Date(MOCK_NOW - days * DAY_MS);
  date.setUTCHours(hour, 0, 0, 0);
  return date.toISOString();
}

export function daysAfter(days: number, hour = 9): string {
  return daysBefore(-days, hour);
}

export function hoursBefore(hours: number): string {
  return new Date(MOCK_NOW - hours * 3_600_000).toISOString();
}

/** Whole days between an ISO date and the mock today, rounded up. */
export function daysFromToday(iso: string): number {
  return Math.ceil((Date.parse(iso) - MOCK_NOW) / DAY_MS);
}

/**
 * mulberry32 — a small deterministic PRNG. Every "random-looking" value in the
 * mock data comes from a seeded stream so that the same figures appear on the
 * server, on the client, and in every rebuild.
 */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Turns a string id into a stable numeric seed. */
export function seedFrom(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
