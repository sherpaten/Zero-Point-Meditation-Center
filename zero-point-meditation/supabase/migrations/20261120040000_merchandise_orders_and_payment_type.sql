-- Merchandise orders are separate from membership and donation workflows.
-- The payment ledger receives a merchandise row only after the customer submits proof
-- against an administrator-confirmed final amount.
begin;

alter table public.payment_records
  drop constraint if exists payment_records_payment_type_check;
alter table public.payment_records
  add constraint payment_records_payment_type_check
  check (payment_type in ('donation', 'membership', 'merchandise'));

create table if not exists public.merchandise_orders (
  id uuid primary key default gen_random_uuid(),
  public_token uuid not null unique default gen_random_uuid(),
  product_name text not null,
  listed_price text,
  quantity integer not null default 1 check (quantity between 1 and 99),
  payer_name text not null,
  payer_email text not null,
  phone text not null,
  delivery_address jsonb not null default '{}'::jsonb,
  currency text not null default 'USD',
  item_amount numeric(12,2),
  shipping_amount numeric(12,2),
  total_amount numeric(12,2),
  status text not null default 'pending_confirmation'
    check (status in ('pending_confirmation','awaiting_payment','payment_submitted','paid','rejected','cancelled')),
  fulfillment_status text not null default 'not_started'
    check (fulfillment_status in ('not_started','processing','shipped','delivered','cancelled')),
  payment_record_id uuid references public.payment_records(id) on delete set null,
  tracking_number text,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint merchandise_order_amounts_nonnegative check (
    (item_amount is null or item_amount >= 0) and
    (shipping_amount is null or shipping_amount >= 0) and
    (total_amount is null or total_amount > 0)
  )
);

create index if not exists merchandise_orders_status_created_idx
  on public.merchandise_orders (status, created_at desc);
create index if not exists merchandise_orders_email_idx
  on public.merchandise_orders (payer_email);

alter table public.merchandise_orders enable row level security;
revoke all on public.merchandise_orders from anon, authenticated;
grant all on public.merchandise_orders to service_role;

commit;
