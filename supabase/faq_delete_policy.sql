grant usage on schema public to authenticated;

do $$
begin
  if to_regclass('public.faqs') is not null then
    execute 'grant select, delete on public.faqs to authenticated';
    execute 'drop policy if exists "Authenticated users can delete FAQs" on public.faqs';
    execute $policy$
      create policy "Authenticated users can delete FAQs"
        on public.faqs
        for delete
        to authenticated
        using (auth.uid() is not null)
    $policy$;
  end if;

  if to_regclass('public.evaluations') is not null then
    execute 'grant select, delete on public.evaluations to authenticated';
    execute 'drop policy if exists "Authenticated users can delete FAQ evaluations" on public.evaluations';
    execute $policy$
      create policy "Authenticated users can delete FAQ evaluations"
        on public.evaluations
        for delete
        to authenticated
        using (auth.uid() is not null and category = 'eval_faq')
    $policy$;
  end if;
end;
$$;
