/**
 * THE DATA LAYER BOUNDARY.
 *
 * This is the only module components may import data from. Everything it
 * returns is a Promise, even though Stage 1 resolves synchronously from the
 * mock fixtures in `lib/mock/`, so that Stage 2 can replace each function body
 * with a Supabase query without touching a single component.
 *
 * Rules:
 *   - Components import from `@/lib/data`, never from `@/lib/mock/*`
 *     (enforced by a `no-restricted-imports` rule in eslint.config.mjs).
 *   - Every function is async and returns serializable data.
 *   - Filtering, sorting, pagination and aggregation happen here, because in
 *     Stage 2 they move into SQL.
 */

import type {
  Assignment,
  CohortAnalytics,
  CohortOverview,
  DashboardSummary,
  Domain,
  DomainAccuracy,
  Paginated,
  Question,
  QuestionDifficultyStat,
  QuestionFilters,
  QuestionWithState,
  RecommendedDrill,
  Role,
  SessionReview,
  Student,
  StudentAssignment,
  StudentNote,
  StudentProgress,
  TestSession,
  Tutor,
  UserProfile,
} from "./types";
import { ALL_DOMAINS, domainSection } from "./taxonomy";
import { MOCK_ASSIGNMENTS, MOCK_STUDENT_NOTES } from "./mock/assignments";
import { MOCK_NOW, daysFromToday, seedFrom, seededRandom } from "./mock/clock";
import { buildStudentProgress } from "./mock/progress";
import { buildQuestionStates } from "./mock/question-state";
import { MOCK_QUESTIONS } from "./mock/questions";
import {
  MOCK_SESSIONS,
  STARTABLE_DRILL_ID,
  STARTABLE_TEST_ID,
} from "./mock/sessions";
import { DEMO_STUDENT_ID, MOCK_STUDENTS, MOCK_TUTORS } from "./mock/students";
import { MOCK_ADMIN_USER, MOCK_STUDENT_USER } from "./mock/user";

const DEFAULT_PAGE_SIZE = 10;

/** The reference "now" the mock fixtures are anchored to. */
export async function getNow(): Promise<number> {
  return MOCK_NOW;
}

export async function getCurrentUser(role: Role = "student"): Promise<UserProfile> {
  return role === "admin" ? MOCK_ADMIN_USER : MOCK_STUDENT_USER;
}

export async function getTutors(): Promise<Tutor[]> {
  return MOCK_TUTORS;
}

/* -------------------------------------------------------------------------- */
/* Questions                                                                   */
/* -------------------------------------------------------------------------- */

function matchesFilters(question: QuestionWithState, filters: QuestionFilters): boolean {
  if (filters.section && filters.section !== "all" && question.section !== filters.section) {
    return false;
  }
  if (filters.domains?.length && !filters.domains.includes(question.domain)) return false;
  if (filters.skills?.length && !filters.skills.includes(question.skill)) return false;
  if (filters.difficulties?.length && !filters.difficulties.includes(question.difficulty)) {
    return false;
  }
  if (filters.savedOnly && !question.state.saved) return false;

  if (filters.statuses?.length) {
    const matches = filters.statuses.some((status) =>
      status === "flagged" ? question.state.flagged : question.state.status === status,
    );
    if (!matches) return false;
  }

  if (filters.search) {
    const needle = filters.search.toLowerCase();
    const haystack = [question.stem, question.passage ?? "", question.skill, question.domain]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(needle)) return false;
  }

  return true;
}

async function getQuestionsWithState(studentId = DEMO_STUDENT_ID): Promise<QuestionWithState[]> {
  const states = buildQuestionStates(studentId);
  return MOCK_QUESTIONS.map((question) => ({
    ...question,
    state: states.get(question.id)!,
  }));
}

export async function getQuestions(
  filters: QuestionFilters = {},
): Promise<Paginated<QuestionWithState>> {
  const all = await getQuestionsWithState();
  const matched = all.filter((question) => matchesFilters(question, filters));

  const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;
  const pageCount = Math.max(1, Math.ceil(matched.length / pageSize));
  const page = Math.min(Math.max(1, filters.page ?? 1), pageCount);
  const start = (page - 1) * pageSize;

  return {
    items: matched.slice(start, start + pageSize),
    total: matched.length,
    page,
    pageSize,
    pageCount,
  };
}

