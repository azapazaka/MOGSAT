import type { MasteryLevel, SkillMastery } from "@/lib/types";
import { ProgressBar } from "@/components/ProgressRing";
import { formatPercent } from "@/lib/utils";
import { cn } from "@/lib/utils";

const LEVEL_LABELS: Record<MasteryLevel, string> = {
  needs_work: "Needs work",
  developing: "Developing",
  solid: "Solid",
  strong: "Strong",
};

/**
 * Per-skill mastery, grouped by domain. Level is stated in words next to the
 * bar, so the reading never depends on colour alone.
 */
export function SkillMasteryGrid({ skills }: { skills: SkillMastery[] }) {
  const byDomain = new Map<string, SkillMastery[]>();
  for (const skill of skills) {
    byDomain.set(skill.domain, [...(byDomain.get(skill.domain) ?? []), skill]);
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {[...byDomain.entries()].map(([domain, domainSkills]) => (
        <section key={domain}>
          <h3 className="text-label font-medium uppercase tracking-[0.04em] text-ink-muted">
            {domain}
          </h3>
          <ul className="mt-3 space-y-3">
            {domainSkills.map((skill) => (
              <li key={skill.skill} className="border-b border-line pb-3 last:border-0 last:pb-0">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-[14px] text-ink">{skill.skill}</span>
                  <span className="shrink-0 text-meta tabular-nums text-ink-muted">
                    {formatPercent(skill.accuracy)}
                  </span>
                </div>
                <ProgressBar
                  value={skill.accuracy}
                  className="mt-2"
                  label={`${skill.skill} accuracy`}
                />
                <p className="mt-1.5 text-meta text-ink-muted">
                  <span
                    className={cn(
                      skill.level === "needs_work" && "text-incorrect",
                      skill.level === "strong" && "text-correct",
                    )}
                  >
                    {LEVEL_LABELS[skill.level]}
                  </span>
                  {" · "}
                  {skill.attempted} question{skill.attempted === 1 ? "" : "s"}
                  {" · "}
                  {skill.averageTimeSeconds}s average
                </p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
