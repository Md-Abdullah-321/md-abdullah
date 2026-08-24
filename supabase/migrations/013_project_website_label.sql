-- Optional label for the single public project website link.
alter table public.projects
  add column if not exists website_label text;
