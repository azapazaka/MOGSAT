import { z } from "zod";
import { ALL_DOMAINS, SKILLS_BY_DOMAIN, domainSection } from "@/lib/taxonomy";
import type { Domain } from "@/lib/types";

/**
 * The question import contract.
 *
 * Deliberately forgiving about shape and strict about meaning: a bank exported
 * from somewhere else will spell "Math"/"math", "Reading & Writing"/"rw" and
 * "Hard"/"hard" inconsistently, and may give choices as an object or an array.
 * All of that normalises. What does not normalise — an unknown domain, a
 * correct answer that is not one of the choices — is rejected with a message
 * naming the row and the field, because silently importing a question whose key
 * is wrong is worse than failing the import.
 */

const SECTION_ALIASES: Record<string, "math" | "rw"> = {
  math: "math",
  maths: "math",
  m: "math",
  "reading & writing": "rw",
  "reading and writing": "rw",
  "reading/writing": "rw",
  "r&w": "rw",
  rw: "rw",
  verbal: "rw",
  english: "rw",
};

const DIFFICULTY_ALIASES: Record<string, "easy" | "medium" | "hard"> = {
  easy: "easy",
  e: "easy",
  "1": "easy",
  medium: "medium",
  med: "medium",
  moderate: "medium",
  m: "medium",
  "2": "medium",
  hard: "hard",
  h: "hard",
  difficult: "hard",
  "3": "hard",
};

const TYPE_ALIASES: Record<string, "multiple_choice" | "student_produced_response"> = {
  multiple_choice: "multiple_choice",
  "multiple choice": "multiple_choice",
  mc: "multiple_choice",
  mcq: "multiple_choice",
  student_produced_response: "student_produced_response",
  "student produced response": "student_produced_response",
  spr: "student_produced_response",
  grid_in: "student_produced_response",
  "grid-in": "student_produced_response",
  "free response": "student_produced_response",
};

const LABELS = ["A", "B", "C", "D"] as const;

const looseString = z.union([z.string(), z.number()]).transform(String);

/** Choices as `{A: "...", ...}` or as an array in A–D order. */
const choicesSchema = z.union([
  z.record(z.string(), looseString),
  z.array(looseString),
]);

/** Per-choice explanations or trap codes, keyed by label. */
const byLabelSchema = z.record(z.string(), looseString).optional();

export const rawQuestionSchema = z
  .object({
    id: z.string().optional(),

    section: z.string(),
    domain: z.string(),
    skill: z.string(),
    difficulty: z.string(),
    question_type: z.string().optional(),
    type: z.string().optional(),

    // The stem, under any of the names an export might use.
    question: z.string().optional(),
    question_text: z.string().optional(),
    stem: z.string().optional(),

    passage: z.string().optional(),
    passage_secondary: z.string().optional(),
    expression: z.string().optional(),
    table: z.unknown().optional(),
    table_data: z.unknown().optional(),
    figure: z.unknown().optional(),
    image: z.unknown().optional(),

    choices: choicesSchema.optional(),
    answer_choices: choicesSchema.optional(),

    correct_answer: looseString,
    accepted_answers: z.array(looseString).optional(),

    explanation: z.string().optional(),
    explanations: byLabelSchema,
    answer_choice_explanations: byLabelSchema,
    trap_explanations: byLabelSchema,
    trap_types: byLabelSchema,

    trap: z.string().optional(),
    common_trap: z.string().optional(),
    strategy: z.string().optional(),
    one_rule: z.string().optional(),
    difficulty_reason: z.string().optional(),

    calculator_allowed: z.boolean().optional(),
    formula_relevant: z.string().optional(),
    graph_required: z.boolean().optional(),
    desmos_strategy: z.string().optional(),

    rhetorical_context: z.string().optional(),
    grammar_rule: z.string().optional(),
    evidence_relationship: z.string().optional(),

    source: z.string().optional(),
    tags: z.array(z.string()).optional(),
    estimated_time_seconds: z.number().optional(),
  })
  // Unknown keys are kept rather than dropped, and land in `raw`.
  .passthrough();

export type RawQuestion = z.infer<typeof rawQuestionSchema>;

