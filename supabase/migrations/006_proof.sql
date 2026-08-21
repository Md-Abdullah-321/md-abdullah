-- Proof / Credibility items

create table if not exists public.proof_items (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('project', 'video', 'testimonial', 'professional', 'other')),
  title text not null,
  description text not null default '',
  url text,
  image_url text,
  video_provider text check (video_provider in ('youtube', 'loom')),
  video_id text,
  project_id uuid references public.projects(id) on delete set null,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_proof_items_published
  on public.proof_items (published, sort_order);

-- RLS
alter table public.proof_items enable row level security;

create policy "Public read published proof"
  on public.proof_items for select to anon
  using (published = true);

create policy "Admin full access to proof_items"
  on public.proof_items for all to authenticated
  using (true) with check (true);
