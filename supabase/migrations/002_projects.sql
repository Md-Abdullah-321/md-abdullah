-- Projects / Case Studies
-- Core content entity for the portfolio

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  short_description text not null default '',
  problem text not null default '',
  solution text not null default '',
  outcome text not null default '',
  context text not null default '',
  workflow text not null default '',
  architecture text not null default '',
  before_state text not null default '',
  after_state text not null default '',
  category text not null default '',
  technologies text[] not null default '{}',
  featured boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_projects_slug on public.projects (slug);
create index if not exists idx_projects_published on public.projects (published, sort_order);
create index if not exists idx_projects_featured on public.projects (featured, sort_order);

-- RLS
alter table public.projects enable row level security;

-- Public: read published projects only
create policy "Public read published projects"
  on public.projects for select to anon
  using (published = true);

-- Authenticated: full access (admin)
create policy "Admin full access to projects"
  on public.projects for all to authenticated
  using (true) with check (true);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();
