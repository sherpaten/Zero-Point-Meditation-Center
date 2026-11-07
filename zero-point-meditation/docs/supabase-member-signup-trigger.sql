-- ZPMC Community Membership — verified-signup profile trigger
-- Run this once in Supabase SQL Editor after the four membership tables exist.
-- This creates a member profile when Supabase Auth creates an account,
-- including accounts awaiting email verification.

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

  insert into public.members (id, full_name, phone, country)
  values (
    new.id,
    left(candidate_name, 120),
    nullif(trim(new.raw_user_meta_data ->> 'phone'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'country'), '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_zpmc_member on auth.users;

create trigger on_auth_user_created_zpmc_member
after insert on auth.users
for each row
execute function public.handle_new_zpmc_member();

-- The function runs with its owner's privileges so the trigger can create
-- the profile safely without exposing a public insert path.
