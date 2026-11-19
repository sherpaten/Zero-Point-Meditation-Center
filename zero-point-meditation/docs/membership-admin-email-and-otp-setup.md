# ZPMC member email and one-time login codes

The membership admin dashboard now supports viewing a member's registered email and asking Supabase Auth to send that member a one-time sign-in code.

## 1. Apply the database migration

In the Supabase project used by the live ZPMC website:

1. Open **SQL Editor**.
2. Open or paste the contents of `supabase-membership-email-otp-migration.sql`.
3. Run it once.

The migration adds `members.email`, backfills existing records from `auth.users`, and keeps the email synchronized for future Auth email changes. It does not delete or modify member accounts, passwords, attendance, or administrator records.

## 2. Configure the Supabase email template for numeric codes

Supabase sends the code through its normal Auth email provider. To make sure the email contains the numeric code rather than only a magic link:

1. Open **Authentication → Email Templates** in Supabase.
2. Open the **Magic Link** template used for email OTP sign-in.
3. Include the template variable `{{ .Token }}` prominently in the email body (for example: "Your ZPMC one-time sign-in code is {{ .Token }}").
4. Save the template.

Keep the existing signup-confirmation and password-recovery templates as they are. Do not put any service-role or secret key in the website.

## 3. How staff use it

1. Sign in to the ZPMC Membership Admin Dashboard.
2. Open a member's **View** details.
3. Confirm the registered email address.
4. Select **Send One-Time Login Code**.

The code is sent directly by Supabase Auth to the member's registered email. It is never displayed to the administrator.

## 4. How the member signs in

1. Open [https://www.zeropointmeditationcenter.org/membership](https://www.zeropointmeditationcenter.org/membership).
2. Choose **Sign In**.
3. Enter the registered email and choose **I already have a code**.
4. Enter the one-time code from the email and select **Verify Code & Sign In**.

Members can also request their own code using **Email me a one-time code**.

## Security notes

- The Vercel API route verifies the caller's Supabase session and checks the caller against `public.admin_users` before sending a code for a selected member.
- The API uses the public Supabase Auth API; it does not require or expose a Supabase service-role key.
- Supabase Auth's configured email rate limits still apply.
- The admin dashboard reads member email addresses under the existing member/admin Row Level Security policies.

## 5. Track email verification and resend confirmation links

Run `membership-email-verification-tracking.sql` in the Supabase SQL Editor after the email migration. This adds and backfills `members.email_confirmed_at`, then keeps it synchronized with Supabase Auth.

In the admin dashboard, the Member Directory shows **Verified** or **Pending** beside each registered email. The summary also shows how many members are pending email verification. Open **View** for a pending member and choose **Resend Verification Email** to send a fresh confirmation link to the address used at registration.

Supabase does not let the dashboard retrieve an already-issued confirmation link. The safe supported action is to send a fresh link. The action is available only for pending, unverified accounts. Once verified, the status updates from Supabase Auth through the database trigger.

If a member clicked an older link and then received a browser security error, resend a fresh link after confirming the account still shows **Pending**. They should open the newest email and use the latest link only.
