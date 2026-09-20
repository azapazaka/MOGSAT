-- Content tables: the question bank itself.
-- Readable by every signed-in student; writable only by admins (see 0005_rls.sql).

create type public.section as enum ('math', 'rw');
create type public.difficulty as enum ('easy', 'medium', 'hard');
create type public.question_type as enum ('multiple_choice', 'student_produced_response');

-- Lookup rather than an enum so new traps are an INSERT, not a migration.
create table public.trap_types (
  code        text primary key,
  label       text not null,
  description text
);

comment on table public.trap_types is
  'The reusable catalogue of wrong-answer traps. Referenced by answer_choices.trap_type.';

insert into public.trap_types (code, label, description) values
  ('too_broad',            'Too broad',            'Goes further than the evidence supports.'),
  ('too_narrow',           'Too narrow',           'Covers only part of what the question asks for.'),
  ('unsupported',          'Unsupported',          'Nothing in the passage or setup establishes this.'),
  ('opposite',             'Opposite',             'States the reverse of the correct relationship.'),
  ('partially_correct',    'Partially correct',    'Half of it is right, which is what makes it tempting.'),
  ('misread_question',     'Misread the question', 'Answers a question that was not asked.'),
  ('true_but_irrelevant',  'True but irrelevant',  'Accurate according to the text, but not an answer to this question.'),
  ('calculation_error',    'Calculation error',    'The result of a predictable arithmetic slip.'),
  ('sign_error',           'Sign error',           'Correct magnitude, wrong sign.'),
  ('wrong_formula',        'Wrong formula',        'Applies a formula that does not fit the situation.'),
  ('wrong_variable',       'Wrong variable',       'Solves for a related quantity instead of the one asked for.'),
  ('scope_error',          'Scope error',          'Applies to the wrong part of the passage or the wrong interval.'),
  ('extreme_language',     'Extreme language',     'Overstated wording the text never justifies.'),
  ('outside_passage',      'Outside the passage',  'Brings in outside knowledge the text does not contain.'),
  ('grammar_violation',    'Grammar rule violation', 'Breaks a specific convention of Standard English.'),
  ('common_misconception', 'Common misconception', 'Built from a mistake students reliably make.'),
  ('incomplete_step',      'Incomplete step',      'Stops one step before the final answer.');

create table public.questions (
  id                      text primary key,
  section                 public.section not null,
  domain                  text not null,
  skill                   text not null,
  difficulty              public.difficulty not null,
  question_type           public.question_type not null default 'multiple_choice',

  stem                    text not null,
  passage                 text,
  passage_secondary       text,
  expression              text,
  table_data              jsonb,
  figure                  jsonb,

  correct_answer          text not null,
  accepted_answers        text[] not null default '{}',

  -- Teaching payload. `explanation` is why the correct answer is correct;
  -- per-choice reasoning lives in answer_choices.
  explanation             text not null default '',
  common_trap             text,
  strategy                text,
  one_rule                text,
  difficulty_reason       text,

  -- Math-specific
  calculator_allowed      boolean not null default true,
  formula_relevant        text,
  graph_required          boolean not null default false,
  desmos_strategy         text,

  -- Reading and Writing specific
  rhetorical_context      text,
  grammar_rule            text,
  evidence_relationship   text,

  source                  text,
  tags                    text[] not null default '{}',
  estimated_time_seconds  integer not null default 75,

  -- Anything an import carries that this schema does not model yet, kept so a
  -- future migration can promote it to a real column without re-importing.
  raw                     jsonb,

  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create table public.answer_choices (
  id           uuid primary key default gen_random_uuid(),
  question_id  text not null references public.questions(id) on delete cascade,
  label        text not null check (label in ('A', 'B', 'C', 'D')),
  text         text not null,
  expression   text,
  is_correct   boolean not null default false,
  -- Why THIS choice is right or wrong. The heart of the learning mode.
  explanation  text,
  trap_type    text references public.trap_types(code),
  unique (question_id, label)
);

comment on column public.answer_choices.explanation is
  'Why this specific choice is correct or incorrect. Every choice gets one, not just the key.';

create index questions_taxonomy_idx on public.questions (section, domain, skill, difficulty);
create index questions_skill_idx    on public.questions (skill);
create index questions_tags_idx     on public.questions using gin (tags);
create index answer_choices_qid_idx on public.answer_choices (question_id);

-- Keep updated_at honest.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger questions_touch_updated_at
  before update on public.questions
  for each row execute function public.touch_updated_at();
