import type {
  Difficulty,
  Question,
  Section,
  SessionModule,
  SessionQuestionResult,
  TestSession,
} from "../types";
import { domainSection } from "../taxonomy";
import { daysBefore, seedFrom, seededRandom } from "./clock";
import { MOCK_QUESTIONS } from "./questions";
import { MOCK_STUDENTS } from "./students";

/**
 * Practice tests here run at DEMO LENGTH: four modules (Reading and Writing
 * Module 1 and 2, then Math Module 1 and 2) of 8 questions each, with the real
 * per-module timers scaled down in proportion. Every module boundary and
 * between-module transition behaves exactly as a full-length test would; only
 * the question count is reduced, so the 48-question seed bank covers a whole
 * run with no repeats. Stage 2 swaps in the real 27/27/22/22 structure.
 */
export const MODULE_QUESTION_COUNT = 8;

/** 32 min over 27 RW questions and 35 min over 22 Math questions, scaled to 8. */
export const RW_MODULE_SECONDS = 600;
export const MATH_MODULE_SECONDS = 780;

/** How much easier or harder than a student's baseline each tier plays. */
const DIFFICULTY_OFFSET: Record<Difficulty, number> = {
  easy: 0.14,
  medium: 0,
  hard: -0.16,
};

function shuffle<T>(items: T[], rng: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function roundToTen(value: number) {
  return Math.round(value / 10) * 10;
}

/**
 * Draws `count` distinct questions, widening the pool when a narrow filter
 * cannot fill the request. With only 48 seed questions a 20-question drill on a
 * single skill has to widen to the skill's domain and then to its section;
 * Stage 2's larger bank will rarely need to.
 */
function drawQuestions(
  pools: Question[][],
  count: number,
  rng: () => number,
  exclude: Set<string> = new Set(),
): string[] {
  const picked: string[] = [];
  const used = new Set(exclude);
  for (const pool of pools) {
    for (const question of shuffle(pool, rng)) {
      if (picked.length >= count) return picked;
      if (used.has(question.id)) continue;
      used.add(question.id);
      picked.push(question.id);
    }
  }
  return picked;
}

function questionById(id: string): Question | undefined {
  return MOCK_QUESTIONS.find((question) => question.id === id);
}

/** Produces a plausible attempt for one question at a given ability level. */
function buildResult(
  questionId: string,
  baseAccuracy: number,
  rng: () => number,
): SessionQuestionResult {
  const question = questionById(questionId);
  if (!question) {
    return { questionId, answer: null, correct: false, flagged: false, timeSpentSeconds: 0 };
  }

  const chance = clamp(baseAccuracy + DIFFICULTY_OFFSET[question.difficulty], 0.08, 0.96);
  const correct = rng() < chance;
  const skipped = !correct && rng() < 0.12;

  let answer: string | null;
  if (skipped) {
    answer = null;
  } else if (correct) {
    answer = question.correctAnswer;
  } else if (question.type === "student_produced_response") {
    answer = question.correctAnswer === "6" ? "8" : "0";
  } else {
    const wrong = question.choices.filter((choice) => choice.id !== question.correctAnswer);
    answer = wrong[Math.floor(rng() * wrong.length)]?.id ?? null;
  }

  return {
    questionId,
    answer,
    correct,
    flagged: rng() < 0.12,
    timeSpentSeconds: Math.round(question.estimatedTimeSeconds * (0.7 + rng() * 0.9)),
  };
}

function sectionScore(studentId: string, sectionAccuracy: number) {
  const student = MOCK_STUDENTS.find((candidate) => candidate.id === studentId);
  if (!student) return 500;
  const baseline = student.currentScore / 2;
  const delta = (sectionAccuracy - student.accuracy) * 350;
  return clamp(roundToTen(baseline + delta), 200, 800);
}

function accuracyFor(results: SessionQuestionResult[], section?: Section) {
  const scoped = section
    ? results.filter((result) => questionById(result.questionId)?.section === section)
    : results;
  if (scoped.length === 0) return 0;
  return scoped.filter((result) => result.correct).length / scoped.length;
}

interface PracticeTestConfig {
  id: string;
  studentId: string;
  title: string;
  startedDaysAgo: number;
  completed: boolean;
}

function buildPracticeTest(config: PracticeTestConfig): TestSession {
  const rng = seededRandom(seedFrom(config.id));
  const student = MOCK_STUDENTS.find((candidate) => candidate.id === config.studentId);
  const baseAccuracy = student?.accuracy ?? 0.65;

  const rwPool = MOCK_QUESTIONS.filter((question) => question.section === "rw");
  const mathPool = MOCK_QUESTIONS.filter((question) => question.section === "math");
  const used = new Set<string>();

  const modules: SessionModule[] = [
    { id: `${config.id}-rw-1`, label: "Module 1", section: "rw", order: 1, seconds: RW_MODULE_SECONDS, pool: rwPool },
    { id: `${config.id}-rw-2`, label: "Module 2", section: "rw", order: 2, seconds: RW_MODULE_SECONDS, pool: rwPool },
    { id: `${config.id}-math-1`, label: "Module 1", section: "math", order: 1, seconds: MATH_MODULE_SECONDS, pool: mathPool },
    { id: `${config.id}-math-2`, label: "Module 2", section: "math", order: 2, seconds: MATH_MODULE_SECONDS, pool: mathPool },
  ].map((spec) => {
    const questionIds = drawQuestions([spec.pool], MODULE_QUESTION_COUNT, rng, used);
    questionIds.forEach((id) => used.add(id));
    return {
      id: spec.id,
      label: spec.label,
      section: spec.section as Section,
      order: spec.order as 1 | 2,
      questionIds,
      durationSeconds: spec.seconds,
    };
  });

  const orderedIds = modules.flatMap((module) => module.questionIds);
  const results = config.completed
    ? orderedIds.map((questionId) => buildResult(questionId, baseAccuracy, rng))
    : [];

  const session: TestSession = {
    id: config.id,
    studentId: config.studentId,
    kind: "practice_test",
    title: config.title,
    timed: true,
    startedAt: daysBefore(config.startedDaysAgo),
    modules,
    results,
  };

  if (config.completed) {
    session.completedAt = daysBefore(config.startedDaysAgo, 11);
    session.scoreMath = sectionScore(config.studentId, accuracyFor(results, "math"));
    session.scoreRw = sectionScore(config.studentId, accuracyFor(results, "rw"));
    session.scoreTotal = session.scoreMath + session.scoreRw;
  }

  return session;
}

interface DrillConfig {
  id: string;
  studentId: string;
  skill: string;
  count: number;
  timed: boolean;
  startedDaysAgo: number;
  completed: boolean;
}

function buildDrill(config: DrillConfig): TestSession {
  const rng = seededRandom(seedFrom(config.id));
  const student = MOCK_STUDENTS.find((candidate) => candidate.id === config.studentId);
  const baseAccuracy = student?.accuracy ?? 0.65;

  const skillPool = MOCK_QUESTIONS.filter((question) => question.skill === config.skill);
  const domain = skillPool[0]?.domain;
  const section = domain ? domainSection(domain) : "math";
  const domainPool = MOCK_QUESTIONS.filter((question) => question.domain === domain);
  const sectionPool = MOCK_QUESTIONS.filter((question) => question.section === section);

  const questionIds = drawQuestions([skillPool, domainPool, sectionPool], config.count, rng);
  const results = config.completed
    ? questionIds.map((questionId) => buildResult(questionId, baseAccuracy, rng))
    : [];

  const session: TestSession = {
    id: config.id,
    studentId: config.studentId,
    kind: "drill",
    title: `${config.skill} drill`,
    timed: config.timed,
    startedAt: daysBefore(config.startedDaysAgo),
    modules: [
      {
        id: `${config.id}-m1`,
        label: "Drill",
        section,
        order: 1,
        questionIds,
        durationSeconds: config.timed ? questionIds.length * 75 : 0,
      },
    ],
    results,
  };

  if (config.completed) {
    session.completedAt = daysBefore(config.startedDaysAgo, 10);
  }

  return session;
}

/**
 * Fifteen sessions: thirteen completed (weighted towards the demo student so the
 * student-facing screens have history) and two not yet started, which is what
 * the practice hub launches into.
 */
export const MOCK_SESSIONS: TestSession[] = [
  buildPracticeTest({ id: "ts-01", studentId: "s-01", title: "Full-length practice test 3", startedDaysAgo: 5, completed: true }),
  buildPracticeTest({ id: "ts-02", studentId: "s-01", title: "Full-length practice test 2", startedDaysAgo: 26, completed: true }),
  buildPracticeTest({ id: "ts-03", studentId: "s-01", title: "Full-length practice test 1", startedDaysAgo: 54, completed: true }),
  buildDrill({ id: "ts-04", studentId: "s-01", skill: "Circles", count: 10, timed: false, startedDaysAgo: 1, completed: true }),
  buildDrill({ id: "ts-05", studentId: "s-01", skill: "Transitions", count: 20, timed: true, startedDaysAgo: 3, completed: true }),
  buildDrill({ id: "ts-06", studentId: "s-01", skill: "Nonlinear functions", count: 10, timed: true, startedDaysAgo: 9, completed: true }),
  buildDrill({ id: "ts-07", studentId: "s-01", skill: "Command of evidence: quantitative", count: 10, timed: false, startedDaysAgo: 17, completed: true }),
  buildPracticeTest({ id: "ts-08", studentId: "s-03", title: "Full-length practice test 4", startedDaysAgo: 2, completed: true }),
  buildPracticeTest({ id: "ts-09", studentId: "s-05", title: "Full-length practice test 2", startedDaysAgo: 8, completed: true }),
  buildDrill({ id: "ts-10", studentId: "s-02", skill: "Boundaries", count: 20, timed: true, startedDaysAgo: 2, completed: true }),
  buildDrill({ id: "ts-11", studentId: "s-04", skill: "Percentages", count: 10, timed: false, startedDaysAgo: 11, completed: true }),
  buildDrill({ id: "ts-12", studentId: "s-07", skill: "Right triangles and trigonometry", count: 10, timed: true, startedDaysAgo: 1, completed: true }),
  buildDrill({ id: "ts-13", studentId: "s-06", skill: "Words in context", count: 20, timed: false, startedDaysAgo: 4, completed: true }),
  buildPracticeTest({ id: "ts-14", studentId: "s-01", title: "Full-length practice test 4", startedDaysAgo: 0, completed: false }),
  buildDrill({ id: "ts-15", studentId: "s-01", skill: "Systems of two linear equations", count: 10, timed: true, startedDaysAgo: 0, completed: false }),
];

/** The not-yet-started sessions the practice hub launches. */
export const STARTABLE_TEST_ID = "ts-14";
export const STARTABLE_DRILL_ID = "ts-15";
