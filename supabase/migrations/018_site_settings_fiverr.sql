-- Site Settings: Fiverr profile link
-- A Fiverr profile URL shown as a contact channel on the Contact page.
-- Follows the existing nullable text-column pattern from 009_site_settings.sql
-- (link_upwork, link_linkedin, ...); the existing RLS policies (public read /
-- admin write) already cover new columns.

alter table public.site_settings
  add column if not exists link_fiverr text;
