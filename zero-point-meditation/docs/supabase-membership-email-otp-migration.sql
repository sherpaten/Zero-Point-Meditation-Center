-- ZPMC member email + one-time login code migration
-- Run once in the Supabase SQL Editor for the ZPMC membership project.
-- Safe to re-run: adds the column if needed and synchronizes existing emails.

alter table public.members
  add column if not exists email text;

-- Backfill registration emails for members who already exist.
update public.members as m
set email = u.email
from auth.users as u
where u.id = m.id
  and m.email is distinct from u.email;

-- Keep the member profile email synchronized when an Auth email changes.
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

  insert into public.members (id, full_name, email, phone, country)
  values (
    new.id,
    left(candidate_name, 120),
    new.email,
    nullif(trim(new.raw_user_meta_data ->> 'phone'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'country'), '')
  )
  on conflict (id) do update
  set email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_zpmc_member on auth.users;

create trigger on_auth_user_created_zpmc_member
after insert or update of email on auth.users
for each row
execute function public.handle_new_zpmc_member();

-- Existing RLS policies already let ZPMC admins read all member rows,
-- and let each member read only their own row. No service-role key is needed.
