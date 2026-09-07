-- Site Settings: homepage hero video
-- A YouTube or Loom share/embed URL that replaces the hero's default video.
-- Follows the existing text-column pattern from 009_site_settings.sql;
-- the existing RLS policies (public read / admin write) already cover new columns.

alter table public.site_settings
  add column if not exists hero_video_url text;