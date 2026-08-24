-- Project primary content relationships
-- One optional video and one optional testimonial per project.
-- A video or testimonial can be selected by many projects.

alter table public.projects
  add column if not exists video_id uuid,
  add column if not exists testimonial_id uuid;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'projects_video_id_fkey') then
    alter table public.projects
      add constraint projects_video_id_fkey
      foreign key (video_id) references public.videos(id) on delete set null;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'projects_testimonial_id_fkey') then
    alter table public.projects
      add constraint projects_testimonial_id_fkey
      foreign key (testimonial_id) references public.testimonials(id) on delete set null;
  end if;
end $$;

create index if not exists idx_projects_video_id on public.projects(video_id);
create index if not exists idx_projects_testimonial_id on public.projects(testimonial_id);

-- Preserve existing testimonial-to-project links where they are unambiguous.
-- If legacy data contains more than one testimonial for a project, keep the
-- lowest sort_order item and use created_at/id as deterministic tie-breakers.
with legacy_links as (
  select distinct on (t.project_id)
    t.project_id,
    t.id as testimonial_id
  from public.testimonials t
  where t.project_id is not null
  order by t.project_id, t.sort_order asc, t.created_at asc, t.id asc
)
update public.projects p
set testimonial_id = legacy_links.testimonial_id
from legacy_links
where legacy_links.project_id = p.id
  and p.testimonial_id is null;

-- Existing project_videos records are intentionally preserved. They are a
-- legacy multi-video relation; the new editor uses projects.video_id for the
-- single selected CMS video and does not delete old records.
