create or replace function public.compute_daily_performance(target_date date default current_date)
returns void
language plpgsql
security definer
as $$
begin
  insert into public.performance_stats (user_id, date, attendance_score, task_score, total_score)
  select
    u.id,
    target_date,
    case when a.login_time is not null then 100 else 0 end as attendance_score,
    coalesce(sum(case when d.status = 'Completed' then 20 else 5 end), 0) as task_score,
    least(
      100,
      ((case when a.login_time is not null then 100 else 0 end) * 0.4) +
      (coalesce(sum(case when d.status = 'Completed' then 20 else 5 end), 0) * 0.3) +
      (coalesce(a.total_hours, 0) * 10 * 0.2) +
      (case when a.login_time::time <= time '09:10' then 100 else 50 end * 0.1)
    ) as total_score
  from public.users u
  left join public.attendance a on a.user_id = u.id and a.date = target_date
  left join public.daily_logs d on d.user_id = u.id and d.date = target_date
  where u.role = 'employee' and u.status = 'active'
  group by u.id, a.login_time, a.total_hours
  on conflict do nothing;
end;
$$;

create or replace function public.compute_monthly_summary(target_month date default date_trunc('month', current_date)::date)
returns void
language plpgsql
security definer
as $$
begin
  insert into public.monthly_summary (user_id, month, total_hours, tasks_completed, attendance_percentage, final_score)
  select
    u.id,
    target_month,
    coalesce(sum(a.total_hours), 0),
    coalesce(sum(case when d.status = 'Completed' then 1 else 0 end), 0),
    coalesce(avg(case when a.login_time is not null then 100 else 0 end), 0),
    (
      coalesce(avg(case when a.login_time is not null then 100 else 0 end), 0) * 0.4 +
      coalesce(sum(case when d.status = 'Completed' then 1 else 0 end), 0) * 0.3 +
      coalesce(sum(a.total_hours), 0) * 0.2 +
      coalesce(avg(case when a.login_time::time <= time '09:10' then 100 else 50 end), 0) * 0.1
    )
  from public.users u
  left join public.attendance a on a.user_id = u.id and date_trunc('month', a.date)::date = target_month
  left join public.daily_logs d on d.user_id = u.id and date_trunc('month', d.date)::date = target_month
  where u.role = 'employee' and u.status = 'active'
  group by u.id
  on conflict (user_id, month) do update set
    total_hours = excluded.total_hours,
    tasks_completed = excluded.tasks_completed,
    attendance_percentage = excluded.attendance_percentage,
    final_score = excluded.final_score;
end;
$$;

create or replace function public.assign_employee_of_month(target_month date default date_trunc('month', current_date)::date)
returns void
language plpgsql
security definer
as $$
declare
  winner uuid;
begin
  select user_id into winner
  from public.monthly_summary
  where month = target_month
  order by final_score desc
  limit 1;

  if winner is not null then
    insert into public.employee_rewards (user_id, month, year, title)
    values (winner, extract(month from target_month), extract(year from target_month), 'Employee of the Month')
    on conflict do nothing;
  end if;
end;
$$;

-- Schedule via pg_cron in Supabase SQL editor:
-- select cron.schedule('daily-performance', '30 18 * * *', $$select public.compute_daily_performance(current_date);$$);
-- select cron.schedule('monthly-summary', '10 0 1 * *', $$select public.compute_monthly_summary(date_trunc('month', current_date - interval '1 month')::date); select public.assign_employee_of_month(date_trunc('month', current_date - interval '1 month')::date);$$);
