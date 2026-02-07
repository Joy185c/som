-- ShowOffs Media – Supabase schema
-- Run this in Supabase SQL Editor after creating your project.

-- Sections (for homepage/portfolio ordering)
create table if not exists public.sections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  order_index int not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

-- Works / Portfolio items
create table if not exists public.works (
  id uuid primary key default gen_random_uuid(),
  section_id uuid references public.sections(id) on delete set null,
  title text not null,
  slug text not null,
  description text,
  video_url text,
  thumbnail_url text,
  project_type text not null,
  tools text[] default '{}',
  tags text[] default '{}',
  is_vertical boolean not null default false,
  view_count int not null default 0,
  published boolean not null default true,
  order_index int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists works_section_idx on public.works(section_id);
create index if not exists works_published_idx on public.works(published);
create index if not exists works_slug_idx on public.works(slug);

-- Reviews
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_photo_url text,
  rating int not null check (rating >= 1 and rating <= 5),
  content text not null,
  project_type text,
  video_url text,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists reviews_approved_idx on public.reviews(approved);

-- Team members
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text not null,
  bio text,
  photo_url text,
  social_links jsonb default '{}',
  published boolean not null default true,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

-- Meetings (book a meeting form)
create table if not exists public.meetings (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_email text not null,
  client_phone text,
  project_type text not null,
  budget_range text,
  preferred_date date,
  preferred_time_slot text,
  message text,
  brief_file_url text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists meetings_status_idx on public.meetings(status);

-- Site settings (key-value)
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- RLS: allow public read for works, reviews, team_members (published only)
alter table public.sections enable row level security;
alter table public.works enable row level security;
alter table public.reviews enable row level security;
alter table public.team_members enable row level security;
alter table public.meetings enable row level security;
alter table public.site_settings enable row level security;

create policy "Public read sections" on public.sections for select using (true);
create policy "Public read works" on public.works for select using (published = true);
create policy "Public read approved reviews" on public.reviews for select using (approved = true);
create policy "Public read team" on public.team_members for select using (published = true);
create policy "Public insert meetings" on public.meetings for insert with check (true);
create policy "Public read site_settings" on public.site_settings for select using (true);

-- Storage bucket for uploads (run in SQL or create via Dashboard: Storage -> New bucket -> "uploads", public)
-- insert into storage.buckets (id, name, public) values ('uploads', 'uploads', true);
-- create policy "Public read uploads" on storage.objects for select using (bucket_id = 'uploads');
-- create policy "Service role full access" on storage.objects for all using (true);

-- Seed default sections (optional)
insert into public.sections (name, slug, order_index, visible) values
  ('Hero', 'hero', 0, true),
  ('Featured Works', 'featured-works', 1, true),
  ('Reviews', 'reviews', 2, true),
  ('Team', 'team', 3, true),
  ('Awards', 'awards', 4, true)
on conflict (slug) do nothing;

-- Seed default site settings (optional)
insert into public.site_settings (key, value) values
  ('agencyName', '"ShowOffs Media"'),
  ('email', '"hello@showoffsmedia.com"'),
  ('whatsapp', '""'),
  ('seoTitle', '"ShowOffs Media — We Make Brands Stand Out"'),
  ('seoDescription', '"Premium video production, Reels, Shorts & motion graphics."'),
  ('darkModeDefault', 'true'),
  ('socialLinks', '{}')
on conflict (key) do update set value = excluded.value, updated_at = now();
