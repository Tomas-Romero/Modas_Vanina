create extension if not exists pgcrypto;

create type product_category as enum ('indumentaria','perfumeria','cremas','tuppers','varios');
create type product_availability as enum ('en_stock','ultimas_unidades','agotado');

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category product_category not null,
  subcategory text,
  images text[] not null default '{}',
  description text,
  availability product_availability not null default 'en_stock',
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);

create index products_category_idx on public.products (category);
create index products_hidden_idx on public.products (hidden);

create table public.offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  product_ids uuid[] not null default '{}',
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  position int not null default 0,
  constraint offers_end_after_start check (ends_at is null or ends_at > starts_at)
);

create index offers_position_idx on public.offers (position);

alter table public.products enable row level security;
alter table public.offers enable row level security;

-- Products: anon only sees visible rows; the single authenticated admin sees/writes everything.
create policy "anon can read visible products" on public.products
  for select to anon using (hidden = false);
create policy "authenticated can read all products" on public.products
  for select to authenticated using (true);
create policy "authenticated can insert products" on public.products
  for insert to authenticated with check (true);
create policy "authenticated can update products" on public.products
  for update to authenticated using (true) with check (true);
create policy "authenticated can delete products" on public.products
  for delete to authenticated using (true);

-- Offers: not sensitive, anyone can read; only the authenticated admin can write.
create policy "anyone can read offers" on public.offers
  for select using (true);
create policy "authenticated can insert offers" on public.offers
  for insert to authenticated with check (true);
create policy "authenticated can update offers" on public.offers
  for update to authenticated using (true) with check (true);
create policy "authenticated can delete offers" on public.offers
  for delete to authenticated using (true);

-- No signup route exists anywhere in the app. Create the single admin user
-- by hand in Supabase Dashboard -> Authentication -> Users. RLS trusts any
-- `authenticated` user, so that manual step is the only way in.
