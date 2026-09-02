-- Homepage Hero testimonial selection
-- Single-row site_settings gains a nullable FK to the selected testimonials row.
-- on delete set null: deleting the testimonial clears the selection (homepage
-- then falls back to the most recent published testimonial).

alter table public.site_settings
  add column if not exists hero_testimonial_id uuid;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'site_settings_hero_testimonial_id_fkey'
      and conrelid = 'public.site_settings'::regclass
  ) then
    alter table public.site_settings
      add constraint site_settings_hero_testimonial_id_fkey
      foreign key (hero_testimonial_id)
      references public.testimonials(id)
      on delete set null;
  end if;
end $$;

create index if not exists idx_site_settings_hero_testimonial_id
  on public.site_settings (hero_testimonial_id);

comment on column public.site_settings.hero_testimonial_id is
  'Testimonial displayed in the homepage Hero proof card. Null = automatically use the most recent published testimonial.';
