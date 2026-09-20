-- Row level security.
--
-- Content is readable by any signed-in user and writable only by admins.
-- Everything student-scoped is readable and writable only by that student,
-- plus their assigned tutor and admins for read.
--
-- auth.uid() is wrapped in a scalar subquery throughout so Postgres evaluates it
-- once per statement instead of once per row.

alter table public.trap_types          enable row level security;
alter table public.mistake_categories  enable row level security;
alter table public.questions           enable row level security;
alter table public.answer_choices      enable row level security;
alter table public.profiles            enable row level security;
alter table public.test_sessions       enable row level security;
alter table public.session_modules     enable row level security;
alter table public.session_questions   enable row level security;
alter table public.question_attempts   enable row level security;
alter table public.question_bookmarks  enable row level security;
alter table public.error_log_entries   enable row level security;

-- ---------------------------------------------------------------- lookups --

create policy "lookups readable by authenticated"
  on public.trap_types for select to authenticated using (true);

create policy "categories readable by authenticated"
  on public.mistake_categories for select to authenticated using (true);

-- --------------------------------------------------------------- content --

create policy "questions readable by authenticated"
  on public.questions for select to authenticated using (true);

create policy "questions writable by admins"
  on public.questions for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "choices readable by authenticated"
  on public.answer_choices for select to authenticated using (true);

create policy "choices writable by admins"
  on public.answer_choices for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- -------------------------------------------------------------- profiles --

create policy "read own profile"
  on public.profiles for select to authenticated
  using (
    id = (select auth.uid())
    or (select public.is_admin())
    or (select public.is_tutor_of(id))
  );

create policy "update own profile"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- --------------------------------------------------------------- sessions --

create policy "own sessions"
  on public.test_sessions for all to authenticated
  using (
    user_id = (select auth.uid())
    or (select public.is_admin())
    or (select public.is_tutor_of(user_id))
  )
  with check (user_id = (select auth.uid()));

-- Modules and their questions inherit ownership from the parent session.
create policy "own session modules"
  on public.session_modules for all to authenticated
  using (exists (
    select 1 from public.test_sessions s
    where s.id = session_id
      and (
        s.user_id = (select auth.uid())
        or (select public.is_admin())
        or (select public.is_tutor_of(s.user_id))
      )
  ))
  with check (exists (
    select 1 from public.test_sessions s
    where s.id = session_id and s.user_id = (select auth.uid())
  ));

create policy "own session questions"
  on public.session_questions for all to authenticated
  using (exists (
    select 1 from public.test_sessions s
    where s.id = session_id
      and (
        s.user_id = (select auth.uid())
        or (select public.is_admin())
        or (select public.is_tutor_of(s.user_id))
      )
  ))
  with check (exists (
    select 1 from public.test_sessions s
    where s.id = session_id and s.user_id = (select auth.uid())
  ));

-- --------------------------------------------------- attempts and progress --

create policy "own attempts"
  on public.question_attempts for all to authenticated
  using (
    user_id = (select auth.uid())
    or (select public.is_admin())
    or (select public.is_tutor_of(user_id))
  )
  with check (user_id = (select auth.uid()));

create policy "own bookmarks"
  on public.question_bookmarks for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "own error log"
  on public.error_log_entries for all to authenticated
  using (
    user_id = (select auth.uid())
    or (select public.is_admin())
    or (select public.is_tutor_of(user_id))
  )
  with check (user_id = (select auth.uid()));