export async function getQuestion(id: string): Promise<QuestionWithState | null> {
  const all = await getQuestionsWithState();
  return all.find((question) => question.id === id) ?? null;
}

export async function getQuestionsByIds(ids: string[]): Promise<Question[]> {
  const byId = new Map(MOCK_QUESTIONS.map((question) => [question.id, question]));
  return ids.map((id) => byId.get(id)).filter((question): question is Question => Boolean(question));
}

/** The saved / flagged view of the bank. */
export async function getFlaggedQuestions(): Promise<QuestionWithState[]> {
  const all = await getQuestionsWithState();
  return all.filter((question) => question.state.flagged || question.state.saved);
}

export async function getAllQuestions(): Promise<Question[]> {
  return MOCK_QUESTIONS;
}

/* -------------------------------------------------------------------------- */
/* Students and progress                                                       */
/* -------------------------------------------------------------------------- */

export async function getStudents(): Promise<Student[]> {
  return MOCK_STUDENTS;
}

export async function getStudent(id: string): Promise<Student | null> {
  return MOCK_STUDENTS.find((student) => student.id === id) ?? null;
}

export async function getStudentProgress(
  studentId: string = DEMO_STUDENT_ID,
): Promise<StudentProgress> {
  return buildStudentProgress(studentId);
}

export async function getStudentNotes(studentId: string): Promise<StudentNote[]> {
  return MOCK_STUDENT_NOTES.filter((note) => note.studentId === studentId).sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  );
}

/* -------------------------------------------------------------------------- */
/* Sessions                                                                    */
/* -------------------------------------------------------------------------- */

export async function getSessions(studentId?: string): Promise<TestSession[]> {
  const sessions = studentId
    ? MOCK_SESSIONS.filter((session) => session.studentId === studentId)
    : MOCK_SESSIONS;
  return [...sessions].sort((a, b) => Date.parse(b.startedAt) - Date.parse(a.startedAt));
}

export async function getSession(id: string): Promise<TestSession | null> {
  return MOCK_SESSIONS.find((session) => session.id === id) ?? null;
}

/** A completed session joined with its questions, ready for `/review`. */
export async function getSessionReview(id: string): Promise<SessionReview | null> {
  const session = await getSession(id);
  if (!session) return null;

  const orderedIds = session.modules.flatMap((module) => module.questionIds);
  const questions = await getQuestionsByIds(orderedIds);
  const correctCount = session.results.filter((result) => result.correct).length;
  const totalQuestions = orderedIds.length;

  const byDomain = new Map<Domain, { attempted: number; correct: number }>();
  for (const result of session.results) {
    const question = questions.find((candidate) => candidate.id === result.questionId);
    if (!question) continue;
    const entry = byDomain.get(question.domain) ?? { attempted: 0, correct: 0 };
    entry.attempted += 1;
    if (result.correct) entry.correct += 1;
    byDomain.set(question.domain, entry);
  }

  const domainBreakdown: DomainAccuracy[] = [...byDomain.entries()]
    .map(([domain, entry]) => ({
      domain,
      section: domainSection(domain),
      attempted: entry.attempted,
      correct: entry.correct,
      accuracy: entry.attempted === 0 ? 0 : entry.correct / entry.attempted,
    }))
    .sort((a, b) => a.accuracy - b.accuracy);

  return {
    session,
    questions,
    totalQuestions,
    correctCount,
    accuracy: totalQuestions === 0 ? 0 : correctCount / totalQuestions,
    totalTimeSeconds: session.results.reduce((sum, result) => sum + result.timeSpentSeconds, 0),
    domainBreakdown,
  };
}

/** Ids the practice hub launches into. Stage 2 creates a session row instead. */
export async function getStartableSessionIds(): Promise<{ test: string; drill: string }> {
  return { test: STARTABLE_TEST_ID, drill: STARTABLE_DRILL_ID };
}

