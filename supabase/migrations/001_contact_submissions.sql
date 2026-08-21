-- Contact form submissions
-- Created for the portfolio contact page

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  message text not null,
  systems text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

-- Index for admin queries
create index if not exists idx_contact_submissions_created_at
  on public.contact_submissions (created_at desc);

create index if not exists idx_contact_submissions_status
  on public.contact_submissions (status);

-- Row Level Security
alter table public.contact_submissions enable row level security;

-- Allow anonymous inserts (for the contact form)
create policy "Allow anonymous insert"
  on public.contact_submissions
  for insert
  to anon
  with check (true);

-- Only authenticated users (admin) can read
create policy "Allow authenticated read"
  on public.contact_submissions
  for select
  to authenticated
  using (true);
