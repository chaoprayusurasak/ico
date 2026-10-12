grant usage on schema public to authenticated;

alter table public.faqs add column if not exists admin_answer text;
alter table public.faqs add column if not exists status text;

grant select, update, delete on public.faqs to authenticated;

drop policy if exists "Authenticated users can read FAQs" on public.faqs;
create policy "Authenticated users can read FAQs"
  on public.faqs
  for select
  to authenticated
  using (auth.uid() is not null and category = 'eval_faq');

drop policy if exists "Authenticated users can reply to FAQs" on public.faqs;
create policy "Authenticated users can reply to FAQs"
  on public.faqs
  for update
  to authenticated
  using (auth.uid() is not null and category = 'eval_faq')
  with check (auth.uid() is not null and category = 'eval_faq');

drop policy if exists "Authenticated users can delete FAQs" on public.faqs;
create policy "Authenticated users can delete FAQs"
  on public.faqs
  for delete
  to authenticated
  using (auth.uid() is not null and category = 'eval_faq');

notify pgrst, 'reload schema';
