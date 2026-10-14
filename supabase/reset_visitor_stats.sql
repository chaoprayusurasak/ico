begin;

truncate table public.visitor_logs restart identity;

insert into public.visitor_stats (key, total_count, updated_at)
values ('site_total', 0, now())
on conflict (key) do update
set total_count = 0,
    updated_at = excluded.updated_at;

commit;
