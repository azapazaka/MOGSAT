"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ALL_DOMAINS, SKILLS_BY_DOMAIN, domainSection, SECTION_LABELS } from "@/lib/taxonomy";
import type { Domain } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Label, Select } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const COUNTS = [10, 20, 30] as const;

/**
 * Drill configuration. Stage 1 navigates to a pre-built drill session and
 * carries the choices in the query string; Stage 2 creates a session row from
 * these inputs and redirects to it.
 */
export function DrillBuilder({
  sessionId,
  initialSkill,
}: {
  sessionId: string;
  initialSkill?: string;
}) {
  const router = useRouter();
  const defaultDomain =
    (ALL_DOMAINS.find((domain) => SKILLS_BY_DOMAIN[domain].includes(initialSkill ?? "")) ??
      "Algebra") as Domain;

  const [domain, setDomain] = useState<Domain>(defaultDomain);
  const [skill, setSkill] = useState<string>(
    initialSkill && SKILLS_BY_DOMAIN[defaultDomain].includes(initialSkill)
      ? initialSkill
      : SKILLS_BY_DOMAIN[defaultDomain][0],
  );
  const [count, setCount] = useState<(typeof COUNTS)[number]>(10);
  const [timed, setTimed] = useState(false);

  const start = () => {
    const params = new URLSearchParams({
      skill,
      count: String(count),
      timed: timed ? "1" : "0",
    });
    router.push(`/practice/session/${sessionId}?${params}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="drill-domain">Domain</Label>
          <Select
            id="drill-domain"
            value={domain}
            onChange={(event) => {
              const next = event.target.value as Domain;
              setDomain(next);
              setSkill(SKILLS_BY_DOMAIN[next][0]);
            }}
          >
            {ALL_DOMAINS.map((option) => (
              <option key={option} value={option}>
                {SECTION_LABELS[domainSection(option)]} — {option}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="drill-skill">Skill</Label>
          <Select id="drill-skill" value={skill} onChange={(event) => setSkill(event.target.value)}>
            {SKILLS_BY_DOMAIN[domain].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <fieldset>
        <legend className="mb-2 text-label font-medium uppercase tracking-[0.04em] text-ink-muted">
          Number of questions
        </legend>
        <div className="flex gap-2">
          {COUNTS.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={count === option}
              onClick={() => setCount(option)}
              className={cn(
                "h-9 flex-1 rounded-input border text-[14px] tabular-nums transition-ui",
                count === option
                  ? "border-accent bg-accent-soft text-ink"
                  : "border-line text-ink-muted hover:border-ink-muted hover:text-ink",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-label font-medium uppercase tracking-[0.04em] text-ink-muted">
          Timing
        </legend>
        <div className="flex gap-2">
          {[
            { value: false, label: "Untimed" },
            { value: true, label: "Timed" },
          ].map((option) => (
            <button
              key={option.label}
              type="button"
              aria-pressed={timed === option.value}
              onClick={() => setTimed(option.value)}
              className={cn(
                "h-9 flex-1 rounded-input border text-[14px] transition-ui",
                timed === option.value
                  ? "border-accent bg-accent-soft text-ink"
                  : "border-line text-ink-muted hover:border-ink-muted hover:text-ink",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      <Button variant="primary" size="lg" className="w-full" onClick={start}>
        Start drill
      </Button>

      <p className="text-meta text-ink-muted">
        With 48 seed questions a drill widens from the chosen skill to its domain, then to the
        section, to reach the requested count without repeating a question.
      </p>
    </div>
  );
}
