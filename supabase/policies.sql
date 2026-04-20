alter table public.users enable row level security;
alter table public.attendance enable row level security;
alter table public.daily_logs enable row level security;
alter table public.performance_stats enable row level security;
alter table public.monthly_summary enable row level security;
alter table public.employee_rewards enable row level security;

create or replace function public.current_user_role()
returns text
language sql
stable
as $$
  select role::text from public.users where id = auth.uid()
$$;

create policy "users can read own profile"
on public.users for select
using (id = auth.uid() or public.current_user_role() = 'admin');

create policy "admins can manage users"
on public.users for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "employees own attendance, admins all"
on public.attendance for all
using (user_id = auth.uid() or public.current_user_role() = 'admin')
with check (user_id = auth.uid() or public.current_user_role() = 'admin');

create policy "employees own logs, admins all"
on public.daily_logs for all
using (user_id = auth.uid() or public.current_user_role() = 'admin')
with check (user_id = auth.uid() or public.current_user_role() = 'admin');

create policy "employees own performance, admins all"
on public.performance_stats for all
using (user_id = auth.uid() or public.current_user_role() = 'admin')
with check (user_id = auth.uid() or public.current_user_role() = 'admin');

create policy "employees own summary, admins all"
on public.monthly_summary for all
using (user_id = auth.uid() or public.current_user_role() = 'admin')
with check (user_id = auth.uid() or public.current_user_role() = 'admin');

create policy "employees own rewards, admins all"
on public.employee_rewards for all
using (user_id = auth.uid() or public.current_user_role() = 'admin')
with check (user_id = auth.uid() or public.current_user_role() = 'admin');

-- Tasks policies
alter table public.tasks enable row level security;

create policy "Admins can manage all tasks"
on public.tasks for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "Employees can view own tasks"
on public.tasks for select
using (employee_id = auth.uid());

create policy "Employees can update their own task status"
on public.tasks for update
using (employee_id = auth.uid())
with check (employee_id = auth.uid());
