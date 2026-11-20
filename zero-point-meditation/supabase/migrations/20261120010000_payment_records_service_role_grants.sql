-- The payment ledger is written only by trusted server-side API routes using
-- the Supabase service-role key. RLS remains enabled and no client policies
-- are added. Explicit table grants are still required for service_role.
grant usage on schema public to service_role;
grant select, insert, update on table public.payment_records to service_role;
