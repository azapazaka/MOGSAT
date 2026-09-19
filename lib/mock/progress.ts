import type {
  ActivityDay,
  Domain,
  DomainAccuracy,
  MasteryLevel,
  ProgressPoint,
  SkillMastery,
  StudentProgress,
} from "../types";
import { ALL_DOMAINS, SKILLS_BY_DOMAIN, domainSection } from "../taxonomy";
import { MOCK_NOW, seedFrom, seededRandom } from "./clock";
import { MOCK_STUDENTS } from "./students";

/**
 * Long-term progress is synthesized per student from their profile (overall
 * accuracy, score, streak, volume) rather than stored row by row. A seeded PRNG
 * keyed on the student id makes every figure stable across renders and builds.
 * Stage 2 replaces this with aggregate queries over real attempt rows.
 */

const DAY_MS = 86_400_000;

/**
 * A fixed per-domain difficulty bias applied to every student, on top of the
 * per-student variation below. Without it, averaging eight students' random
 * offsets regresses every domain to the same cohort mean and the analytics page
 * has nothing to report.
 */
const DOMAIN_BIAS: Record<Domain, number> = {
  Algebra: 0.08,
  "Advanced Math": -0.12,
  "Problem-Solving and Data Analysis": 0.02,
  "Geometry and Trigonometry": -0.08,
  "Information and Ideas": 0.05,
  "Craft and Structure": -0.04,
  "Expression of Ideas": 0.07,
  "Standard English Conventions": -0.06,
};
const TREND_POINTS = 12;
const ACTIVITY_DAYS = 364;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function masteryLevel(accuracy: number): MasteryLevel {
  if (accuracy < 0.5) return "needs_work";
  if (accuracy < 0.68) return "developing";
  if (accuracy < 0.82) return "solid";
  return "strong";
}

function isoDay(offsetDays: number) {
  const date = new Date(MOCK_NOW - offsetDays * DAY_MS);
  date.setUTCHours(12, 0, 0, 0);
  return date.toISOString().slice(0, 10);
}

/** A score history that lands on the student's current score today. */
function buildTrend(studentId: string): ProgressPoint[] {
  const student = MOCK_STUDENTS.find((candidate) => candidate.id === studentId);
  if (!student) return [];
  const rng = seededRandom(seedFrom(`${studentId}:trend`));

  // Work backwards from today: the last 30 days must cover scoreChange30d, and
  // the earlier span covers the climb from the student's starting point.
  const spanDays = Math.min(
    210,
    Math.max(60, Math.round((MOCK_NOW - Date.parse(student.joinedAt)) / DAY_MS)),
  );
  const startScore = clamp(
    student.currentScore - student.scoreChange30d - Math.round(60 + rng() * 140),
    400,
    1550,
  );

  const points: ProgressPoint[] = [];
  for (let i = 0; i < TREND_POINTS; i += 1) {
    const progress = i / (TREND_POINTS - 1);
    const offsetDays = Math.round(spanDays * (1 - progress));
    // Ease-out climb plus a little noise, pinned exactly to the current score.
    const eased = 1 - Math.pow(1 - progress, 1.7);
    const noise = i === TREND_POINTS - 1 ? 0 : Math.round((rng() - 0.5) * 40);
    const score =
      i === TREND_POINTS - 1
        ? student.currentScore
        : clamp(Math.round((startScore + (student.currentScore - startScore) * eased) / 10) * 10 + noise, 400, 1600);

    // Split the composite into two section scores that sum to it.
    const tilt = Math.round((rng() - 0.5) * 60);
    const math = clamp(Math.round((score / 2 + tilt) / 10) * 10, 200, 800);
    points.push({ date: isoDay(offsetDays), score, math, rw: score - math });
  }
  return points;
}

