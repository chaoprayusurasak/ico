do $$
declare
  folder_row record;
  target_table text;
  has_oic_category boolean;
begin
  for folder_row in
    with departments(name) as (
      values
        ('สำนักปลัด'),
        ('สำนักคลัง'),
        ('กองช่าง'),
        ('กองสาธารณสุขและสิ่งแวดล้อม'),
        ('กองยุทธศาสตร์และงบประมาณ'),
        ('กองการศึกษา'),
        ('กองสวัสดิการสังคม'),
        ('งานป้องกันและบรรเทาสาธารณภัย'),
        ('งานรักษาความสงบ (เทศกิจ)'),
        ('งานทะเบียนราษฎร์'),
        ('ตรวจสอบภายใน')
    ),
    all_department_topics(category) as (
      values
        ('m7_2'),
        ('m7_4'),
        ('m7_5'),
        ('m7_6'),
        ('m7_7'),
        ('m7_8'),
        ('m9_3')
    ),
    assigned_topics(category, department) as (
      values
        ('m7_1', 'สำนักปลัด'),
        ('m7_3', 'ศูนย์ข้อมูลข่าวสารฯ'),
        ('m9_1', 'สำนักปลัด'),
        ('m9_2', 'กองยุทธศาสตร์และงบประมาณ'),
        ('m9_2', 'สำนักคลัง'),
        ('m9_4', 'กองยุทธศาสตร์และงบประมาณ'),
        ('m9_5', 'กองการเจ้าหน้าที่'),
        ('m9_6', 'กองช่าง'),
        ('m9_7', 'สำนักคลัง'),
        ('m9_8', 'สำนักคลัง')
    ),
    folders_to_create as (
      select topics.category, departments.name as title
      from all_department_topics as topics
      cross join departments
      union all
      select category, department as title
      from assigned_topics
    )
    select category, title
    from folders_to_create
  loop
    has_oic_category := false;
    if to_regclass('public.oic_documents') is not null then
      execute 'select exists (select 1 from public.oic_documents where category = $1)'
        into has_oic_category
        using folder_row.category;
    end if;

    if has_oic_category then
      target_table := 'oic_documents';
    elsif to_regclass('public.items') is not null then
      target_table := 'items';
    elsif to_regclass('public.oic_documents') is not null then
      target_table := 'oic_documents';
    else
      raise exception 'Neither public.oic_documents nor public.items exists';
    end if;

    execute format(
      'insert into public.%I (category, parent_id, is_folder, title, description, created_at)
       select $1, null, true, $2, $3, now()
       where not exists (
         select 1
         from public.%I
         where category = $1
           and parent_id is null
           and is_folder = true
           and title = $2
       )',
      target_table,
      target_table
    )
    using folder_row.category, folder_row.title, '';
  end loop;
end
$$;
