/**
 * Seeds a small set of questions carrying the COMPLETE teaching payload:
 * a per-choice explanation and trap type for every option, plus the common
 * trap, the reusable strategy, the one-rule takeaway and why the question is
 * hard.
 *
 * These exist so the learning-mode breakdown can be built and tested against
 * real data. The rest of the bank arrives through the import tool, which runs
 * the same normaliser.
 *
 * Stems, choices and correct answers are read from `lib/mock/questions.ts` so
 * nothing is transcribed by hand; only the teaching metadata lives here.
 *
 *   npx tsx scripts/seed-exemplars.ts > exemplars.sql
 */
import { MOCK_QUESTIONS } from "../lib/mock/questions";
import { domainSection } from "../lib/taxonomy";
import type { TrapType } from "../lib/types";

interface Enrichment {
  commonTrap: string;
  strategy: string;
  oneRule: string;
  difficultyReason: string;
  /** Per choice label: why it is right or wrong, and the trap it represents. */
  choices: Record<string, { why: string; trap?: TrapType }>;
  calculatorAllowed?: boolean;
  formulaRelevant?: string;
  grammarRule?: string;
  evidenceRelationship?: string;
  rhetoricalContext?: string;
  tags?: string[];
}

const ENRICHMENTS: Record<string, Enrichment> = {
  "m-alg-06": {
    commonTrap: "Matching the coefficients instead of the slopes, which flips the sign.",
    strategy:
      "No solution means parallel lines. Put both equations in y = mx + b form and set the slopes equal — do not try to match coefficients directly.",
    oneRule: "ONE RULE: No solution = same slope, different intercept. Always convert to slope form first.",
    difficultyReason:
      "The condition is stated in words, not symbols, so you have to translate 'no solution' into a slope comparison before any algebra starts.",
    calculatorAllowed: true,
    formulaRelevant: "Slope-intercept form: y = mx + b",
    tags: ["systems", "no-solution", "parallel-lines"],
    choices: {
      A: { why: "Correct. In slope form the equations are y = (k/6)x − 5/3 and y = −(4/3)x − 7/3. Parallel means k/6 = −4/3, so k = −8." },
      B: { why: "This comes from solving k/6 = −1/3 or a similar slip in reducing the fraction. The slope of the second line is −4/3, not −1/3.", trap: "calculation_error" },
      C: { why: "The right size but the wrong sign. If you drop the minus on −4/3 you get k = 8, and halving it gives 2 — both signs of the same error.", trap: "sign_error" },
      D: { why: "This is −8 with the sign lost. It is the single most common answer here, which is exactly why it is offered.", trap: "sign_error" },
    },
  },

  "m-adv-04": {
    commonTrap: "Dividing only the first term and forgetting the constant.",
    strategy:
      "When a quadratic divides evenly by a linear factor, factor the numerator rather than doing long division — one of the factors has to be the denominator.",
    oneRule: "ONE RULE: If a fraction is said to simplify, factor the top and cancel. Do not expand.",
    difficultyReason:
      "You must recognise that x + 5 is a factor and then read off only the constant, not the whole quotient.",
    calculatorAllowed: true,
    tags: ["factoring", "equivalent-expressions"],
    choices: {},
  },

  "m-geo-04": {
    commonTrap: "Reporting r² instead of r.",
    strategy:
      "Complete the square in x and y, then read the circle equation as (x − h)² + (y − k)² = r². The number on the right is r², so take its square root.",
    oneRule: "ONE RULE: In a circle equation the right-hand side is r squared, never r.",
    difficultyReason:
      "Two completions of the square, and the constant has to be moved across correctly before the radius is visible.",
    calculatorAllowed: true,
    formulaRelevant: "Circle: (x − h)² + (y − k)² = r²",
    tags: ["circles", "completing-the-square"],
    choices: {
      A: { why: "Correct. Completing the square gives (x − 3)² + (y + 5)² = 16, so r = √16 = 4." },
      B: { why: "This is the diameter. The question asks for the radius, so this is right about the circle but answers the wrong quantity.", trap: "wrong_variable" },
      C: { why: "This is r², the value sitting on the right-hand side. Stopping one step early is the most common mistake on this question.", trap: "incomplete_step" },
      D: { why: "This uses the 18 from the original equation as though it were already r². The constant has to be moved and combined with the numbers produced by completing the square.", trap: "misread_question" },
    },
  },

  "m-psda-05": {
    commonTrap: "Using the wrong denominator — the whole table instead of the group named.",
    strategy:
      "In a conditional probability question, underline the words that name the group you are selecting from. That group is your denominator, before you look at anything else.",
    oneRule: "ONE RULE: 'Given that…' tells you the denominator. Find it before you find the numerator.",
    difficultyReason:
      "Three of the four denominators in the table are plausible, and only the phrase 'candidate who passed' rules them out.",
    calculatorAllowed: true,
    tags: ["conditional-probability", "two-way-table"],
    choices: {
      A: { why: "Uses all 200 candidates as the denominator. That answers 'what is the probability a random candidate both passed and attended', which is not what was asked.", trap: "misread_question" },
      B: { why: "Reverses the condition: this is the probability that an attendee passed, not that a passer attended. Both are 84 over something, which is what makes it tempting.", trap: "opposite" },
      C: { why: "Correct. The selection is made from the 130 who passed, and 84 of those attended, giving 84/130." },
      D: { why: "This is the overall pass rate. It uses no information about workshop attendance at all.", trap: "true_but_irrelevant" },
    },
  },

  "rw-info-06": {
    commonTrap: "Choosing an explanation that is reasonable in general but that the final sentence does not point to.",
    strategy:
      "When a text ends with 'the researchers note…', that last observation is the evidence. Your answer must be the thing that observation explains.",
    oneRule: "ONE RULE: The last sentence before the blank is usually the evidence. Make your answer follow from it specifically.",
    difficultyReason:
      "Every option is a believable reason for the result; only one is tied to the reported difficulty with turn boundaries.",
    evidenceRelationship: "The final sentence supplies the mechanism the completion must explain.",
    tags: ["inference", "completion"],
    choices: {
      A: { why: "Attention is never measured or mentioned. It is a sensible guess about people, but nothing in the text supports it.", trap: "unsupported" },
      B: { why: "Correct. The researchers link the distorted estimates to trouble telling where turns began and ended — and those boundaries are what define a pause's edges." },
      C: { why: "The passage states the pauses were identical in length, so this contradicts the setup directly.", trap: "opposite" },
      D: { why: "Deliberate overstatement is never suggested. The estimates grew more variable, which points to difficulty perceiving rather than a choice to exaggerate.", trap: "unsupported" },
    },
  },

  "rw-craft-04": {
    commonTrap: "Picking a response that argues with a claim Text 2 never actually addresses.",
    strategy:
      "For cross-text questions, state Text 2's position in your own words first, then find the option that matches it. Do not evaluate the options one by one against Text 1.",
    oneRule: "ONE RULE: Decide what the second author thinks before you read the answers.",
    difficultyReason:
      "Text 2 concedes part of Text 1's point, so answers that simply contradict Text 1 feel wrong-but-close.",
    rhetoricalContext: "Two texts taking opposing positions on museum repatriation.",
    tags: ["cross-text", "paired-passages"],
    choices: {
      A: { why: "Text 2 makes no legal argument at all. It objects on historical and educational grounds, so this brings in a claim from outside the text.", trap: "outside_passage" },
      B: { why: "Visitor attention is never discussed. This questions whether the displays matter rather than engaging with what Text 2 actually says about them.", trap: "unsupported" },
      C: { why: "Digital copies appear nowhere in either text. It is a reasonable idea, but it is not this author's response.", trap: "outside_passage" },
      D: { why: "Correct. Text 2 accepts that comparative displays show something, then argues that how they were assembled and what they teach outweigh it." },
    },
  },

  "rw-expr-04": {
    commonTrap: "Choosing an option that reports the finding accurately but stops before the implication.",
    strategy:
      "A synthesis question names two jobs. Count them, then check each option does both — an option doing one job perfectly still fails.",
    oneRule: "ONE RULE: If the goal names two things, the answer must contain both. One is not enough.",
    difficultyReason:
      "Three options are factually accurate; only one satisfies both halves of the stated goal.",
    rhetoricalContext: "Student notes to be synthesised towards a stated goal.",
    tags: ["rhetorical-synthesis", "notes"],
    choices: {
      A: { why: "Describes the method only. It gives neither the finding nor what follows from it.", trap: "too_narrow" },
      B: { why: "Reports the finding but stops there. Accurate, and exactly the trap: it does the first job and skips the second.", trap: "partially_correct" },
      C: { why: "Gives the implication without the finding that justifies it, so the reasoning arrives with no support.", trap: "partially_correct" },
      D: { why: "Correct. It gives the 71-of-240 result, names the likely cause, and states the cheaper remedy — both halves of the goal." },
    },
  },

  "rw-conv-06": {
    commonTrap: "Letting the opening phrase attach to whatever noun happens to come first.",
    strategy:
      "When a sentence opens with a modifying phrase, ask 'who or what did this?' The answer must be the subject immediately after the comma.",
    oneRule: "ONE RULE: An opening modifier describes the subject that follows it. Check they match before anything else.",
    difficultyReason:
      "All four options are grammatical sentences on their own; only the subject test separates them.",
    grammarRule: "A participial phrase modifies the subject of the main clause that follows it.",
    tags: ["modifiers", "dangling-modifier"],
    choices: {
      A: { why: "Makes the editor the thing rewritten three times. The sentence is otherwise fine, which is what hides the error.", trap: "grammar_violation" },
      B: { why: "Correct. The opening phrase describes the chapter, and the chapter is the subject of the main clause." },
      C: { why: "Makes 'approval' the thing rewritten. The subject is an abstract noun, so the modifier still has nothing sensible to attach to.", trap: "grammar_violation" },
      D: { why: "The 'it was…' construction buries the real subject, leaving the opening phrase modifying the editor again.", trap: "grammar_violation" },
    },
  },
};