/** A question normalised into exactly the shape the database expects. */
export interface NormalizedQuestion {
  question: {
    id: string;
    section: "math" | "rw";
    domain: string;
    skill: string;
    difficulty: "easy" | "medium" | "hard";
    question_type: "multiple_choice" | "student_produced_response";
    stem: string;
    passage: string | null;
    passage_secondary: string | null;
    expression: string | null;
    table_data: unknown | null;
    figure: unknown | null;
    correct_answer: string;
    accepted_answers: string[];
    explanation: string;
    common_trap: string | null;
    strategy: string | null;
    one_rule: string | null;
    difficulty_reason: string | null;
    calculator_allowed: boolean;
    formula_relevant: string | null;
    graph_required: boolean;
    desmos_strategy: string | null;
    rhetorical_context: string | null;
    grammar_rule: string | null;
    evidence_relationship: string | null;
    source: string | null;
    tags: string[];
    estimated_time_seconds: number;
    raw: Record<string, unknown> | null;
  };
  choices: {
    question_id: string;
    label: string;
    text: string;
    is_correct: boolean;
    explanation: string | null;
    trap_type: string | null;
  }[];
}

export interface ImportIssue {
  index: number;
  id?: string;
  message: string;
}

export interface ImportResult {
  questions: NormalizedQuestion[];
  issues: ImportIssue[];
}

function toChoiceMap(value: unknown): Record<string, string> {
  if (!value) return {};
  if (Array.isArray(value)) {
    return Object.fromEntries(
      value.slice(0, 4).map((text, index) => [LABELS[index], String(text)]),
    );
  }
  const out: Record<string, string> = {};
  for (const [key, text] of Object.entries(value as Record<string, unknown>)) {
    const label = key.trim().toUpperCase().replace(/[^A-D]/g, "");
    if (label) out[label] = String(text);
  }
  return out;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}

/** The known keys, so everything else can be preserved into `raw`. */
const KNOWN_KEYS = new Set(Object.keys(rawQuestionSchema.shape));

