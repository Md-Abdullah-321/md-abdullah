-- Site Settings: WhatsApp contact link
-- Adds a CMS-managed WhatsApp link used by the contact page.
-- Follows the existing link_* pattern from 009_site_settings.sql;
-- the existing RLS policies (public read / admin write) already cover new columns.

alter table public.site_settings
  add column if not exists link_whatsapp text;