function buildDomainAccuracy(studentId: string): DomainAccuracy[] {
  const student = MOCK_STUDENTS.find((candidate) => candidate.id === studentId);
  if (!student) return [];
  const rng = seededRandom(seedFrom(`${studentId}:domains`));

  // Split the student's solved volume across domains, then vary accuracy
  // around their overall figure so some domains are clearly weaker.
  const weights = ALL_DOMAINS.map(() => 0.7 + rng() * 0.6);
  const weightTotal = weights.reduce((sum, weight) => sum + weight, 0);

  return ALL_DOMAINS.map((domain, index) => {
    const attempted = Math.max(6, Math.round((student.questionsSolved * weights[index]) / weightTotal));
    const accuracy = clamp(
      student.accuracy + DOMAIN_BIAS[domain] + (rng() - 0.5) * 0.18,
      0.24,
      0.96,
    );
    const correct = Math.round(attempted * accuracy);
    return {
      domain,
      section: domainSection(domain),
      attempted,
      correct,
      accuracy: correct / attempted,
    };
  });
}

function buildSkillMastery(studentId: string, domainAccuracy: DomainAccuracy[]): SkillMastery[] {
  const rng = seededRandom(seedFrom(`${studentId}:skills`));
  const byDomain = new Map<Domain, DomainAccuracy>(
    domainAccuracy.map((entry) => [entry.domain, entry]),
  );

  return ALL_DOMAINS.flatMap((domain) => {
    const parent = byDomain.get(domain);
    const skills = SKILLS_BY_DOMAIN[domain];
    return skills.map((skill) => {
      const attempted = Math.max(
        3,
        Math.round(((parent?.attempted ?? 40) / skills.length) * (0.6 + rng() * 0.8)),
      );
      const accuracy = clamp((parent?.accuracy ?? 0.6) + (rng() - 0.5) * 0.3, 0.16, 0.98);
      return {
        skill,
        domain,
        section: domainSection(domain),
        attempted,
        accuracy,
        level: masteryLevel(accuracy),
        averageTimeSeconds: Math.round(52 + rng() * 58),
      };
    });
  });
}

/** A year of activity, with the student's current streak running up to today. */
function buildActivity(studentId: string): ActivityDay[] {
  const student = MOCK_STUDENTS.find((candidate) => candidate.id === studentId);
  const rng = seededRandom(seedFrom(`${studentId}:activity`));
  const streak = student?.streakDays ?? 0;
  const intensity = clamp((student?.questionsSolved ?? 400) / 1200, 0.18, 0.92);

  const days: ActivityDay[] = [];
  for (let offset = ACTIVITY_DAYS; offset >= 0; offset -= 1) {
    const date = isoDay(offset);
    const dayOfWeek = new Date(`${date}T12:00:00.000Z`).getUTCDay();
    const weekendDip = dayOfWeek === 0 || dayOfWeek === 6 ? 0.55 : 1;
    // More recent days are likelier to be active than months-old ones.
    const recency = 0.45 + 0.55 * (1 - offset / ACTIVITY_DAYS);

    let questions = 0;
    if (offset < streak) {
      questions = Math.round(8 + rng() * 34);
    } else if (offset === streak && streak > 0) {
      questions = 0; // the gap that ends the streak
    } else if (rng() < intensity * recency * weekendDip) {
      questions = Math.round(4 + rng() * 40);
    }

    days.push({
      date,
      questions,
      minutes: questions === 0 ? 0 : Math.round(questions * (0.9 + rng() * 0.8)),
    });
  }
  return days;
}

export function buildStudentProgress(studentId: string): StudentProgress {
  const student = MOCK_STUDENTS.find((candidate) => candidate.id === studentId);
  const domainAccuracy = buildDomainAccuracy(studentId);
  const skillMastery = buildSkillMastery(studentId, domainAccuracy);
  const rng = seededRandom(seedFrom(`${studentId}:timing`));

  const hardestSkills = [...skillMastery]
    .filter((skill) => skill.attempted >= 4)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 6);

  const averageTimeByDomain = domainAccuracy.map((entry) => ({
    domain: entry.domain,
    section: entry.section,
    seconds: Math.round(48 + rng() * 62),
  }));

  const averageTimeSeconds = Math.round(
    averageTimeByDomain.reduce((sum, entry) => sum + entry.seconds, 0) / averageTimeByDomain.length,
  );

  return {
    studentId,
    trend: buildTrend(studentId),
    domainAccuracy,
    skillMastery,
    hardestSkills,
    activity: buildActivity(studentId),
    totalQuestions: student?.questionsSolved ?? 0,
    averageTimeSeconds,
    averageTimeByDomain,
    streakDays: student?.streakDays ?? 0,
  };
}
