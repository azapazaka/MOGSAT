/**
 * Domain model for the SAT prep platform.
 *
 * These types are the contract between the data layer (`lib/data.ts`) and the
 * UI. Stage 2 replaces the mock implementations behind `lib/data.ts` with
 * Supabase queries; as long as the queries return these shapes, no component
 * has to change. Every date is an ISO 8601 string rather than a `Date` so the
 * values cross the server/client boundary without serialization surprises.
 */

export type Role = "student" | "admin";

export type Section = "math" | "rw";

export type Difficulty = "easy" | "medium" | "hard";

export type QuestionType = "multiple_choice" | "student_produced_response";

/** The four College Board Math domains. */
export type MathDomain =
  | "Algebra"
  | "Advanced Math"
  | "Problem-Solving and Data Analysis"
  | "Geometry and Trigonometry";

/** The four College Board Reading and Writing domains. */
export type RwDomain =
  | "Information and Ideas"
  | "Craft and Structure"
  | "Expression of Ideas"
  | "Standard English Conventions";

export type Domain = MathDomain | RwDomain;

export type ChoiceLabel = "A" | "B" | "C" | "D";

/**
 * A wrong answer is never arbitrary — each one is built from a specific
 * mistake. Naming that mistake is what lets the platform teach strategy
 * instead of just handing over the key. Codes match `public.trap_types`.
 */
export type TrapType =
  | "too_broad"
  | "too_narrow"
  | "unsupported"
  | "opposite"
  | "partially_correct"
  | "misread_question"
  | "true_but_irrelevant"
  | "calculation_error"
  | "sign_error"
  | "wrong_formula"
  | "wrong_variable"
  | "scope_error"
  | "extreme_language"
  | "outside_passage"
  | "grammar_violation"
  | "common_misconception"
  | "incomplete_step";

export interface Choice {
  id: string;
  label: ChoiceLabel;
  text: string;
  /** Rendered on its own line in the serif face when the choice is an
   *  expression rather than prose. */
  expression?: string;
  /**
   * Why this specific choice is right or wrong. Present on every choice, not
   * just the key — this is what the incorrect-answer breakdown is built from.
   * Optional because an imported question may not carry one yet.
   */
  explanation?: string;
  /** The mistake this distractor is designed to catch. Absent on the key. */
  trapType?: TrapType;
}

export interface QuestionTable {
  caption?: string;
  headers: string[];
  rows: string[][];
}

/**
 * Stage 1 ships no binary assets, so a figure is described rather than served.
 * The viewer renders an accessible placeholder from `alt` and `caption`;
 * Stage 2 adds a `url` here and the same component renders the real asset.
 */
export interface QuestionFigure {
  kind: "graph" | "diagram" | "figure";
  alt: string;
  caption?: string;
}

export interface Question {
  id: string;
  section: Section;
  domain: Domain;
  skill: string;
  difficulty: Difficulty;
  type: QuestionType;
  /** The question text itself. */
  stem: string;
  /** Reading and Writing stimulus, shown in the left pane of the split view. */
  passage?: string;
  /** A second stimulus, used only by cross-text connections questions. */
  passageSecondary?: string;
  /** Math notation, rendered on its own line above the stem in the serif face. */
  expression?: string;
  table?: QuestionTable;
  figure?: QuestionFigure;
  /** Empty for student-produced responses. */
  choices: Choice[];
  /** A choice id for multiple choice, or the canonical entry for an SPR. */
  correctAnswer: string;
  /** Alternate accepted entries for student-produced responses (e.g. "0.5", "1/2"). */
  acceptedAnswers?: string[];
  /** Why the correct answer is correct. Per-choice reasoning lives on `choices`. */
  explanation: string;
  estimatedTimeSeconds: number;

  /* ---------------------------------------------------------------------- */
  /* Teaching payload — what turns a solved question into a learned one.     */
  /* All optional so a partially specified import is still usable.           */
  /* ---------------------------------------------------------------------- */

  /** The single mistake most students make here. */
  commonTrap?: string;
  /** A reusable approach, not a restatement of this question's solution. */
  strategy?: string;
  /** One short, memorable takeaway. Shown prominently after a miss. */
  oneRule?: string;
  /** What makes this question hard, rather than merely long. */
  difficultyReason?: string;

  /** Math-specific metadata. */
  calculatorAllowed?: boolean;
  formulaRelevant?: string;
  graphRequired?: boolean;
  desmosStrategy?: string;

  /** Reading and Writing specific metadata. */
  rhetoricalContext?: string;
  grammarRule?: string;
  evidenceRelationship?: string;

  /** Provenance and free-form labels for filtering. */
  source?: string;
  tags?: string[];
}

export type QuestionStatus = "unattempted" | "correct" | "incorrect" | "flagged";

/** What the signed-in student has done with a given question. */
export interface QuestionState {
  questionId: string;
  status: Exclude<QuestionStatus, "flagged">;
  flagged: boolean;
  saved: boolean;
  lastAttemptedAt?: string;
}

export interface QuestionWithState extends Question {
  state: QuestionState;
}

