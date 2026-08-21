-- Videos Library
-- Standalone video records that can be referenced by projects, proof, etc.

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  provider text not null check (provider in ('youtube', 'loom')),
  video_id text not null,
  thumbnail_url text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_videos_published
  on public.videos (published);

create index if not exists idx_videos_provider
  on public.videos (provider);

-- RLS
alter table public.videos enable row level security;

create policy "Public read published videos"
  on public.videos for select to anon
  using (published = true);

create policy "Admin full access to videos"
  on public.videos for all to authenticated
  using (true) with check (true);

create trigger videos_updated_at
  before update on public.videos
  for each row execute function public.set_updated_at();
