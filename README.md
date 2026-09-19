# MOGSAT — Digital SAT preparation platform

Stage 1: the frontend shell. Every screen is built and navigable, running entirely on
mock data. There is no backend, no database and no authentication yet — Stage 2 adds
those behind the data layer boundary described below, without components changing.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint       # eslint, including the data layer boundary rule
npm run typecheck  # tsc --noEmit
```

## Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + React 19, TypeScript |
| Styling | Tailwind CSS v4, design tokens as CSS variables in `app/globals.css` |
| Components | shadcn-pattern primitives in `components/ui` (cva + Radix), hand-styled to the token set |
| Icons | lucide-react, at 16px or 20px only |
| Charts | recharts |
| Theming | next-themes, class strategy |

## Route map

### Public — `app/(marketing)`
Bare centred layout, no app chrome.

| Route | What it is |
|---|---|
| `/` | Landing page: what the platform does, the eight domains, screenshot placeholders, call to action |
| `/login` | Log-in form. Client-side validation UI only |
| `/signup` | Sign-up form. Client-side validation UI only |

### Student — `app/(app)`
Persistent 240px sidebar, top bar with search, the dev role switcher and the theme toggle.
The content area scrolls independently.

| Route | What it is |
|---|---|
| `/dashboard` | Estimated score with range, accuracy by domain, study streak, next recommended drill, assigned work, recent sessions |
| `/question-bank` | Filterable, paginated bank. Sidebar filters: section, domain, skill, difficulty, status. A tab switches to the saved and flagged view |
| `/question-bank/[id]` | Full question view: choices, submit, then the correct answer and explanation |
| `/practice` | Two modes — drills (skill, 10/20/30 questions, timed or untimed) and full-length practice tests — plus past sessions |
| `/review/[sessionId]` | Score, per-domain breakdown, and every question with your answer, the correct answer, the explanation and time spent |
| `/progress` | Score trend, accuracy by domain, average time per question, hardest skills, total solved, activity heatmap, skill mastery |
| `/settings` | Profile, target score, test date, notification preferences |

### Test-taking — `app/(exam)`
Deliberately outside the app shell: no sidebar, full width.

| Route | What it is |
|---|---|
| `/practice/session/[id]` | The test screen (below) |

`/practice` and `/practice/session/[id]` resolve from different route groups. That is how
the test screen opts out of the sidebar layout while keeping the URL it should have.

### Admin (tutors) — `app/(app)/admin`
Same sidebar with admin nav items, and a top bar marked by a 1px `--ink` bottom border
instead of `--line`, so it is always clear which side of the app you are on.

| Route | What it is |
|---|---|
| `/admin` | Cohort overview: totals, active this week, average score change, who is falling behind, upcoming deadlines |
| `/admin/students` | Searchable, sortable table: name, target, estimated score, solved, accuracy, last active, assigned work |
| `/admin/students/[id]` | One student in full: everything from `/progress`, plus session history, per-skill mastery and tutor notes |
| `/admin/assignments` | Create an assignment (skill or hand-picked questions, due date, one student or a group) and track completion |
| `/admin/questions` | Question bank management: filterable table, create / edit / delete forms, bulk import placeholder |
| `/admin/analytics` | Cohort stats: weakest domains, skill gaps, score distribution, weekly volume, question-level difficulty |

## The data layer boundary

**This is the part that matters for Stage 2.**

`lib/data.ts` is the only module components may read data from. Every function is `async`
and returns serializable data, even though Stage 1 resolves synchronously from fixtures:

```ts
export async function getQuestions(filters: QuestionFilters): Promise<Paginated<QuestionWithState>>
export async function getStudentProgress(studentId?: string): Promise<StudentProgress>
export async function getSessionReview(id: string): Promise<SessionReview | null>
export async function getCohortAnalytics(): Promise<CohortAnalytics>
// …and the rest
```

The rules:

- Components import from `@/lib/data`, **never** from `@/lib/mock/*`. This is enforced by a
  `no-restricted-imports` rule in `eslint.config.mjs`, so a violation fails `npm run lint`
  rather than being caught in review.
- Filtering, sorting, pagination and aggregation all happen inside `lib/data.ts`, because in
  Stage 2 they move into SQL. The question bank puts its filters in the URL for that reason:
  changing a filter re-runs the server component and re-queries the data layer instead of
  filtering an already-downloaded list in the browser.
- `lib/types.ts` is the contract. Dates are ISO strings, never `Date` objects, so everything
  crosses the server/client boundary cleanly.

```
components  ──►  lib/data.ts  ──►  lib/mock/*      (Stage 1)
                      │
                      └────────►  Supabase         (Stage 2, same signatures)
```

### Mock data

All of it lives in `lib/mock/` and is imported only by `lib/data.ts`.

| File | Contents |
|---|---|
| `questions.ts` | **48 questions**, six in each of the eight domains, mixed difficulty, including multiple-choice and student-produced responses, three with data tables and two with described figures |
| `students.ts` | **8 students** across three standings, two tutors |
| `sessions.ts` | **15 sessions** — 13 completed, 2 not yet started (what the practice hub launches) |
| `assignments.ts` | 6 assignments with per-student completion, plus tutor notes |
| `progress.ts` | Score trend, domain accuracy, skill mastery and a year of activity, synthesized per student |
| `question-state.ts` | What the demo student has done with each question, derived from their sessions |
| `clock.ts` | The fixed "today" the fixtures are anchored to, and the seeded PRNG |
| `user.ts` | The two identities the dev role switcher selects between |

Two deliberate properties:

- **Everything is deterministic.** No `Math.random()` and no live `Date.now()` in rendered
  data. A seeded PRNG keyed on record ids, plus a fixed `MOCK_TODAY`, means the server and
  the client always agree (no hydration mismatches) and screenshots are reproducible.
- **All question content is original.** Every stem, passage, answer choice and explanation
  was written for this project. Nothing is copied or adapted from the College Board, Khan
  Academy, Barron's or any other publisher; named researchers, authors and studies are
  invented. Domain and skill names are factual taxonomy labels.

## The test-taking screen

Modelled on the digital testing app, laptop first.

- Fixed 56px top bar: section and module, the countdown with a hide toggle, question counter,
  and — in Math only — the calculator panel and reference sheet.
- Fixed 64px bottom bar: student name, the question navigator popover, Back and Next.
- **Reading and Writing** is a 50/50 split with a 1px divider, the passage in Newsreader at
  17px/1.7 capped at 62ch. **Math** is a single 720px centred column with the expression on
  its own line. Below the tablet breakpoint the split stacks.
- Tools: mark for review, cross out answer choices with an undo control, highlight passage
  text, calculator slot, reference sheet modal.
- Student-produced responses take a text input instead of choices, and accept equivalent
  forms (`0.5`, `.5`, `1/2`).
- Running out of time on a module advances the test, as the real one does.

### Practice test length

A full-length test here is **demo length**: four modules — Reading and Writing 1 and 2, then
Math 1 and 2 — of 8 questions each, with the real per-module timers scaled down in
proportion (10 minutes for Reading and Writing, 13 for Math). Every module boundary and
transition behaves exactly as the real test does; only the count is reduced, so the
48-question bank covers a whole run with no repeats. The UI labels this so it is not
mistaken for the real 98-question test. Stage 2 restores the real 27/27/22/22 structure.

Because the bank is small, a drill widens from the chosen skill to its domain and then to
its section to reach the requested count without repeating a question.

## Design system

Tokens are CSS variables on `:root` and `.dark` in `app/globals.css`, exposed to Tailwind
through `@theme inline` so `bg-paper`, `text-ink-muted`, `border-line` and friends exist as
utilities and switch with the theme automatically.

- **Type**: Instrument Sans for the interface (400/500/600 only); Newsreader for math
  expressions and Reading and Writing passages. No third typeface. Dashboard and score
  numbers use tabular figures.
- **Math** renders on its own line in the serif face with variables italic and digits and
  operators upright, via a small in-repo notation (`x^2`, `2^(x+3)`) rather than a LaTeX
  dependency — see `components/MathExpression.tsx`.
- **Shape**: 4px radius on inputs, buttons and choices; 8px on cards and modals; nothing more
  rounded except small domain badges. 1px `--line` borders. One shadow, on modals and
  popovers only.
- **Spacing** uses 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 (Tailwind steps 1 2 3 4 6 8 12 16).
  Structural dimensions outside that scale — the 240px sidebar, the 56px and 64px bars, the
  720px math column — use explicit values. The scale is a convention followed in the code and
  documented in `globals.css`, not a hard config restriction: Tailwind v4 silently drops
  unknown utilities rather than erroring, so deleting the default scale would turn a typo
  into an invisible missing style instead of a build failure.
- **Colour**: the accent is used for at most one element per screen region; everything else
  is ink, muted ink and line. No gradients, no colour beyond the token set.
- **Motion**: a single `transition-ui` utility, 150ms ease-out on background-color,
  border-color, colour and opacity only. Nothing animates layout. All transitions are
  disabled under `prefers-reduced-motion`.

### Component library — `components/`

The shared set: `QuestionCard`, `QuestionViewer`, `ChoiceList`, `Timer`, `QuestionNavigator`,
`DomainBadge`, `ProgressRing`, `ScoreTrendChart`, `DomainAccuracyChart`, `StudentTable`,
`FilterSidebar`, `EmptyState`.

Alongside them: `MathExpression`, `CalendarHeatmap`, `SkillMasteryGrid`, `TimePerQuestionChart`,
`Pagination`, `PageHeader`/`StatTile`, the exam pieces in `components/exam/` (screen,
reference sheet, calculator panel, annotated passage), and the shell in `components/shell/`.

Every list, table and chart has an `EmptyState` path and a `loading.tsx` skeleton.

### Accessibility

- Answer choices are a `radiogroup` with a roving tabindex: arrow keys move, Space and Enter
  select, and crossing out is a separate labelled control so it never steals selection.
- The question navigator is a `role="grid"` whose cells announce position and state together
  ("Question 7, answered, marked for review").
- Visible 2px accent focus ring on everything focusable; a skip link to the main content.
- Every icon-only button carries an accessible name.
- All token pairs meet WCAG AA in both themes (body text ≥ 4.5:1, UI and graphics ≥ 3:1).
- Status is never carried by colour alone — mastery levels, correctness and flags are all
  labelled in words or icons as well.

## What Stage 2 adds

1. **Supabase auth** replacing the dev role switcher in the top bar and the `RoleGate` on the
   admin routes, with a real server-side role check.
2. **Postgres tables** mirroring `lib/types.ts`: `questions`, `question_attempts`, `students`,
   `sessions`, `session_modules`, `session_results`, `assignments`, `assignment_targets`,
   `student_notes`, `profiles`.
3. **Row-level security**: a student reads only their own attempts, sessions and assignments;
   a tutor reads only the students assigned to them.
4. **Real persistence** of attempts as they happen, which deletes `lib/session-store.ts` (the
   sessionStorage overlay that currently lets a just-finished test show your own answers on
   the review page) and makes `getSessionReview` read real rows.
5. **Writes** behind the forms that currently validate and preview only: assignment creation,
   question create / edit / delete, bulk import, settings and tutor notes.
6. **The full-length test**: real 27/27/22/22 modules and timers, and real adaptive module-2
   selection, once the bank is large enough.

Not in scope for either stage yet: payments.

## Deliberately not built in Stage 1

Authentication, payments, real persistence, API routes, and scoring beyond the simple linear
model in `lib/scoring.ts`.