export function normalizeQuestion(
  input: unknown,
  index: number,
): { ok: true; value: NormalizedQuestion } | { ok: false; issue: ImportIssue } {
  const parsed = rawQuestionSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return {
      ok: false,
      issue: {
        index,
        message: `${first.path.join(".") || "row"}: ${first.message}`,
      },
    };
  }

  const raw = parsed.data;
  const fail = (message: string) => ({
    ok: false as const,
    issue: { index, id: raw.id, message },
  });

  const section = SECTION_ALIASES[raw.section.trim().toLowerCase()];
  if (!section) return fail(`Unknown section "${raw.section}".`);

  const domain = ALL_DOMAINS.find(
    (candidate) => candidate.toLowerCase() === raw.domain.trim().toLowerCase(),
  ) as Domain | undefined;
  if (!domain) return fail(`Unknown domain "${raw.domain}".`);

  if (domainSection(domain) !== section) {
    return fail(`Domain "${domain}" does not belong to section "${section}".`);
  }

  const difficulty = DIFFICULTY_ALIASES[raw.difficulty.trim().toLowerCase()];
  if (!difficulty) return fail(`Unknown difficulty "${raw.difficulty}".`);

  const stem = raw.stem ?? raw.question ?? raw.question_text;
  if (!stem || !stem.trim()) return fail("Missing the question text.");

  const questionType =
    TYPE_ALIASES[(raw.question_type ?? raw.type ?? "multiple_choice").trim().toLowerCase()] ??
    "multiple_choice";

  const choiceMap = toChoiceMap(raw.choices ?? raw.answer_choices);
  const explanationMap = {
    ...toChoiceMap(raw.explanations),
    ...toChoiceMap(raw.answer_choice_explanations),
    ...toChoiceMap(raw.trap_explanations),
  };
  const trapMap = toChoiceMap(raw.trap_types);

  const labels = LABELS.filter((label) => choiceMap[label] !== undefined);

  if (questionType === "multiple_choice" && labels.length < 2) {
    return fail("A multiple-choice question needs at least two answer choices.");
  }

  // The key may arrive as a label ("C"), as the choice text, or as a raw value
  // for a student-produced response.
  const answerRaw = String(raw.correct_answer).trim();
  let correctLabel: string | null = null;

  if (questionType === "multiple_choice") {
    const upper = answerRaw.toUpperCase();
    if (labels.includes(upper as (typeof LABELS)[number])) {
      correctLabel = upper;
    } else {
      const byText = labels.find(
        (label) => choiceMap[label].trim().toLowerCase() === answerRaw.toLowerCase(),
      );
      correctLabel = byText ?? null;
    }
    if (!correctLabel) {
      return fail(`correct_answer "${answerRaw}" does not match any answer choice.`);
    }
  }

  const skill = raw.skill.trim();
  const knownSkills = SKILLS_BY_DOMAIN[domain];
  // An unrecognised skill is a warning, not a rejection: the taxonomy of skills
  // grows, and losing the question would be the worse outcome. It is preserved
  // verbatim and surfaced in the import report.
  const skillIssue = knownSkills.includes(skill)
    ? null
    : `Skill "${skill}" is not in the known list for ${domain}; imported as-is.`;

  const id =
    raw.id?.trim() ||
    `${section}-${slugify(domain)}-${slugify(skill)}-${slugify(stem).slice(0, 16)}-${index}`;

  const extra: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (!KNOWN_KEYS.has(key)) extra[key] = value;
  }
  if (skillIssue) extra.__skill_warning = skillIssue;

  const value: NormalizedQuestion = {
    question: {
      id,
      section,
      domain,
      skill,
      difficulty,
      question_type: questionType,
      stem: stem.trim(),
      passage: raw.passage?.trim() || null,
      passage_secondary: raw.passage_secondary?.trim() || null,
      expression: raw.expression?.trim() || null,
      table_data: (raw.table_data ?? raw.table ?? null) as unknown,
      figure: (raw.figure ?? raw.image ?? null) as unknown,
      correct_answer: correctLabel ?? answerRaw,
      accepted_answers: raw.accepted_answers ?? [],
      explanation: (raw.explanation ?? explanationMap[correctLabel ?? ""] ?? "").trim(),
      common_trap: (raw.common_trap ?? raw.trap)?.trim() || null,
      strategy: raw.strategy?.trim() || null,
      one_rule: raw.one_rule?.trim() || null,
      difficulty_reason: raw.difficulty_reason?.trim() || null,
      calculator_allowed: raw.calculator_allowed ?? true,
      formula_relevant: raw.formula_relevant?.trim() || null,
      graph_required: raw.graph_required ?? false,
      desmos_strategy: raw.desmos_strategy?.trim() || null,
      rhetorical_context: raw.rhetorical_context?.trim() || null,
      grammar_rule: raw.grammar_rule?.trim() || null,
      evidence_relationship: raw.evidence_relationship?.trim() || null,
      source: raw.source?.trim() || null,
      tags: raw.tags ?? [],
      estimated_time_seconds: raw.estimated_time_seconds ?? 75,
      raw: Object.keys(extra).length > 0 ? extra : null,
    },
    choices: labels.map((label) => ({
      question_id: id,
      label,
      text: choiceMap[label],
      is_correct: label === correctLabel,
      explanation: explanationMap[label]?.trim() || null,
      trap_type: label === correctLabel ? null : trapMap[label]?.trim() || null,
    })),
  };

  return { ok: true, value };
}

/** Normalises a whole payload, collecting per-row failures rather than aborting. */
export function normalizeImport(payload: unknown): ImportResult {
  const rows = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as { questions?: unknown })?.questions)
      ? (payload as { questions: unknown[] }).questions
      : null;

  if (!rows) {
    return {
      questions: [],
      issues: [{ index: 0, message: "Expected a JSON array of questions, or { questions: [...] }." }],
    };
  }

  const questions: NormalizedQuestion[] = [];
  const issues: ImportIssue[] = [];
  const seen = new Set<string>();

  rows.forEach((row, index) => {
    const result = normalizeQuestion(row, index);
    if (!result.ok) {
      issues.push(result.issue);
      return;
    }
    if (seen.has(result.value.question.id)) {
      issues.push({
        index,
        id: result.value.question.id,
        message: `Duplicate id "${result.value.question.id}" within this payload.`,
      });
      return;
    }
    seen.add(result.value.question.id);
    questions.push(result.value);
  });

  return { questions, issues };
}
