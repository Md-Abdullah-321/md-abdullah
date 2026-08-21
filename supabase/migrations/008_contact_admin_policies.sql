-- Allow authenticated users to update and delete contact submissions

create policy "Allow authenticated update"
  on public.contact_submissions
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Allow authenticated delete"
  on public.contact_submissions
  for delete
  to authenticated
  using (true);
