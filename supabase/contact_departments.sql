create table if not exists public.contact_departments (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 160),
  phone text not null check (char_length(trim(phone)) between 1 and 80),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists contact_departments_sort_order_idx
  on public.contact_departments (sort_order, created_at);

alter table public.contact_departments enable row level security;

grant usage on schema public to anon, authenticated;
revoke all on public.contact_departments from anon, authenticated;
grant select on public.contact_departments to anon, authenticated;
grant insert, update, delete on public.contact_departments to authenticated;

do $$
declare
  policy_record record;
begin
  for policy_record in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'contact_departments'
  loop
    execute format(
      'drop policy if exists %I on public.contact_departments',
      policy_record.policyname
    );
  end loop;
end;
$$;

create policy "Public can read contact departments"
  on public.contact_departments
  for select
  to anon, authenticated
  using (true);

create policy "Authenticated users can insert contact departments"
  on public.contact_departments
  for insert
  to authenticated
  with check (auth.uid() is not null);

create policy "Authenticated users can update contact departments"
  on public.contact_departments
  for update
  to authenticated
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

create policy "Authenticated users can delete contact departments"
  on public.contact_departments
  for delete
  to authenticated
  using (auth.uid() is not null);

insert into public.contact_departments (name, phone, sort_order)
select seed.name, seed.phone, seed.sort_order
from (values
  ('ประชาสัมพันธ์', '038-348205-6', 0),
  ('สำนักปลัด', '038-348138', 1),
  ('สำนักคลัง', '038-348175', 2),
  ('กองช่าง', '038-348245', 3),
  ('กองสาธารณสุขและสิ่งแวดล้อม', '038-348253', 4),
  ('กองยุทธศาสตร์และงบประมาณ', '038-348157', 5),
  ('กองการศึกษา', '038-348163', 6),
  ('กองสวัสดิการสังคม', '038-348068', 7),
  ('งานป้องกันและบรรเทาสาธารณภัย', '038-348000', 8),
  ('งานรักษาความสงบ (เทศกิจ)', '038-348177', 9),
  ('งานทะเบียนราษฎร์', '038-348164', 10)
) as seed(name, phone, sort_order)
where not exists (select 1 from public.contact_departments);
