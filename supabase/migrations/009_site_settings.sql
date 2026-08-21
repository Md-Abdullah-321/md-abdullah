-- Site Settings
-- Single-row table for portfolio-wide configuration

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  -- Profile
  name text not null default '',
  title text not null default '',
  bio text not null default '',
  profile_image_url text,
  -- Contact
  public_email text not null default '',
  -- CTA
  contact_url text not null default '/contact',
  booking_url text,
  -- Professional links
  link_linkedin text,
  link_github text,
  link_upwork text,
  link_youtube text,
  link_twitter text,
  -- Site metadata
  site_title text not null default '',
  site_description text not null default '',
  -- Timestamps
  updated_at timestamptz not null default now()
);

-- RLS
alter table public.site_settings enable row level security;

-- Public: anyone can read (these are public settings)
create policy "Public read site_settings"
  on public.site_settings for select to anon
  using (true);

-- Authenticated: full access
create policy "Admin full access to site_settings"
  on public.site_settings for all to authenticated
  using (true) with check (true);

-- Auto-update timestamp
create trigger site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- Insert default row
insert into public.site_settings (name, title, site_title, site_description, public_email, contact_url)
values (
  'Md Abdullah',
  'Automation & Integration Engineer',
  'Md Abdullah | Automation & Integration Engineer',
  'Helping businesses streamline operations, connect systems, and eliminate manual work.',
  '',
  '/contact'
);
