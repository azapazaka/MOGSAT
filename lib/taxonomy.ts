import type { Difficulty, Domain, MathDomain, RwDomain, Section } from "./types";

/**
 * The content taxonomy, mirroring the College Board domain structure for the
 * Digital SAT. Domain and skill names are factual category labels; every piece
 * of question content in `lib/mock` is original placeholder material.
 */

export const MATH_DOMAINS: MathDomain[] = [
  "Algebra",
  "Advanced Math",
  "Problem-Solving and Data Analysis",
  "Geometry and Trigonometry",
];

export const RW_DOMAINS: RwDomain[] = [
  "Information and Ideas",
  "Craft and Structure",
  "Expression of Ideas",
  "Standard English Conventions",
];

export const ALL_DOMAINS: Domain[] = [...MATH_DOMAINS, ...RW_DOMAINS];

export const SKILLS_BY_DOMAIN: Record<Domain, string[]> = {
  Algebra: [
    "Linear equations in one variable",
    "Linear equations in two variables",
    "Linear functions",
    "Systems of two linear equations",
    "Linear inequalities",
  ],
  "Advanced Math": [
    "Equivalent expressions",
    "Nonlinear equations in one variable",
    "Nonlinear functions",
  ],
  "Problem-Solving and Data Analysis": [
    "Ratios, rates, and proportional relationships",
    "Percentages",
    "One-variable data and distributions",
    "Two-variable data and models",
    "Probability and conditional probability",
    "Inference from sample statistics",
    "Evaluating statistical claims",
  ],
  "Geometry and Trigonometry": [
    "Area and volume",
    "Lines, angles, and triangles",
    "Right triangles and trigonometry",
    "Circles",
  ],
  "Information and Ideas": [
    "Central ideas and details",
    "Command of evidence: textual",
    "Command of evidence: quantitative",
    "Inferences",
  ],
  "Craft and Structure": [
    "Words in context",
    "Text structure and purpose",
    "Cross-text connections",
  ],
  "Expression of Ideas": ["Rhetorical synthesis", "Transitions"],
  "Standard English Conventions": ["Boundaries", "Form, structure, and sense"],
};

export const ALL_SKILLS: string[] = ALL_DOMAINS.flatMap(
  (domain) => SKILLS_BY_DOMAIN[domain],
);

export function domainSection(domain: Domain): Section {
  return (MATH_DOMAINS as Domain[]).includes(domain) ? "math" : "rw";
}

export function domainsForSection(section: Section | "all"): Domain[] {
  if (section === "math") return MATH_DOMAINS;
  if (section === "rw") return RW_DOMAINS;
  return ALL_DOMAINS;
}

export const SECTION_LABELS: Record<Section, string> = {
  math: "Math",
  rw: "Reading and Writing",
};

export const SECTION_SHORT_LABELS: Record<Section, string> = {
  math: "Math",
  rw: "R&W",
};

export const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

/** Short form used inside dense badges and table cells. */
export const DOMAIN_ABBREVIATIONS: Record<Domain, string> = {
  Algebra: "ALG",
  "Advanced Math": "ADV",
  "Problem-Solving and Data Analysis": "PSDA",
  "Geometry and Trigonometry": "GEO",
  "Information and Ideas": "INFO",
  "Craft and Structure": "CRAFT",
  "Expression of Ideas": "EXPR",
  "Standard English Conventions": "CONV",
};
