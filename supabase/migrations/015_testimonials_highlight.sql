-- Testimonial highlight phrase for the homepage hero proof card
-- Plain text, no Markdown. The frontend decides the visual treatment.

alter table public.testimonials
  add column if not exists highlight_text text;

comment on column public.testimonials.highlight_text is
  'Short phrase to visually highlight below the quote (e.g. "Would work with again"). Plain text, no Markdown.';
