-- Shared ZPMC payment ledger for donations and memberships.
-- Access is server-side only through the Supabase service-role key.
create table if not exists public.payment_records (
  id uuid primary key default gen_random_uuid(),
  source_ref text not null unique,
  payment_type text not null check (payment_type in ('donation', 'membership')),
  payer_name text not null,
  payer_email text not null,
  amount numeric(12,2) not null check (amount > 0),
  currency text not null default 'USD',
  payment_method text not null,
  purpose text,
  membership_plan text,
  member_id uuid,
  payment_proof_path text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'rejected')),
  receipt_number text unique,
  admin_notes text,
  created_at timestamptz not null default now(),
  verified_at timestamptz,
  receipt_email_sent_at timestamptz
);

create index if not exists payment_records_status_created_idx
  on public.payment_records (status, created_at desc);
create index if not exists payment_records_email_idx
  on public.payment_records (payer_email);
alter table public.payment_records enable row level security;
-- No anon/authenticated policies: clients cannot read or modify the payment ledger.
