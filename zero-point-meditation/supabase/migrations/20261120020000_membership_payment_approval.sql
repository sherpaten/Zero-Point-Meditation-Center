-- New member applications must remain pending until ZPMC verifies payment.
-- Existing member rows are intentionally not updated by this migration.

ALTER TABLE public.members
  ALTER COLUMN status SET DEFAULT 'pending';

ALTER TABLE public.members
  DROP CONSTRAINT IF EXISTS members_status_check;

ALTER TABLE public.members
  ADD CONSTRAINT members_status_check
  CHECK (status IN ('pending', 'active', 'suspended', 'expired'));

-- Member profiles are created by the SECURITY DEFINER auth trigger.
-- Do not allow authenticated users to insert their own active profile.
DROP POLICY IF EXISTS "Users can create their own member record"
  ON public.members;

-- Remove the direct client insert privilege as well; the auth trigger is the
-- only supported path for creating a member profile.
REVOKE INSERT ON TABLE public.members FROM authenticated;

CREATE OR REPLACE FUNCTION public.handle_new_zpmc_member()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  candidate_name text;
BEGIN
  candidate_name := nullif(trim(new.raw_user_meta_data ->> 'full_name'), '');

  IF candidate_name IS NULL OR char_length(candidate_name) < 2 THEN
    candidate_name := 'New member';
  END IF;

  INSERT INTO public.members (
    id,
    full_name,
    email,
    email_confirmed_at,
    phone,
    country,
    status
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
  ON CONFLICT (id) DO UPDATE
  SET email = excluded.email,
      email_confirmed_at = excluded.email_confirmed_at;

  RETURN new;
END;
$function$;