/* -------------------------------------------------------------------------- */
/* Assignments                                                                 */
/* -------------------------------------------------------------------------- */

export async function getAssignments(): Promise<Assignment[]> {
  return [...MOCK_ASSIGNMENTS].sort((a, b) => Date.parse(a.dueDate) - Date.parse(b.dueDate));
}

export async function getAssignment(id: string): Promise<Assignment | null> {
  return MOCK_ASSIGNMENTS.find((assignment) => assignment.id === id) ?? null;
}

export async function getStudentAssignments(
  studentId: string = DEMO_STUDENT_ID,
): Promise<StudentAssignment[]> {
  return MOCK_ASSIGNMENTS.filter((assignment) => assignment.assigneeIds.includes(studentId))
    .map((assignment) => {
      const completion = assignment.completion.find((entry) => entry.studentId === studentId);
      const completed = completion?.completed ?? 0;
      const total = completion?.total ?? 0;
      return {
        id: assignment.id,
        title: assignment.title,
        dueDate: assignment.dueDate,
        completed,
        total,
        submittedAt: completion?.submittedAt,
        overdue: !completion?.submittedAt && Date.parse(assignment.dueDate) < MOCK_NOW,
      };
    })
    .sort((a, b) => Date.parse(a.dueDate) - Date.parse(b.dueDate));
}

/* -------------------------------------------------------------------------- */
/* Dashboard                                                                   */
/* -------------------------------------------------------------------------- */

function recommendDrill(progress: StudentProgress): RecommendedDrill {
  const weakest = progress.hardestSkills[0];
  if (!weakest) {
    return {
      skill: "Linear functions",
      domain: "Algebra",
      section: "math",
      reason: "A good place to start while your history builds up.",
      questionCount: 10,
    };
  }
  return {
    skill: weakest.skill,
    domain: weakest.domain,
    section: weakest.section,
    reason: `Your weakest skill at ${Math.round(weakest.accuracy * 100)}% across ${weakest.attempted} questions.`,
    questionCount: 10,
  };
}

export async function getDashboardSummary(
  studentId: string = DEMO_STUDENT_ID,
): Promise<DashboardSummary | null> {
  const student = await getStudent(studentId);
  if (!student) return null;

  const progress = await getStudentProgress(studentId);
  const assignments = await getStudentAssignments(studentId);
  const sessions = await getSessions(studentId);

  return {
    student,
    estimatedScore: student.currentScore,
    scoreRange: student.scoreRange,
    scoreChange30d: student.scoreChange30d,
    targetScore: student.targetScore,
    daysUntilTest: daysFromToday(student.testDate),
    streakDays: student.streakDays,
    questionsSolved: student.questionsSolved,
    accuracy: student.accuracy,
    domainAccuracy: progress.domainAccuracy,
    recommendedDrill: recommendDrill(progress),
    assignments,
    recentSessions: sessions.filter((session) => session.completedAt).slice(0, 5),
  };
}

/* -------------------------------------------------------------------------- */
/* Admin                                                                       */
/* -------------------------------------------------------------------------- */

const WEEK_MS = 7 * 86_400_000;

export async function getCohortOverview(): Promise<CohortOverview> {
  const students = await getStudents();
  const assignments = await getAssignments();

  const activeThisWeek = students.filter(
    (student) => MOCK_NOW - Date.parse(student.lastActiveAt) < WEEK_MS,
  ).length;

  const averageScoreChange =
    students.reduce((sum, student) => sum + student.scoreChange30d, 0) / students.length;
  const averageAccuracy =
    students.reduce((sum, student) => sum + student.accuracy, 0) / students.length;

  // Questions answered across the cohort in the last seven days.
  const questionsThisWeek = students.reduce((sum, student) => {
    const progress = buildStudentProgress(student.id);
    return (
      sum +
      progress.activity
        .slice(-7)
        .reduce((daySum, day) => daySum + day.questions, 0)
    );
  }, 0);

  const upcomingDeadlines = assignments
    .filter((assignment) => Date.parse(assignment.dueDate) >= MOCK_NOW)
    .slice(0, 4)
    .map((assignment) => ({
      assignment,
      outstanding: assignment.completion.filter((entry) => !entry.submittedAt).length,
    }));

  return {
    totalStudents: students.length,
    activeThisWeek,
    averageScoreChange: Math.round(averageScoreChange),
    averageAccuracy,
    questionsThisWeek,
    fallingBehind: students.filter(
      (student) => student.standing === "falling_behind" || student.standing === "needs_attention",
    ),
    upcomingDeadlines,
  };
}

