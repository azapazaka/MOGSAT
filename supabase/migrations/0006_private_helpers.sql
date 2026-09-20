-- Security fix flagged by the Supabase linter.
--
-- SECURITY DEFINER helpers living in `public` are published by PostgREST as
-- callable RPC endpoints (/rest/v1/rpc/is_admin), which lets any caller probe
-- them. PostgREST only exposes the schemas it is configured with, so moving the
-- helpers to a `private` schema removes them from the API surface while RLS
-- policies can still call them.
--
-- They must stay SECURITY DEFINER: is_admin() reads public.profiles, and a
-- policy ON profiles that queries profiles would recurse without it.

create schema if not exists private;

-- Policies are evaluated as the querying role, so authenticated needs to be
-- able to reach the functions even though the schema is not exposed.
grant usage on schema private to authenticated;

create or replace function private.is_admin()
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  );
$$;

create or replace function private.is_tutor_of(student uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = student and p.tutor_id = (select auth.uid())
  );
$$;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function private.is_admin()          from public, anon;
revoke all on function private.is_tutor_of(uuid)   from public, anon;
revoke all on function private.handle_new_user()   from public, anon, authenticated;
grant execute on function private.is_admin()        to authenticated;
grant execute on function private.is_tutor_of(uuid) to authenticated;

-- Repoint the signup trigger, then drop the public copies. Policies must be
-- recreated first: Postgres refuses to drop a function a policy depends on.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

drop policy "questions writable by admins" on public.questions;
create policy "questions writable by admins"
  on public.questions for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));

drop policy "choices writable by admins" on public.answer_choices;
create policy "choices writable by admins"
  on public.answer_choices for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));

drop policy "read own profile" on public.profiles;
create policy "read own profile"
  on public.profiles for select to authenticated
  using (
    id = (select auth.uid())
    or (select private.is_admin())
    or (select private.is_tutor_of(id))
  );

drop policy "own sessions" on public.test_sessions;
create policy "own sessions"
  on public.test_sessions for all to authenticated
  using (
    user_id = (select auth.uid())
    or (select private.is_admin())
    or (select private.is_tutor_of(user_id))
  )
  with check (user_id = (select auth.uid()));

drop policy "own session modules" on public.session_modules;
create policy "own session modules"
  on public.session_modules for all to authenticated
  using (exists (
    select 1 from public.test_sessions s
    where s.id = session_id
      and (
        s.user_id = (select auth.uid())
        or (select private.is_admin())
        or (select private.is_tutor_of(s.user_id))
      )
  ))
  with check (exists (
    select 1 from public.test_sessions s
    where s.id = session_id and s.user_id = (select auth.uid())
  ));

drop policy "own session questions" on public.session_questions;
create policy "own session questions"
  on public.session_questions for all to authenticated
  using (exists (
    select 1 from public.test_sessions s
    where s.id = session_id
      and (
        s.user_id = (select auth.uid())
        or (select private.is_admin())
        or (select private.is_tutor_of(s.user_id))
      )
  ))
  with check (exists (
    select 1 from public.test_sessions s
    where s.id = session_id and s.user_id = (select auth.uid())
  ));

drop policy "own attempts" on public.question_attempts;
create policy "own attempts"
  on public.question_attempts for all to authenticated
  using (
    user_id = (select auth.uid())
    or (select private.is_admin())
    or (select private.is_tutor_of(user_id))
  )
  with check (user_id = (select auth.uid()));

drop policy "own error log" on public.error_log_entries;
create policy "own error log"
  on public.error_log_entries for all to authenticated
  using (
    user_id = (select auth.uid())
    or (select private.is_admin())
    or (select private.is_tutor_of(user_id))
  )
  with check (user_id = (select auth.uid()));

drop function if exists public.is_admin();
drop function if exists public.is_tutor_of(uuid);
drop function if exists public.handle_new_user();
