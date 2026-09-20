-- Student and tutor profiles, keyed to Supabase Auth users.
-- Replaces the Stage 1 dev role switcher: role now comes from this table.

create type public.app_role as enum ('student', 'admin');

create table public.profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  email               text not null,
  name                text not null default '',
  role                public.app_role not null default 'student',

  target_score        integer not null default 1400,
  test_date           date,
  time_zone           text not null default 'UTC',

  -- Notification preferences, mirroring lib/types.ts NotificationPreferences.
  notify_study_reminders   boolean not null default true,
  notify_weekly_report     boolean not null default true,
  notify_assignment_alerts boolean not null default true,
  notify_tutor_messages    boolean not null default false,

  -- Tutor who monitors this student, when one is assigned.
  tutor_id            uuid references public.profiles(id) on delete set null,

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index profiles_tutor_idx on public.profiles (tutor_id);

create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

-- Every new auth user gets a profile automatically, so the app never has to
-- handle a signed-in user with no profile row.
create or replace function public.handle_new_user()
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

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- SECURITY DEFINER so RLS policies can ask "is this user an admin?" without
-- re-entering the policy on profiles and recursing forever.
create or replace function public.is_admin()
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

-- Is the current user the tutor assigned to this student?
create or replace function public.is_tutor_of(student uuid)
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
