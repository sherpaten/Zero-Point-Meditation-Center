-- Allow authorized ZPMC administrators to delete membership profiles.
-- This does NOT delete the corresponding Supabase Auth user.
-- weekly_attendance.member_id uses ON DELETE CASCADE, so attendance rows
-- belonging to a deleted member profile are removed with that profile.

grant delete on table public.members to authenticated;

drop policy if exists "Admins can delete member profiles" on public.members;
create policy "Admins can delete member profiles"
on public.members
for delete
to authenticated
using ((select public.is_zpmc_admin()));
