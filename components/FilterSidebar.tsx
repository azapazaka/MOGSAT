"use client";

import { ALL_DOMAINS, DIFFICULTIES, DIFFICULTY_LABELS, SKILLS_BY_DOMAIN, domainsForSection } from "@/lib/taxonomy";
import type { Difficulty, Domain, QuestionStatus, Section } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface QuestionFilterState {
  section: Section | "all";
  domains: Domain[];
  skills: string[];
  difficulties: Difficulty[];
  statuses: QuestionStatus[];
}

export const EMPTY_FILTERS: QuestionFilterState = {
  section: "all",
  domains: [],
  skills: [],
  difficulties: [],
  statuses: [],
};

const STATUS_LABELS: Record<QuestionStatus, string> = {
  unattempted: "Unattempted",
  correct: "Correct",
  incorrect: "Incorrect",
  flagged: "Flagged",
};

const SECTIONS: { value: Section | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "math", label: "Math" },
  { value: "rw", label: "Reading and Writing" },
];

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-line pb-6">
      <h3 className="mb-3 text-label font-medium uppercase tracking-[0.04em] text-ink-muted">
        {title}
      </h3>
      {children}
    </div>
  );
}

function CheckRow({
  checked,
  onChange,
  label,
  count,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  count?: number;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-1 text-[14px] text-ink">
      <Checkbox checked={checked} onCheckedChange={onChange} />
      <span className="flex-1">{label}</span>
      {count !== undefined ? <span className="text-meta tabular-nums text-ink-muted">{count}</span> : null}
    </label>
  );
}

/** Left sidebar filters for the question bank: section, domain, skill, difficulty, status. */
export function FilterSidebar({
  value,
  onChange,
  className,
}: {
  value: QuestionFilterState;
  onChange: (next: QuestionFilterState) => void;
  className?: string;
}) {
  const visibleDomains = domainsForSection(value.section);
  const skillDomains = value.domains.length ? value.domains : visibleDomains;
  const visibleSkills = skillDomains.flatMap((domain) => SKILLS_BY_DOMAIN[domain]);

  const hasFilters =
    value.section !== "all" ||
    value.domains.length > 0 ||
    value.skills.length > 0 ||
    value.difficulties.length > 0 ||
    value.statuses.length > 0;

  return (
    <aside className={cn("space-y-6", className)} aria-label="Question filters">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-medium text-ink">Filters</h2>
        {hasFilters ? (
          <Button variant="ghost" size="sm" onClick={() => onChange(EMPTY_FILTERS)}>
            Clear all
          </Button>
        ) : null}
      </div>

      <FilterGroup title="Section">
        <div className="flex flex-col gap-1">
          {SECTIONS.map((section) => (
            <label key={section.value} className="flex cursor-pointer items-center gap-3 py-1 text-[14px] text-ink">
              <input
                type="radio"
                name="section"
                className="accent-accent"
                checked={value.section === section.value}
                onChange={() =>
                  onChange({
                    ...value,
                    section: section.value,
                    // Domains and skills outside the new section stop applying.
                    domains: value.domains.filter((domain) =>
                      domainsForSection(section.value).includes(domain),
                    ),
                    skills: [],
                  })
                }
              />
              {section.label}
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Domain">
        <div className="space-y-0.5">
          {visibleDomains.map((domain) => (
            <CheckRow
              key={domain}
              label={domain}
              checked={value.domains.includes(domain)}
              onChange={() => {
                const domains = toggle(value.domains, domain);
                const allowed = new Set(
                  (domains.length ? domains : ALL_DOMAINS).flatMap((item) => SKILLS_BY_DOMAIN[item]),
                );
                onChange({
                  ...value,
                  domains,
                  skills: value.skills.filter((skill) => allowed.has(skill)),
                });
              }}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Skill">
        <div className="max-h-[220px] space-y-0.5 overflow-y-auto pr-2">
          {visibleSkills.map((skill) => (
            <CheckRow
              key={skill}
              label={skill}
              checked={value.skills.includes(skill)}
              onChange={() => onChange({ ...value, skills: toggle(value.skills, skill) })}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Difficulty">
        <div className="space-y-0.5">
          {DIFFICULTIES.map((difficulty) => (
            <CheckRow
              key={difficulty}
              label={DIFFICULTY_LABELS[difficulty]}
              checked={value.difficulties.includes(difficulty)}
              onChange={() =>
                onChange({ ...value, difficulties: toggle(value.difficulties, difficulty) })
              }
            />
          ))}
        </div>
      </FilterGroup>

      <div>
        <h3 className="mb-3 text-label font-medium uppercase tracking-[0.04em] text-ink-muted">
          Status
        </h3>
        <div className="space-y-0.5">
          {(Object.keys(STATUS_LABELS) as QuestionStatus[]).map((status) => (
            <CheckRow
              key={status}
              label={STATUS_LABELS[status]}
              checked={value.statuses.includes(status)}
              onChange={() => onChange({ ...value, statuses: toggle(value.statuses, status) })}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
