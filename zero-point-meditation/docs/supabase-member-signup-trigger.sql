-- ZPMC Community Membership — pending application profile trigger
-- New member profiles begin as pending and require independent payment review.
-- Existing profiles are not changed by this trigger.

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
    id, full_name, email, email_confirmed_at, phone, country, status
  )
  values (
    new.id,
    left(candidate_name, 120),
    new.email,
    new.email_confirmed_at,
    nullif(trim(new.raw_user_meta_data ->> 'phone'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'country'), ''),
    'pending'
  )
  on conflict (id) do update
  set email = excluded.email,
      email_confirmed_at = excluded.email_confirmed_at;

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
