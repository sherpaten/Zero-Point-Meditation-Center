-- Restore the ZPMC membership profile trigger and recover applications
-- that were already created in Supabase Auth before the trigger was attached.
-- Existing member and payment rows are preserved.

CREATE OR REPLACE FUNCTION public.handle_new_zpmc_member()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  candidate_name text;
  selected_plan text;
  proof_path text;
BEGIN
  selected_plan := coalesce(new.raw_user_meta_data ->> 'membership_plan', '');
  proof_path := coalesce(new.raw_user_meta_data ->> 'payment_proof_path', '');

  -- Only create member profiles for actual ZPMC membership applications.
  -- This deliberately excludes the permanent administrator and unrelated
  -- Auth users that do not carry membership application metadata.
  IF selected_plan NOT IN ('yearly', 'benefactor', 'lifetime') THEN
    RETURN new;
  END IF;

  candidate_name := nullif(trim(new.raw_user_meta_data ->> 'full_name'), '');
  IF candidate_name IS NULL OR char_length(candidate_name) < 2 THEN
    candidate_name := 'New member';
  END IF;

  INSERT INTO public.members (
    id, full_name, email, email_confirmed_at, phone, country, status
  )
  VALUES (
    new.id,
    left(candidate_name, 120),
    new.email,
    new.email_confirmed_at,
    nullif(trim(new.raw_user_meta_data ->> 'phone'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'country'), ''),
    'pending'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$function$;

DROP TRIGGER IF EXISTS zpmc_create_member_after_auth_insert ON auth.users;
CREATE TRIGGER zpmc_create_member_after_auth_insert
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_zpmc_member();

-- Backfill missing member profiles from valid membership applications only.
-- ON CONFLICT DO NOTHING ensures existing member records are not overwritten.
INSERT INTO public.members (
  id, full_name, email, email_confirmed_at, phone, country, status
)
SELECT
  u.id,
  left(coalesce(nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''), 'New member'), 120),
  u.email,
  u.email_confirmed_at,
  nullif(trim(u.raw_user_meta_data ->> 'phone'), ''),
  nullif(trim(u.raw_user_meta_data ->> 'country'), ''),
  'pending'
FROM auth.users AS u
WHERE u.raw_user_meta_data ->> 'membership_plan' IN ('yearly', 'benefactor', 'lifetime')
  AND coalesce(u.raw_user_meta_data ->> 'payment_proof_path', '') LIKE 'applications/%'
  AND position('..' IN coalesce(u.raw_user_meta_data ->> 'payment_proof_path', '')) = 0
ON CONFLICT (id) DO NOTHING;

-- Recreate missing pending ledger rows for applications with uploaded proof.
-- Never overwrite a payment that an administrator has already reviewed.
INSERT INTO public.payment_records (
  source_ref, payment_type, payer_name, payer_email, amount, currency,
  payment_method, purpose, membership_plan, member_id,
  payment_proof_path, status
)
SELECT
  'membership:' || u.id::text,
  'membership',
  left(coalesce(nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''), 'New member'), 120),
  lower(u.email),
  CASE u.raw_user_meta_data ->> 'membership_plan'
    WHEN 'yearly' THEN 25.00
    WHEN 'benefactor' THEN 500.00
    WHEN 'lifetime' THEN 3000.00
  END,
  'USD',
  'Zelle',
  'Community membership payment',
  CASE u.raw_user_meta_data ->> 'membership_plan'
    WHEN 'yearly' THEN 'Yearly Membership — $25/year (new-member offer: 2 years for $25)'
    WHEN 'benefactor' THEN 'Benefactor Membership — $500/year'
    WHEN 'lifetime' THEN 'Lifetime Membership — $3,000 one-time'
  END,
  u.id,
  u.raw_user_meta_data ->> 'payment_proof_path',
  'pending'
FROM auth.users AS u
WHERE u.raw_user_meta_data ->> 'membership_plan' IN ('yearly', 'benefactor', 'lifetime')
  AND coalesce(u.raw_user_meta_data ->> 'payment_proof_path', '') LIKE 'applications/%'
  AND position('..' IN coalesce(u.raw_user_meta_data ->> 'payment_proof_path', '')) = 0
ON CONFLICT (source_ref) DO NOTHING;
