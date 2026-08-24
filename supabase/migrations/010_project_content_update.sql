-- Project content architecture update
-- Adds an optional public website URL without changing existing project content.
-- Long-form project fields remain text columns and store the safe Markdown format
-- used by the admin editor and frontend renderer.

alter table public.projects
  add column if not exists website_url text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'projects_website_url_http_check'
      and conrelid = 'public.projects'::regclass
  ) then
    alter table public.projects
      add constraint projects_website_url_http_check
      check (website_url is null or website_url ~* '^https?://[^[:space:]]+$');
  end if;
end $$;

comment on column public.projects.website_url is
  'Optional public project website. Must be an http or https URL when present.';

-- No data conversion is required. Existing long-form text is preserved as-is;
-- the new editor stores Markdown syntax in the same text columns.
