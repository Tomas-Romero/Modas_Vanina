-- Lightweight analytics: one row per "Preguntar por WhatsApp" click, so the
-- admin can see which products generate the most inquiries (spec backlog:
-- "analytics simple"). Insert-only for anon — nobody can read, edit, or
-- delete other people's rows, only the authenticated admin can query them.
create table public.product_inquiries (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index product_inquiries_product_id_idx on public.product_inquiries (product_id);

alter table public.product_inquiries enable row level security;

create policy "anyone can log an inquiry" on public.product_inquiries
  for insert to anon, authenticated with check (true);
create policy "authenticated can read inquiries" on public.product_inquiries
  for select to authenticated using (true);
