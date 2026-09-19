/**
 * Score estimation.
 *
 * Each SAT section is reported on a 200–800 scale, so a section's accuracy maps
 * onto that band and the two sections sum to the 400–1600 composite. This is a
 * deliberately simple linear model: the real exam scales adaptively against
 * item difficulty, which Stage 2 can implement here without touching any caller.
 */

const SECTION_MIN = 200;
const SECTION_MAX = 800;

export function estimateSectionScore(accuracy: number): number {
  const clamped = Math.min(1, Math.max(0, accuracy));
  const raw = SECTION_MIN + (SECTION_MAX - SECTION_MIN) * clamped;
  return Math.min(SECTION_MAX, Math.max(SECTION_MIN, Math.round(raw / 10) * 10));
}

export function estimateTotalScore(mathAccuracy: number, rwAccuracy: number): number {
  return estimateSectionScore(mathAccuracy) + estimateSectionScore(rwAccuracy);
}
