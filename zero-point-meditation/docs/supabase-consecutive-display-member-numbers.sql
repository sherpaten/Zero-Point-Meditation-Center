-- ZPMC consecutive display membership numbers
-- Keeps the existing member_number and members.id untouched. Attendance remains
-- linked by members.id. Run once in the Supabase SQL Editor before deploying
-- the frontend changes.
--
-- Existing members receive display numbers in their current permanent-number
-- order. New members receive the next sequence value. Deleted display numbers
-- are never reused because PostgreSQL sequences are non-transactional counters.

begin;

alter table public.members
  add column if not exists display_member_number bigint;

create sequence if not exists public.zpmc_display_member_number_seq
  as bigint
  start with 1
  increment by 1
  no minvalue
  no maxvalue
  cache 1;

with numbered as (
  select
    id,
    row_number() over (
      order by member_number asc nulls last, created_at asc nulls last, id asc
    ) as assigned_number
  from public.members
  where display_member_number is null
)
update public.members as members
set display_member_number = numbered.assigned_number
from numbered
where members.id = numbered.id;

-- Start future allocations after the highest number ever assigned during
-- this migration. A sequence is intentionally not reset when members are deleted.
select setval(
  'public.zpmc_display_member_number_seq',
  greatest(
    coalesce((select max(display_member_number) from public.members), 0),
    (select last_value from public.zpmc_display_member_number_seq)
  ),
  (select is_called from public.zpmc_display_member_number_seq)
    or coalesce((select max(display_member_number) from public.members), 0) > 0
);

create unique index if not exists members_display_member_number_key
  on public.members (display_member_number);

create or replace function public.assign_zpmc_display_member_number()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.display_member_number is null then
    new.display_member_number :=
      nextval('public.zpmc_display_member_number_seq'::regclass);
  end if;
  return new;
end;
$$;

drop trigger if exists assign_zpmc_display_member_number_before_insert
  on public.members;

create trigger assign_zpmc_display_member_number_before_insert
before insert on public.members
for each row
execute function public.assign_zpmc_display_member_number();

commit;