export interface QuestionFilters {
  section?: Section | "all";
  domains?: Domain[];
  skills?: string[];
  difficulties?: Difficulty[];
  statuses?: QuestionStatus[];
  savedOnly?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

export type StudentStanding = "on_track" | "needs_attention" | "falling_behind";

export interface Student {
  id: string;
  name: string;
  email: string;
  tutorId: string;
  targetScore: number;
  currentScore: number;
  /** Inclusive low/high bounds of the estimated score range. */
  scoreRange: [number, number];
  scoreChange30d: number;
  testDate: string;
  questionsSolved: number;
  /** 0..1 */
  accuracy: number;
  lastActiveAt: string;
  streakDays: number;
  standing: StudentStanding;
  joinedAt: string;
}

export interface Tutor {
  id: string;
  name: string;
  email: string;
}

export type SessionKind = "drill" | "practice_test";

export interface SessionModule {
  id: string;
  label: string;
  section: Section;
  /** Adaptive-style tests run Module 1 then Module 2 per section. */
  order: 1 | 2;
  questionIds: string[];
  durationSeconds: number;
}

export interface SessionQuestionResult {
  questionId: string;
  /** A choice id, an SPR entry, or null when the question was skipped. */
  answer: string | null;
  correct: boolean;
  flagged: boolean;
  timeSpentSeconds: number;
}

export interface TestSession {
  id: string;
  studentId: string;
  kind: SessionKind;
  title: string;
  timed: boolean;
  startedAt: string;
  completedAt?: string;
  modules: SessionModule[];
  results: SessionQuestionResult[];
  scoreTotal?: number;
  scoreMath?: number;
  scoreRw?: number;
}

/** A completed session joined with the question content its review needs. */
export interface SessionReview {
  session: TestSession;
  questions: Question[];
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
  totalTimeSeconds: number;
  domainBreakdown: DomainAccuracy[];
}

export type AssignmentSource =
  | { kind: "skill"; skill: string; domain: Domain; section: Section; questionCount: number }
  | { kind: "questions"; questionIds: string[] };

export interface AssignmentCompletion {
  studentId: string;
  completed: number;
  total: number;
  submittedAt?: string;
}

export interface Assignment {
  id: string;
  title: string;
  instructions?: string;
  createdBy: string;
  createdAt: string;
  dueDate: string;
  assigneeIds: string[];
  /** Set when the assignment went to a named group rather than individuals. */
  groupLabel?: string;
  source: AssignmentSource;
  completion: AssignmentCompletion[];
}

/** An assignment narrowed to one student, for the student dashboard. */
export interface StudentAssignment {
  id: string;
  title: string;
  dueDate: string;
  completed: number;
  total: number;
  submittedAt?: string;
  overdue: boolean;
}

export interface ProgressPoint {
  date: string;
  score: number;
  math: number;
  rw: number;
}

export interface DomainAccuracy {
  domain: Domain;
  section: Section;
  attempted: number;
  correct: number;
  /** 0..1 */
  accuracy: number;
}

export type MasteryLevel = "needs_work" | "developing" | "solid" | "strong";

export interface SkillMastery {
  skill: string;
  domain: Domain;
  section: Section;
  attempted: number;
  /** 0..1 */
  accuracy: number;
  level: MasteryLevel;
  averageTimeSeconds: number;
}

export interface ActivityDay {
  date: string;
  questions: number;
  minutes: number;
}

export interface StudentProgress {
  studentId: string;
  trend: ProgressPoint[];
  domainAccuracy: DomainAccuracy[];
  skillMastery: SkillMastery[];
  hardestSkills: SkillMastery[];
  activity: ActivityDay[];
  totalQuestions: number;
  averageTimeSeconds: number;
  averageTimeByDomain: { domain: Domain; section: Section; seconds: number }[];
  streakDays: number;
}

export interface RecommendedDrill {
  skill: string;
  domain: Domain;
  section: Section;
  reason: string;
  questionCount: number;
}

export interface DashboardSummary {
  student: Student;
  estimatedScore: number;
  scoreRange: [number, number];
  scoreChange30d: number;
  targetScore: number;
  daysUntilTest: number;
  streakDays: number;
  questionsSolved: number;
  accuracy: number;
  domainAccuracy: DomainAccuracy[];
  recommendedDrill: RecommendedDrill;
  assignments: StudentAssignment[];
  recentSessions: TestSession[];
}

export interface NotificationPreferences {
  studyReminders: boolean;
  weeklyReport: boolean;
  assignmentAlerts: boolean;
  tutorMessages: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  studentId?: string;
  targetScore: number;
  testDate: string;
  timeZone: string;
  notifications: NotificationPreferences;
}

export interface CohortOverview {
  totalStudents: number;
  activeThisWeek: number;
  averageScoreChange: number;
  averageAccuracy: number;
  questionsThisWeek: number;
  fallingBehind: Student[];
  upcomingDeadlines: { assignment: Assignment; outstanding: number }[];
}

export interface QuestionDifficultyStat {
  question: Question;
  attempts: number;
  incorrect: number;
  /** 0..1 */
  incorrectRate: number;
}

export interface CohortAnalytics {
  domainAccuracy: (DomainAccuracy & { studentsAttempted: number })[];
  skillGaps: {
    skill: string;
    domain: Domain;
    section: Section;
    accuracy: number;
    studentsBelowThreshold: number;
  }[];
  hardestQuestions: QuestionDifficultyStat[];
  scoreDistribution: { band: string; students: number }[];
  weeklyActivity: { week: string; questions: number }[];
}

export interface StudentNote {
  id: string;
  studentId: string;
  author: string;
  createdAt: string;
  body: string;
}
