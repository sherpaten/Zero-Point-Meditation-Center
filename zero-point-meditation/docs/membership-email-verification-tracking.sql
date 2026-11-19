-- ZPMC email verification tracking
-- Run once in Supabase SQL Editor after the membership email migration.
-- Safe to re-run.

alter table public.members
  add column if not exists email_confirmed_at timestamptz;

-- Backfill verification state from Supabase Auth.
update public.members as m
set email = u.email,
    email_confirmed_at = u.email_confirmed_at
from auth.users as u
where u.id = m.id
  and (
    m.email is distinct from u.email
    or m.email_confirmed_at is distinct from u.email_confirmed_at
  );

-- Keep the member profile synchronized with Auth email and verification changes.
create or replace function public.handle_new_zpmc_member()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  candidate_name text;
begin
  candidate_name := nullif(trim(new.raw_user_meta_data ->> 'full_name'), '');

  if candidate_name is null or char_length(candidate_name) < 2 then
    candidate_name := 'New member';
  end if;

  insert into public.members (
    id, full_name, email, email_confirmed_at, phone, country
  )
  values (
    new.id,
    left(candidate_name, 120),
    new.email,
    new.email_confirmed_at,
    nullif(trim(new.raw_user_meta_data ->> 'phone'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'country'), '')
  )
  on conflict (id) do update
  set email = excluded.email,
      email_confirmed_at = excluded.email_confirmed_at;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_zpmc_member on auth.users;

create trigger on_auth_user_created_zpmc_member
after insert or update of email, email_confirmed_at on auth.users
for each row
execute function public.handle_new_zpmc_member();

