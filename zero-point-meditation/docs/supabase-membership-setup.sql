-- ZPMC Community Membership — initial secure schema
-- Run this entire file in Supabase SQL Editor for project zpmc-membership.

create table if not exists public.members (
  id uuid primary key references auth.users(id) on delete cascade,
  member_number bigint generated always as identity unique,
  full_name text not null check (char_length(trim(full_name)) between 2 and 120),
  phone text,
  country text,
  status text not null default 'active' check (status in ('active', 'suspended', 'expired')),
  created_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.weekly_attendance (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  class_date date not null default current_date,
  week_start date not null,
  checked_in_by uuid references auth.users(id),
  notes text,
  created_at timestamptz not null default now(),
  unique (member_id, week_start)
);

create table if not exists public.membership_settings (
  id integer primary key default 1 check (id = 1),
  free_classes_per_week integer not null default 1 check (free_classes_per_week >= 0),
  membership_term text not null default 'ongoing' check (membership_term in ('ongoing', 'annual')),
  discount_rules jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.membership_settings (id)
values (1)
on conflict (id) do nothing;

create or replace function public.is_zpmc_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

create or replace function public.guard_member_sensitive_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_zpmc_admin() then
    if new.status is distinct from old.status
      or new.member_number is distinct from old.member_number
      or new.id is distinct from old.id
      or new.created_at is distinct from old.created_at then
      raise exception 'Only ZPMC administrators can change protected membership fields';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists members_guard_sensitive_fields on public.members;
create trigger members_guard_sensitive_fields
before update on public.members
for each row execute function public.guard_member_sensitive_fields();

alter table public.members enable row level security;
alter table public.admin_users enable row level security;
alter table public.weekly_attendance enable row level security;
alter table public.membership_settings enable row level security;

drop policy if exists "Members can view their own record or admins can view all" on public.members;
create policy "Members can view their own record or admins can view all"
on public.members for select to authenticated
using (id = (select auth.uid()) or (select public.is_zpmc_admin()));

drop policy if exists "Users can create their own member record" on public.members;
create policy "Users can create their own member record"
on public.members for insert to authenticated
with check (id = (select auth.uid()) and status = 'active');

drop policy if exists "Members can update their own contact details or admins can update all" on public.members;
create policy "Members can update their own contact details or admins can update all"
on public.members for update to authenticated
using (id = (select auth.uid()) or (select public.is_zpmc_admin()))
with check (id = (select auth.uid()) or (select public.is_zpmc_admin()));

drop policy if exists "Admins can view admin list" on public.admin_users;
create policy "Admins can view admin list"
on public.admin_users for select to authenticated
using (user_id = (select auth.uid()) or (select public.is_zpmc_admin()));

drop policy if exists "Members can view their own attendance and admins can view all" on public.weekly_attendance;
create policy "Members can view their own attendance and admins can view all"
on public.weekly_attendance for select to authenticated
using (member_id = (select auth.uid()) or (select public.is_zpmc_admin()));

drop policy if exists "Admins can record attendance" on public.weekly_attendance;
create policy "Admins can record attendance"
on public.weekly_attendance for insert to authenticated
with check ((select public.is_zpmc_admin()));

drop policy if exists "Admins can correct attendance" on public.weekly_attendance;
create policy "Admins can correct attendance"
on public.weekly_attendance for update to authenticated
using ((select public.is_zpmc_admin()))
with check ((select public.is_zpmc_admin()));

drop policy if exists "Authenticated users can read membership settings" on public.membership_settings;
create policy "Authenticated users can read membership settings"
on public.membership_settings for select to authenticated
using (true);

drop policy if exists "Admins can update membership settings" on public.membership_settings;
create policy "Admins can update membership settings"
on public.membership_settings for update to authenticated
using ((select public.is_zpmc_admin()))
with check ((select public.is_zpmc_admin()));

grant usage on schema public to authenticated;
grant select, insert, update on public.members to authenticated;
grant select on public.admin_users to authenticated;
grant select, insert, update on public.weekly_attendance to authenticated;
grant select, update on public.membership_settings to authenticated;

-- After the first administrator account has signed up through the website,
-- add that user's UUID to public.admin_users from the Supabase SQL Editor:
-- insert into public.admin_users (user_id) values ('AUTH-USER-UUID-HERE');
