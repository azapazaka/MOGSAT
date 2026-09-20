-- Performance fixes from the Supabase linter.
--
-- 1. Covering indexes for foreign keys. Without these, deleting a question or a
--    trap type forces a sequential scan of every referencing table, and the
--    joins the Error Log does on question_id have no index to use.
--    Note: attempts_user_question_idx is (user_id, question_id), so a lookup by
--    question_id alone cannot use it — the leading column is wrong.
--
-- 2. The admin policies were written FOR ALL, which includes SELECT, so every
--    read of questions ran both the "readable" policy and the admin check.
--    Splitting them into INSERT/UPDATE/DELETE leaves exactly one SELECT policy.

create index answer_choices_trap_idx      on public.answer_choices (trap_type);
create index error_log_question_idx       on public.error_log_entries (question_id);
create index error_log_trap_idx           on public.error_log_entries (trap_type);
create index error_log_mistake_cat_idx    on public.error_log_entries (mistake_category);
create index attempts_question_idx        on public.question_attempts (question_id);
create index bookmarks_question_idx       on public.question_bookmarks (question_id);
create index session_questions_qid_idx    on public.session_questions (question_id);

drop policy "questions writable by admins" on public.questions;

create policy "questions insertable by admins"
  on public.questions for insert to authenticated
  with check ((select private.is_admin()));

create policy "questions updatable by admins"
  on public.questions for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));

create policy "questions deletable by admins"
  on public.questions for delete to authenticated
  using ((select private.is_admin()));

drop policy "choices writable by admins" on public.answer_choices;

create policy "choices insertable by admins"
  on public.answer_choices for insert to authenticated
  with check ((select private.is_admin()));

create policy "choices updatable by admins"
  on public.answer_choices for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));

create policy "choices deletable by admins"
  on public.answer_choices for delete to authenticated
  using ((select private.is_admin()));
