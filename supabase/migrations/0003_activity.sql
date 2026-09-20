-- Everything a student does: sessions they sit, questions they attempt, and
-- the questions they save or flag. `question_attempts` is the append-only event
-- log that accuracy, timing, the Error Log and every insight derive from.

create type public.practice_mode as enum ('bank', 'drill', 'test');
create type public.session_kind  as enum ('drill', 'practice_test');

create table public.test_sessions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  kind          public.session_kind not null,
  title         text not null,
  timed         boolean not null default true,
  started_at    timestamptz not null default now(),
  completed_at  timestamptz,
  score_total   integer,
  score_math    integer,
  score_rw      integer,
  created_at    timestamptz not null default now()
);

-- Reading and Writing Module 1 and 2, then Math Module 1 and 2. The module is a
-- first-class row so the adaptive structure is in the schema, not in app code.
create table public.session_modules (
  id               uuid primary key default gen_random_uuid(),
  session_id       uuid not null references public.test_sessions(id) on delete cascade,
  label            text not null,
  section          public.section not null,
  module_order     smallint not null check (module_order in (1, 2)),
  duration_seconds integer not null default 0,
  position         smallint not null,
  unique (session_id, position)
);

create table public.session_questions (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references public.test_sessions(id) on delete cascade,
  module_id   uuid not null references public.session_modules(id) on delete cascade,
  question_id text not null references public.questions(id) on delete restrict,
  position    smallint not null,
  unique (module_id, position),
  unique (session_id, question_id)
);

create table public.question_attempts (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.profiles(id) on delete cascade,
  question_id         text not null references public.questions(id) on delete cascade,
  session_id          uuid references public.test_sessions(id) on delete set null,
  mode                public.practice_mode not null default 'bank',
  -- A choice label (A-D) for multiple choice, the typed entry for an SPR, or
  -- null when the question was skipped.
  selected_answer     text,
  is_correct          boolean not null,
  time_spent_seconds  integer not null default 0,
  eliminated          text[] not null default '{}',
  flagged             boolean not null default false,
  created_at          timestamptz not null default now()
);

create table public.question_bookmarks (
  user_id     uuid not null references public.profiles(id) on delete cascade,
  question_id text not null references public.questions(id) on delete cascade,
  saved       boolean not null default false,
  flagged     boolean not null default false,
  updated_at  timestamptz not null default now(),
  primary key (user_id, question_id)
);

create index test_sessions_user_idx      on public.test_sessions (user_id, started_at desc);
create index session_modules_session_idx on public.session_modules (session_id, position);
create index session_questions_sess_idx  on public.session_questions (session_id, position);
create index attempts_user_time_idx      on public.question_attempts (user_id, created_at desc);
create index attempts_user_question_idx  on public.question_attempts (user_id, question_id);
create index attempts_session_idx        on public.question_attempts (session_id);
create index bookmarks_user_idx          on public.question_bookmarks (user_id);
