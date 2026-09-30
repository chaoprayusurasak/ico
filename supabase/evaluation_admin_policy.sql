grant usage on schema public to authenticated;
grant select, update, delete on public.evaluations to authenticated;

drop policy if exists "Authenticated users can update satisfaction evaluations" on public.evaluations;
create policy "Authenticated users can update satisfaction evaluations"
  on public.evaluations
  for update
  to authenticated
  using (auth.uid() is not null and category = 'evaluations')
  with check (auth.uid() is not null and category = 'evaluations');

drop policy if exists "Authenticated users can delete satisfaction evaluations" on public.evaluations;
create policy "Authenticated users can delete satisfaction evaluations"
  on public.evaluations
  for delete
  to authenticated
  using (auth.uid() is not null and category = 'evaluations');
