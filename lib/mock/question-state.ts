import type { QuestionState } from "../types";
import { seedFrom, seededRandom } from "./clock";
import { MOCK_QUESTIONS } from "./questions";
import { MOCK_SESSIONS } from "./sessions";

/**
 * What the demo student has done with each question in the bank: derived from
 * their completed sessions, plus a seeded set of flags and saves for the
 * questions they have not attempted. Stage 2 reads this from a
 * `question_attempts` table filtered by the signed-in student.
 */
export function buildQuestionStates(studentId: string): Map<string, QuestionState> {
  const states = new Map<string, QuestionState>();
  const rng = seededRandom(seedFrom(`${studentId}:states`));

  for (const question of MOCK_QUESTIONS) {
    states.set(question.id, {
      questionId: question.id,
      status: "unattempted",
      flagged: false,
      saved: false,
    });
  }

  const sessions = MOCK_SESSIONS.filter(
    (session) => session.studentId === studentId && session.completedAt,
  ).sort((a, b) => Date.parse(a.completedAt!) - Date.parse(b.completedAt!));

  // Later sessions overwrite earlier ones, so the state reflects the most
  // recent attempt at each question.
  for (const session of sessions) {
    for (const result of session.results) {
      const existing = states.get(result.questionId);
      if (!existing) continue;
      states.set(result.questionId, {
        questionId: result.questionId,
        status: result.correct ? "correct" : "incorrect",
        flagged: result.flagged || existing.flagged,
        saved: existing.saved,
        lastAttemptedAt: session.completedAt,
      });
    }
  }

  // A handful of unattempted questions are flagged or saved for later.
  for (const question of MOCK_QUESTIONS) {
    const state = states.get(question.id)!;
    if (state.status === "unattempted" && rng() < 0.16) state.flagged = true;
    if (rng() < 0.19) state.saved = true;
  }

  return states;
}
