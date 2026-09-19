import type { Section } from "./types";

/**
 * The shape of a full-length practice test as the UI advertises it.
 *
 * Stage 1 runs at demo length (8 questions per module with proportionally
 * scaled timers) so the 48-question seed bank covers a whole test without
 * repeats; the module structure itself matches the real exam.
 */
export const PRACTICE_TEST_SHAPE: {
  section: Section;
  order: 1 | 2;
  questions: number;
  minutes: number;
}[] = [
  { section: "rw", order: 1, questions: 8, minutes: 10 },
  { section: "rw", order: 2, questions: 8, minutes: 10 },
  { section: "math", order: 1, questions: 8, minutes: 13 },
  { section: "math", order: 2, questions: 8, minutes: 13 },
];

export const MODULE_LABELS: Record<Section, string> = {
  rw: "Reading and Writing",
  math: "Math",
};
