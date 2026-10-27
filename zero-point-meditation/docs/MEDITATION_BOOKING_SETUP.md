# Meditation booking setup checklist

This page is intentionally closed for submissions until the Supabase project is configured. Do not add service-role keys or email-provider secrets to any `VITE_*` variable; Vite exposes those variables in the public browser bundle.

## 1. Create the Supabase table

Run the following SQL in the Supabase SQL Editor. It stores only the fields requested by the center and prevents the same email from registering more than once for the same session.

```sql
create table if not exists public.meditation_bookings (
  id uuid primary key default gen_random_uuid(),
  session_date date not null check (session_date in ('2026-11-07', '2026-11-08', '2026-11-14', '2026-11-15')),
  name text not null check (char_length(trim(name)) between 1 and 120),
  email text not null check (char_length(trim(email)) between 3 and 254),
  phone text not null check (char_length(trim(phone)) between 1 and 40),
  place text not null check (char_length(trim(place)) between 1 and 120),
  profession text not null check (char_length(trim(profession)) between 1 and 120),
  created_at timestamptz not null default now()
);

create unique index if not exists meditation_bookings_session_email_unique
  on public.meditation_bookings (session_date, lower(email));

alter table public.meditation_bookings enable row level security;

-- Public visitors may submit a registration but cannot read, edit, or delete bookings.
grant insert on public.meditation_bookings to anon, authenticated;
revoke all on public.meditation_bookings from anon, authenticated;
grant insert (session_date, name, email, phone, place, profession)
  on public.meditation_bookings to anon, authenticated;

drop policy if exists "Public can register for a listed meditation session"
  on public.meditation_bookings;
create policy "Public can register for a listed meditation session"
  on public.meditation_bookings
  for insert to anon, authenticated
  with check (
    session_date in ('2026-11-07', '2026-11-08', '2026-11-14', '2026-11-15')
    and char_length(trim(name)) between 1 and 120
    and char_length(trim(email)) between 3 and 254
    and char_length(trim(phone)) between 1 and 40
    and char_length(trim(place)) between 1 and 120
    and char_length(trim(profession)) between 1 and 120
  );
```

The public page uses the Supabase project URL and anon/publishable key only. RLS must remain enabled. Never create a public SELECT policy for participant data. The table has no public read policy, and the page must not request returned row data.

## 2. Vercel environment variables

Add these to the Vercel project only after creating the Supabase project:

- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — public anon/publishable key

These are public client settings, not secrets. Never use the Supabase service-role key in the browser or in a `VITE_*` variable.

## 3. Items required before launch

- Confirm whether 6:30–7:15 AM means US Eastern Time (New York) or another timezone; display the timezone clearly.
- Confirm the final Zoom meeting URL and whether all four sessions use the same link.
- Set up a server-side Supabase Edge Function or another trusted server endpoint to send confirmation and reminder emails. Keep email API keys in server-side secrets, never in browser code.
- Choose the sender email/provider and verify its sending domain. Test inbox delivery, spam placement, bounce handling, and provider limits.
- Build staff-only booking/attendance access using authenticated staff accounts and restrictive RLS. Do not make the booking table readable to anonymous visitors.
- Add abuse prevention/rate limiting and consider CAPTCHA or email verification before public launch.
- Test duplicate registrations, invalid data, concurrent submissions, mobile layout, staff permissions, and email delivery in a non-production/test project first.
- Agree on data retention and who can access or export participant details.

## Current implementation status

The responsive booking page and route are in the website source. The form stays disabled until the public Supabase URL and anon key are configured. Confirmation emails, Zoom link delivery, reminders, and staff dashboard are not implemented yet. Do not announce the system as fully operational until these have been completed and tested.
