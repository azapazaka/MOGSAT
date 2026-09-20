-- The Error Log.
--
-- Design decision that matters: ONE row per (user_id, question_id), upserted.
-- Missing the same question twice increments `times_missed` rather than adding a
-- second row. That is what prevents duplicates, and it makes "Repeated Mistakes"
-- a plain `where times_missed > 1` instead of a grouping query.

create table public.mistake_categories (
  code        text primary key,
  label       text not null,
  description text,
  position    smallint not null
);

insert into public.mistake_categories (code, label, description, position) values
  ('concept_gap',      'Concept Gap',          'The underlying skill is not solid yet.', 1),
  ('careless',         'Careless Mistake',     'Knew it, slipped anyway.', 2),
  ('misread_question', 'Misread Question',     'Answered something the question did not ask.', 3),
  ('misread_passage',  'Misread Passage',      'Misunderstood what the text actually said.', 4),
  ('strategy',         'Strategy Mistake',     'Wrong approach, even though the maths or reading was fine.', 5),
  ('time_pressure',    'Time Pressure',        'Rushed because the clock was running out.', 6),
  ('vocabulary',       'Vocabulary / Language','A word or phrase blocked the meaning.', 7),
  ('calculation',      'Calculation Error',    'Right method, wrong arithmetic.', 8),
  ('distractor_trap',  'Distractor / Trap',    'Picked an answer built to be tempting.', 9),
  ('guess',            'Guess',                'No real basis for the choice.', 10);

create table public.error_log_entries (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  question_id      text not null references public.questions(id) on delete cascade,

  -- Inferred on first miss, then freely editable by the student.
  mistake_category text not null default 'concept_gap'
                     references public.mistake_categories(code),
  -- Snapshot of the trap the chosen wrong answer represented.
  trap_type        text references public.trap_types(code),

  selected_answer  text,
  note             text,

  times_missed     integer not null default 1,
  retry_count      integer not null default 0,
  first_missed_at  timestamptz not null default now(),
  last_missed_at   timestamptz not null default now(),
  -- Set when the student later answers the same question correctly.
  corrected_at     timestamptz,

  unique (user_id, question_id)
);

create index error_log_user_idx      on public.error_log_entries (user_id, last_missed_at desc);
create index error_log_repeated_idx  on public.error_log_entries (user_id, times_missed desc);
create index error_log_category_idx  on public.error_log_entries (user_id, mistake_category);

-- Recording an attempt and updating the Error Log must happen together, or the
-- two can drift. One RPC does both atomically; the app never writes either
-- table directly.
create or replace function public.record_attempt(
  p_question_id  text,
  p_is_correct   boolean,
  p_selected     text default null,
  p_time_spent   integer default 0,
  p_mode         public.practice_mode default 'bank',
  p_session_id   uuid default null,
  p_eliminated   text[] default '{}',
  p_flagged      boolean default false
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user     uuid := (select auth.uid());
  v_attempt  uuid;
  v_trap     text;
begin
  if v_user is null then
    raise exception 'record_attempt requires an authenticated user';
  end if;

  insert into public.question_attempts (
    user_id, question_id, session_id, mode,
    selected_answer, is_correct, time_spent_seconds, eliminated, flagged
  )
  values (
    v_user, p_question_id, p_session_id, p_mode,
    p_selected, p_is_correct, greatest(p_time_spent, 0), coalesce(p_eliminated, '{}'), p_flagged
  )
  returning id into v_attempt;

  if p_is_correct then
    -- A later correct answer closes an open Error Log entry.
    update public.error_log_entries
       set corrected_at = now(),
           retry_count  = retry_count + 1
     where user_id = v_user
       and question_id = p_question_id
       and corrected_at is null;
  else
    -- Which trap did the chosen answer represent?
    select ac.trap_type into v_trap
      from public.answer_choices ac
     where ac.question_id = p_question_id
       and ac.label = p_selected
     limit 1;

    insert into public.error_log_entries (
      user_id, question_id, trap_type, selected_answer, mistake_category
    )
    values (
      v_user, p_question_id, v_trap, p_selected,
      case when v_trap is null then 'concept_gap' else 'distractor_trap' end
    )
    on conflict (user_id, question_id) do update
      set times_missed    = public.error_log_entries.times_missed + 1,
          last_missed_at  = now(),
          selected_answer = excluded.selected_answer,
          trap_type       = coalesce(excluded.trap_type, public.error_log_entries.trap_type),
          -- Missing it again reopens the entry.
          corrected_at    = null;
  end if;

  return v_attempt;
end;
$$;

comment on function public.record_attempt is
  'Records one attempt and keeps the Error Log in step atomically. Upserts by (user, question) so repeats increment times_missed instead of duplicating.';
