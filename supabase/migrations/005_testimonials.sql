-- Testimonials

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_role text not null default '',
  company text not null default '',
  quote text not null,
  avatar_url text,
  project_id uuid references public.projects(id) on delete set null,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_testimonials_published
  on public.testimonials (published, sort_order);

-- RLS
alter table public.testimonials enable row level security;

create policy "Public read published testimonials"
  on public.testimonials for select to anon
  using (published = true);

create policy "Admin full access to testimonials"
  on public.testimonials for all to authenticated
  using (true) with check (true);
