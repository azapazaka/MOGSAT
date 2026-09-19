"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2, Upload } from "lucide-react";
import type { Difficulty, Domain, Question, Section } from "@/lib/types";
import {
  ALL_DOMAINS,
  DIFFICULTIES,
  DIFFICULTY_LABELS,
  SECTION_LABELS,
  SKILLS_BY_DOMAIN,
  domainSection,
} from "@/lib/taxonomy";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EmptyState } from "@/components/EmptyState";
import { DifficultyBadge, DomainBadge } from "@/components/DomainBadge";

/**
 * Question bank management. The create, edit and delete forms validate and
 * preview but do not write: Stage 1 has no persistence. Stage 2 points the same
 * three handlers at Supabase inserts, updates and soft deletes.
 */
export function QuestionAdminTable({ questions }: { questions: Question[] }) {
  const [query, setQuery] = useState("");
  const [section, setSection] = useState<Section | "all">("all");
  const [domain, setDomain] = useState<Domain | "all">("all");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [pendingDelete, setPendingDelete] = useState<Question | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return questions.filter((question) => {
      if (section !== "all" && question.section !== section) return false;
      if (domain !== "all" && question.domain !== domain) return false;
      if (difficulty !== "all" && question.difficulty !== difficulty) return false;
      if (needle && !`${question.id} ${question.stem} ${question.skill}`.toLowerCase().includes(needle)) {
        return false;
      }
      return true;
    });
  }, [questions, query, section, domain, difficulty]);

  return (
    <div className="space-y-6">
      {notice ? (
        <p role="status" className="rounded-input border border-line bg-paper p-3 text-meta text-ink-muted">
          {notice}
        </p>
      ) : null}

      <div className="flex flex-wrap items-end gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search
            size={16}
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search id, stem or skill"
            aria-label="Search questions"
            className="pl-9"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="admin-section">Section</Label>
          <Select
            id="admin-section"
            value={section}
            onChange={(event) => setSection(event.target.value as Section | "all")}
            className="w-[180px]"
          >
            <option value="all">All sections</option>
            <option value="math">Math</option>
            <option value="rw">Reading and Writing</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="admin-domain">Domain</Label>
          <Select
            id="admin-domain"
            value={domain}
            onChange={(event) => setDomain(event.target.value as Domain | "all")}
            className="w-[220px]"
          >
            <option value="all">All domains</option>
            {ALL_DOMAINS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="admin-difficulty">Difficulty</Label>
          <Select
            id="admin-difficulty"
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value as Difficulty | "all")}
            className="w-[140px]"
          >
            <option value="all">Any</option>
            {DIFFICULTIES.map((option) => (
              <option key={option} value={option}>
                {DIFFICULTY_LABELS[option]}
              </option>
            ))}
          </Select>
        </div>

        <div className="ml-auto flex items-end gap-3">
          <Button
            variant="secondary"
            onClick={() =>
              setNotice(
                "Bulk import accepts a CSV of questions. The parser and validation arrive in Stage 2.",
              )
            }
          >
            <Upload size={16} />
            Bulk import
          </Button>
          <QuestionFormDialog
            mode="create"
            trigger={
              <Button variant="primary">
                <Plus size={16} />
                New question
              </Button>
            }
            onSubmit={(summary) => setNotice(summary)}
          />
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No questions match these filters"
          description="Widen the section, domain or difficulty, or clear the search."
        />
      ) : (
        <>
          <p className="text-meta tabular-nums text-ink-muted">
            {rows.length} of {questions.length} questions
          </p>
          <Table>
            <THead>
              <TR className="border-b-0">
                <TH>Id</TH>
                <TH>Stem</TH>
                <TH>Domain</TH>
                <TH>Skill</TH>
                <TH>Difficulty</TH>
                <TH>Type</TH>
                <TH>
                  <span className="sr-only">Actions</span>
                </TH>
              </TR>
            </THead>
            <TBody>
              {rows.map((question) => (
                <TR key={question.id}>
                  <TD className="font-mono text-meta text-ink-muted">{question.id}</TD>
                  <TD className="max-w-[320px]">
                    <span className="line-clamp-2 text-[14px]">{question.stem}</span>
                  </TD>
                  <TD>
                    <DomainBadge domain={question.domain} />
                  </TD>
                  <TD className="text-meta text-ink-muted">{question.skill}</TD>
                  <TD>
                    <DifficultyBadge difficulty={question.difficulty} />
                  </TD>
                  <TD className="text-meta text-ink-muted">
                    {question.type === "multiple_choice" ? "Multiple choice" : "Student response"}
                  </TD>
                  <TD>
                    <div className="flex items-center justify-end gap-2">
                      <QuestionFormDialog
                        mode="edit"
                        question={question}
                        trigger={
                          <Button variant="ghost" size="sm" aria-label={`Edit ${question.id}`}>
                            <Pencil size={16} />
                          </Button>
                        }
                        onSubmit={(summary) => setNotice(summary)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label={`Delete ${question.id}`}
                        onClick={() => setPendingDelete(question)}
                      >
                        <Trash2 size={16} className="text-incorrect" />
                      </Button>
                    </div>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </>
      )}

      <Dialog open={Boolean(pendingDelete)} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <DialogContent className="max-w-[480px]">
          <DialogTitle>Delete this question?</DialogTitle>
          <DialogDescription>
            {pendingDelete?.id} would be removed from the bank. Sessions that already used it keep
            their record.
          </DialogDescription>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setNotice(`${pendingDelete?.id} would be deleted. Writes arrive in Stage 2.`);
                setPendingDelete(null);
              }}
            >
              Delete question
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function QuestionFormDialog({
  mode,
  question,
  trigger,
  onSubmit,
}: {
  mode: "create" | "edit";
  question?: Question;
  trigger: React.ReactNode;
  onSubmit: (summary: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [domain, setDomain] = useState<Domain>(question?.domain ?? "Algebra");
  const [skill, setSkill] = useState(question?.skill ?? SKILLS_BY_DOMAIN.Algebra[0]);
  const [difficulty, setDifficulty] = useState<Difficulty>(question?.difficulty ?? "medium");
  const [stem, setStem] = useState(question?.stem ?? "");
  const [explanation, setExplanation] = useState(question?.explanation ?? "");

  const valid = stem.trim().length > 10 && explanation.trim().length > 10;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogTitle>{mode === "create" ? "New question" : `Edit ${question?.id}`}</DialogTitle>
        <DialogDescription>
          Original content only. Nothing here may be copied from a published question bank.
        </DialogDescription>

        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (!valid) return;
            onSubmit(
              mode === "create"
                ? `A new ${DIFFICULTY_LABELS[difficulty].toLowerCase()} question in ${domain} would be created. Writes arrive in Stage 2.`
                : `${question?.id} would be updated. Writes arrive in Stage 2.`,
            );
            setOpen(false);
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`${mode}-domain`}>Domain</Label>
              <Select
                id={`${mode}-domain`}
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
              <Label htmlFor={`${mode}-skill`}>Skill</Label>
              <Select id={`${mode}-skill`} value={skill} onChange={(event) => setSkill(event.target.value)}>
                {SKILLS_BY_DOMAIN[domain].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${mode}-difficulty`}>Difficulty</Label>
            <Select
              id={`${mode}-difficulty`}
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value as Difficulty)}
            >
              {DIFFICULTIES.map((option) => (
                <option key={option} value={option}>
                  {DIFFICULTY_LABELS[option]}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${mode}-stem`}>Question stem</Label>
            <Textarea
              id={`${mode}-stem`}
              rows={3}
              value={stem}
              onChange={(event) => setStem(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${mode}-explanation`}>Explanation</Label>
            <Textarea
              id={`${mode}-explanation`}
              rows={4}
              value={explanation}
              onChange={(event) => setExplanation(event.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={!valid}>
              {mode === "create" ? "Create question" : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
