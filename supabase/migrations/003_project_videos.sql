-- Project Videos
-- Provider-based video references (YouTube, Loom)

create table if not exists public.project_videos (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  provider text not null check (provider in ('youtube', 'loom')),
  video_id text not null,
  title text not null,
  description text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_project_videos_project
  on public.project_videos (project_id, sort_order);

-- RLS
alter table public.project_videos enable row level security;

-- Public: read videos for published projects
create policy "Public read videos of published projects"
  on public.project_videos for select to anon
  using (
    exists (
      select 1 from public.projects
      where projects.id = project_videos.project_id
      and projects.published = true
    )
  );

-- Authenticated: full access
create policy "Admin full access to project_videos"
  on public.project_videos for all to authenticated
  using (true) with check (true);
