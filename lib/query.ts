import type { Difficulty, Domain, QuestionFilters, QuestionStatus, Section } from "./types";
import { ALL_DOMAINS, ALL_SKILLS, DIFFICULTIES } from "./taxonomy";

/**
 * Question bank filters live in the URL, so a filtered view is shareable and
 * the actual filtering stays in the data layer (where it becomes SQL in Stage
 * 2) instead of being redone in the browser.
 */

export type SearchParams = Record<string, string | string[] | undefined>;

const STATUSES: QuestionStatus[] = ["unattempted", "correct", "incorrect", "flagged"];

function list(value: string | string[] | undefined): string[] {
  if (!value) return [];
  const raw = Array.isArray(value) ? value : [value];
  return raw.flatMap((entry) => entry.split(",")).filter(Boolean);
}

function single(value: string | string[] | undefined): string | undefined {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

export function parseQuestionFilters(params: SearchParams): QuestionFilters {
  const section = single(params.section);
  const page = Number.parseInt(single(params.page) ?? "1", 10);

  return {
    section: section === "math" || section === "rw" ? (section as Section) : "all",
    domains: list(params.domain).filter((value): value is Domain =>
      (ALL_DOMAINS as string[]).includes(value),
    ),
    skills: list(params.skill).filter((value) => ALL_SKILLS.includes(value)),
    difficulties: list(params.difficulty).filter((value): value is Difficulty =>
      (DIFFICULTIES as string[]).includes(value),
    ),
    statuses: list(params.status).filter((value): value is QuestionStatus =>
      (STATUSES as string[]).includes(value),
    ),
    savedOnly: single(params.saved) === "1",
    search: single(params.q) || undefined,
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: 10,
  };
}

export function serializeQuestionFilters(filters: QuestionFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.section && filters.section !== "all") params.set("section", filters.section);
  filters.domains?.forEach((domain) => params.append("domain", domain));
  filters.skills?.forEach((skill) => params.append("skill", skill));
  filters.difficulties?.forEach((difficulty) => params.append("difficulty", difficulty));
  filters.statuses?.forEach((status) => params.append("status", status));
  if (filters.savedOnly) params.set("saved", "1");
  if (filters.search) params.set("q", filters.search);
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));
  return params;
}

export function hasActiveFilters(filters: QuestionFilters): boolean {
  return Boolean(
    (filters.section && filters.section !== "all") ||
      filters.domains?.length ||
      filters.skills?.length ||
      filters.difficulties?.length ||
      filters.statuses?.length ||
      filters.savedOnly ||
      filters.search,
  );
}
