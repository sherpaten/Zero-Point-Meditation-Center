# ZPMC Community Membership — setup notes

## Current approach
- Supabase project: `zpmc-membership` (Free plan)
- Website repository: `sherpaten/Zero-Point-Meditation-Center`
- Work branch: `feature/zpmc-supabase-membership`
- The production `main` branch is not changed by this setup work.
- The existing event/class booking flow and Zoom confirmation emails must remain unchanged.

## Environment variables
In the Vite app directory, create a local `.env.local` file (do not commit it) with:

```dotenv
VITE_SUPABASE_URL=https://guwawyuwjozdepkpgupu.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Supabase's newer publishable key (starts with `sb_publishable_`) is suitable for browser use when Row Level Security is correctly configured. Never put a secret key or service-role key in a `VITE_*` variable or browser code.

For Vercel preview deployments, add the same two variables to the Vercel project's Preview environment. Add them to Production only after the feature is reviewed and approved for release.

## Database setup
1. Open the Supabase project and go to SQL Editor.
2. Open the repository file `docs/supabase-membership-setup.sql`.
3. Paste the full SQL into a new query and run it.
4. Confirm that `members`, `admin_users`, `weekly_attendance`, and `membership_settings` appear under Database → Tables.
5. Keep Row Level Security enabled on all four tables.

## Membership decisions still awaiting confirmation
- One free community class per member per week.
- Membership duration (ongoing or annual).
- Discount-eligible services/events and the percentage for each.
The initial database defaults to one free class weekly and ongoing membership, but these are provisional settings and must be confirmed before public launch. Discount rules start empty; no percentage is assumed.

## Administrator setup
Do not make a member an administrator from the public signup form. After the first approved administrator has registered, insert their Auth user UUID into `public.admin_users` from the Supabase SQL Editor. This is a manual, trusted admin-only step.

## Privacy and release checklist
- Keep email confirmation enabled in Supabase Auth.
- Configure the production and preview site URLs in Supabase Auth URL Configuration before enabling sign-up.
- Test sign-up, email verification, sign-in, own-profile access, and denial of access to another member's record.
- Test administrator permissions separately.
- Do not deploy the feature to the production branch until those tests pass.
