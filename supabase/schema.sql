-- ============================================================
-- SOVEREIGN BEATS — Supabase Database Schema
-- Run this in your Supabase SQL editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- BEATS TABLE
-- ============================================================
create table public.beats (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  cover_art_url text,
  preview_url text not null,
  bpm integer not null,
  key text not null,
  genre text[] default '{}',
  mood text[] default '{}',
  similar_artists text[] default '{}',
  description text,
  play_count integer default 0,
  is_exclusive_sold boolean default false,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- LICENSES TABLE (per beat, multiple tiers)
-- ============================================================
create table public.licenses (
  id uuid primary key default uuid_generate_v4(),
  beat_id uuid references public.beats(id) on delete cascade,
  tier text not null check (tier in ('mp3', 'wav', 'trackout', 'unlimited', 'exclusive')),
  label text not null,
  price numeric(10,2) not null,
  files text[] default '{}',
  streams text not null,
  distribution text not null,
  monetization text not null,
  credit text not null,
  content_id boolean default false,
  is_exclusive boolean default false,
  description text,
  is_active boolean default true,
  created_at timestamptz default now(),
  unique(beat_id, tier)
);

-- ============================================================
-- BEAT FILES (secure storage references)
-- ============================================================
create table public.beat_files (
  id uuid primary key default uuid_generate_v4(),
  beat_id uuid references public.beats(id) on delete cascade,
  tier text not null,
  file_name text not null,
  storage_path text not null, -- private supabase storage path
  file_size bigint,
  created_at timestamptz default now()
);

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- ORDERS
-- ============================================================
create table public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id),
  guest_email text,
  subtotal numeric(10,2) not null,
  total numeric(10,2) not null,
  stripe_payment_intent_id text unique,
  stripe_session_id text,
  status text default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint user_or_guest check (user_id is not null or guest_email is not null)
);

-- ============================================================
-- ORDER ITEMS
-- ============================================================
create table public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade,
  beat_id uuid references public.beats(id),
  beat_title text not null, -- snapshot at time of purchase
  license_tier text not null,
  license_label text not null,
  price numeric(10,2) not null,
  license_document_url text, -- generated PDF license
  created_at timestamptz default now()
);

-- ============================================================
-- DOWNLOAD TOKENS (expiring, secure delivery)
-- ============================================================
create table public.download_tokens (
  id uuid primary key default uuid_generate_v4(),
  order_item_id uuid references public.order_items(id) on delete cascade,
  token text unique not null default encode(gen_random_bytes(32), 'hex'),
  expires_at timestamptz not null default (now() + interval '72 hours'),
  download_count integer default 0,
  max_downloads integer default 5,
  created_at timestamptz default now()
);

-- ============================================================
-- COUPONS
-- ============================================================
create table public.coupons (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  discount_type text check (discount_type in ('percentage', 'fixed')),
  discount_value numeric(10,2) not null,
  min_order numeric(10,2) default 0,
  max_uses integer,
  uses_count integer default 0,
  expires_at timestamptz,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ============================================================
-- WISHLIST
-- ============================================================
create table public.wishlist (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  beat_id uuid references public.beats(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, beat_id)
);

-- ============================================================
-- EMAIL CAPTURES (lead gen)
-- ============================================================
create table public.email_captures (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  source text, -- 'popup', 'footer', 'beat_drop'
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Beats: public read
alter table public.beats enable row level security;
create policy "Beats are publicly readable" on public.beats for select using (is_active = true);
create policy "Admin can manage beats" on public.beats for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Licenses: public read
alter table public.licenses enable row level security;
create policy "Licenses are publicly readable" on public.licenses for select using (is_active = true);
create policy "Admin can manage licenses" on public.licenses for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Profiles: own data only
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Admin can view all profiles" on public.profiles for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Orders: own orders
alter table public.orders enable row level security;
create policy "Users can view own orders" on public.orders for select using (user_id = auth.uid());
create policy "Admin can view all orders" on public.orders for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Order items
alter table public.order_items enable row level security;
create policy "Users can view own order items" on public.order_items for select using (
  exists (select 1 from public.orders where id = order_id and user_id = auth.uid())
);

-- Download tokens: via token lookup only (handled server-side)
alter table public.download_tokens enable row level security;
create policy "No direct client access to download tokens" on public.download_tokens for select using (false);

-- Wishlist
alter table public.wishlist enable row level security;
create policy "Users manage own wishlist" on public.wishlist for all using (user_id = auth.uid());

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update beat updated_at
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger beats_updated_at before update on public.beats
  for each row execute procedure public.update_updated_at();

create trigger orders_updated_at before update on public.orders
  for each row execute procedure public.update_updated_at();

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
-- Run these separately in Supabase dashboard or via API:
-- 
-- 1. Create bucket: "beat-previews" (PUBLIC) — watermarked MP3s for player
-- 2. Create bucket: "beat-covers" (PUBLIC) — cover artwork
-- 3. Create bucket: "beat-files" (PRIVATE) — full stems, WAVs, trackouts
-- 4. Create bucket: "license-docs" (PRIVATE) — generated license PDFs

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_beats_slug on public.beats(slug);
create index idx_beats_genre on public.beats using gin(genre);
create index idx_beats_mood on public.beats using gin(mood);
create index idx_beats_active on public.beats(is_active);
create index idx_beats_created on public.beats(created_at desc);
create index idx_beats_play_count on public.beats(play_count desc);
create index idx_licenses_beat_id on public.licenses(beat_id);
create index idx_orders_user_id on public.orders(user_id);
create index idx_orders_status on public.orders(status);
create index idx_order_items_order_id on public.order_items(order_id);
create index idx_download_tokens_token on public.download_tokens(token);
create index idx_wishlist_user_id on public.wishlist(user_id);
