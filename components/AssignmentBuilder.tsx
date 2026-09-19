"use client";

import { useState } from "react";
import type { Student } from "@/lib/types";
import { ALL_DOMAINS, SKILLS_BY_DOMAIN, domainSection, SECTION_LABELS } from "@/lib/taxonomy";
import type { Domain } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

/**
 * Assignment creation. Stage 1 validates and previews; Stage 2 inserts an
 * `assignments` row plus one `assignment_targets` row per student.
 */
export function AssignmentBuilder({ students }: { students: Student[] }) {
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [mode, setMode] = useState<"skill" | "questions">("skill");
  const [domain, setDomain] = useState<Domain>("Algebra");
  const [skill, setSkill] = useState(SKILLS_BY_DOMAIN.Algebra[0]);
  const [questionCount, setQuestionCount] = useState("10");
  const [questionIds, setQuestionIds] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignees, setAssignees] = useState<string[]>([]);
  const [created, setCreated] = useState<string | null>(null);

  const toggleAssignee = (id: string) =>
    setAssignees((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );

  const valid = title.trim().length > 2 && dueDate !== "" && assignees.length > 0;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!valid) return;
    const names = students
      .filter((student) => assignees.includes(student.id))
      .map((student) => student.name);
    setCreated(
      `"${title.trim()}" would be assigned to ${names.length} student${names.length === 1 ? "" : "s"} (${names.join(", ")}), due ${dueDate}.`,
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="assignment-title">Title</Label>
          <Input
            id="assignment-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Circles and coordinate geometry"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="assignment-due">Due date</Label>
          <Input
            id="assignment-due"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="assignment-instructions">Instructions (optional)</Label>
        <Textarea
          id="assignment-instructions"
          rows={3}
          value={instructions}
          onChange={(event) => setInstructions(event.target.value)}
          placeholder="How should they approach this set?"
        />
      </div>

      <fieldset className="space-y-3">
        <legend className="mb-2 text-label font-medium uppercase tracking-[0.04em] text-ink-muted">
          Content
        </legend>
        <div className="flex gap-2">
          {[
            { value: "skill" as const, label: "By skill" },
            { value: "questions" as const, label: "Hand-pick questions" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={mode === option.value}
              onClick={() => setMode(option.value)}
              className={cn(
                "h-9 flex-1 rounded-input border text-[14px] transition-ui",
                mode === option.value
                  ? "border-accent bg-accent-soft text-ink"
                  : "border-line text-ink-muted hover:border-ink-muted hover:text-ink",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        {mode === "skill" ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="assignment-domain">Domain</Label>
              <Select
                id="assignment-domain"
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
              <Label htmlFor="assignment-skill">Skill</Label>
              <Select
                id="assignment-skill"
                value={skill}
                onChange={(event) => setSkill(event.target.value)}
              >
                {SKILLS_BY_DOMAIN[domain].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignment-count">Questions</Label>
              <Input
                id="assignment-count"
                type="number"
                min={5}
                max={40}
                value={questionCount}
                onChange={(event) => setQuestionCount(event.target.value)}
                className="tabular-nums"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="assignment-questions">Question ids</Label>
            <Textarea
              id="assignment-questions"
              rows={3}
              value={questionIds}
              onChange={(event) => setQuestionIds(event.target.value)}
              placeholder="m-adv-02, m-adv-03, m-geo-04"
            />
            <p className="text-meta text-ink-muted">
              Stage 2 replaces this with a picker driven by the question bank filters.
            </p>
          </div>
        )}
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-label font-medium uppercase tracking-[0.04em] text-ink-muted">
          Assign to
        </legend>
        <div className="grid gap-1 sm:grid-cols-2">
          {students.map((student) => (
            <label
              key={student.id}
              className="flex cursor-pointer items-center gap-3 py-1 text-[14px] text-ink"
            >
              <Checkbox
                checked={assignees.includes(student.id)}
                onCheckedChange={() => toggleAssignee(student.id)}
              />
              <span className="flex-1">{student.name}</span>
              <span className="text-meta tabular-nums text-ink-muted">{student.currentScore}</span>
            </label>
          ))}
        </div>
        <div className="mt-3 flex gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setAssignees(students.map((student) => student.id))}
          >
            Select all
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setAssignees([])}>
            Clear
          </Button>
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" variant="primary" disabled={!valid}>
          Create assignment
        </Button>
        {!valid ? (
          <span className="text-meta text-ink-muted">
            A title, a due date and at least one student are required.
          </span>
        ) : null}
      </div>

      {created ? (
        <p role="status" className="rounded-input border border-line bg-paper p-3 text-meta text-ink-muted">
          {created} Writing assignments arrives in Stage 2.
        </p>
      ) : null}
    </form>
  );
}
