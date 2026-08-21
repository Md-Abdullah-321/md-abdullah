-- Services

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  short_description text not null default '',
  problem text not null default '',
  solution text not null default '',
  icon_name text not null default '',
  featured boolean not null default false,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_services_published
  on public.services (published, sort_order);

-- RLS
alter table public.services enable row level security;

create policy "Public read published services"
  on public.services for select to anon
  using (published = true);

create policy "Admin full access to services"
  on public.services for all to authenticated
  using (true) with check (true);

create trigger services_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();