export async function getCohortAnalytics(): Promise<CohortAnalytics> {
  const students = await getStudents();
  const perStudent = students.map((student) => buildStudentProgress(student.id));

  const domainAccuracy = ALL_DOMAINS.map((domain) => {
    const entries = perStudent
      .map((progress) => progress.domainAccuracy.find((entry) => entry.domain === domain))
      .filter((entry): entry is DomainAccuracy => Boolean(entry));
    const attempted = entries.reduce((sum, entry) => sum + entry.attempted, 0);
    const correct = entries.reduce((sum, entry) => sum + entry.correct, 0);
    return {
      domain,
      section: domainSection(domain),
      attempted,
      correct,
      accuracy: attempted === 0 ? 0 : correct / attempted,
      studentsAttempted: entries.length,
    };
  }).sort((a, b) => a.accuracy - b.accuracy);

  const skillTotals = new Map<
    string,
    { domain: Domain; accuracySum: number; count: number; below: number }
  >();
  for (const progress of perStudent) {
    for (const skill of progress.skillMastery) {
      const entry = skillTotals.get(skill.skill) ?? {
        domain: skill.domain,
        accuracySum: 0,
        count: 0,
        below: 0,
      };
      entry.accuracySum += skill.accuracy;
      entry.count += 1;
      if (skill.accuracy < 0.6) entry.below += 1;
      skillTotals.set(skill.skill, entry);
    }
  }

  const skillGaps = [...skillTotals.entries()]
    .map(([skill, entry]) => ({
      skill,
      domain: entry.domain,
      section: domainSection(entry.domain),
      accuracy: entry.accuracySum / entry.count,
      studentsBelowThreshold: entry.below,
    }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 8);

  // Question-level difficulty: how many students got each question wrong.
  const hardestQuestions: QuestionDifficultyStat[] = MOCK_QUESTIONS.map((question) => {
    const rng = seededRandom(seedFrom(`cohort:${question.id}`));
    const attempts = 4 + Math.floor(rng() * 5);
    const baseWrong = question.difficulty === "hard" ? 0.58 : question.difficulty === "medium" ? 0.38 : 0.2;
    const incorrect = Math.min(attempts, Math.round(attempts * (baseWrong + (rng() - 0.5) * 0.24)));
    return {
      question,
      attempts,
      incorrect,
      incorrectRate: incorrect / attempts,
    };
  })
    .sort((a, b) => b.incorrectRate - a.incorrectRate)
    .slice(0, 10);

  const bands = [
    { band: "Below 1100", test: (score: number) => score < 1100 },
    { band: "1100–1199", test: (score: number) => score >= 1100 && score < 1200 },
    { band: "1200–1299", test: (score: number) => score >= 1200 && score < 1300 },
    { band: "1300–1399", test: (score: number) => score >= 1300 && score < 1400 },
    { band: "1400 and above", test: (score: number) => score >= 1400 },
  ];
  const scoreDistribution = bands.map(({ band, test }) => ({
    band,
    students: students.filter((student) => test(student.currentScore)).length,
  }));

  // Cohort question volume by week, most recent week last.
  const weeklyActivity = Array.from({ length: 8 }, (_, index) => {
    const weeksAgo = 7 - index;
    const start = 364 - weeksAgo * 7 - 6;
    const questions = perStudent.reduce((sum, progress) => {
      const slice = progress.activity.slice(Math.max(0, start), Math.max(0, start) + 7);
      return sum + slice.reduce((daySum, day) => daySum + day.questions, 0);
    }, 0);
    return { week: weeksAgo === 0 ? "This week" : `${weeksAgo}w ago`, questions };
  });

  return { domainAccuracy, skillGaps, hardestQuestions, scoreDistribution, weeklyActivity };
}