function lit(value: string | null | undefined): string {
  if (value === null || value === undefined) return "null";
  return `'${value.replace(/'/g, "''")}'`;
}

function jsonLit(value: unknown): string {
  if (value === null || value === undefined) return "null";
  return `${lit(JSON.stringify(value))}::jsonb`;
}

function arrayLit(values: string[] | undefined): string {
  if (!values || values.length === 0) return "'{}'";
  return `ARRAY[${values.map(lit).join(", ")}]::text[]`;
}

const out: string[] = ["begin;"];

for (const [id, enrichment] of Object.entries(ENRICHMENTS)) {
  const q = MOCK_QUESTIONS.find((candidate) => candidate.id === id);
  if (!q) throw new Error(`Unknown question id in ENRICHMENTS: ${id}`);

  const section = domainSection(q.domain);
  const correctLabel =
    q.type === "multiple_choice"
      ? (q.choices.find((c) => c.id === q.correctAnswer)?.label ?? q.correctAnswer)
      : q.correctAnswer;

  out.push(`insert into public.questions (
  id, section, domain, skill, difficulty, question_type,
  stem, passage, passage_secondary, expression, table_data, figure,
  correct_answer, accepted_answers, explanation,
  common_trap, strategy, one_rule, difficulty_reason,
  calculator_allowed, formula_relevant,
  rhetorical_context, grammar_rule, evidence_relationship,
  source, tags, estimated_time_seconds
) values (
  ${lit(q.id)}, ${lit(section)}::public.section, ${lit(q.domain)}, ${lit(q.skill)},
  ${lit(q.difficulty)}::public.difficulty, ${lit(q.type)}::public.question_type,
  ${lit(q.stem)}, ${lit(q.passage ?? null)}, ${lit(q.passageSecondary ?? null)},
  ${lit(q.expression ?? null)}, ${jsonLit(q.table ?? null)}, ${jsonLit(q.figure ?? null)},
  ${lit(correctLabel)}, ${arrayLit(q.acceptedAnswers)}, ${lit(q.explanation)},
  ${lit(enrichment.commonTrap)}, ${lit(enrichment.strategy)}, ${lit(enrichment.oneRule)},
  ${lit(enrichment.difficultyReason)},
  ${enrichment.calculatorAllowed ?? section === "math"}, ${lit(enrichment.formulaRelevant ?? null)},
  ${lit(enrichment.rhetoricalContext ?? null)}, ${lit(enrichment.grammarRule ?? null)},
  ${lit(enrichment.evidenceRelationship ?? null)},
  ${lit("MOGSAT original")}, ${arrayLit(enrichment.tags)}, ${q.estimatedTimeSeconds}
)
on conflict (id) do update set
  common_trap = excluded.common_trap,
  strategy = excluded.strategy,
  one_rule = excluded.one_rule,
  difficulty_reason = excluded.difficulty_reason,
  updated_at = now();`);

  for (const choice of q.choices) {
    const meta = enrichment.choices[choice.label];
    out.push(`insert into public.answer_choices (question_id, label, text, expression, is_correct, explanation, trap_type)
values (${lit(q.id)}, ${lit(choice.label)}, ${lit(choice.text)}, ${lit(choice.expression ?? null)},
        ${choice.id === q.correctAnswer}, ${lit(meta?.why ?? null)}, ${lit(meta?.trap ?? null)})
on conflict (question_id, label) do update set
  explanation = excluded.explanation,
  trap_type = excluded.trap_type;`);
  }
}

out.push("commit;");
console.log(out.join("\n"));
