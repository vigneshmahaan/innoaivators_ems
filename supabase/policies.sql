-- ============================================================
-- EMS ROW LEVEL SECURITY POLICIES
-- Run AFTER schema.sql in Supabase SQL Editor
-- ============================================================

-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.attendance enable row level security;
alter table public.daily_logs enable row level security;
alter table public.performance_stats enable row level security;
alter table public.monthly_summary enable row level security;
alter table public.employee_rewards enable row level security;
alter table public.tasks enable row level security;
alter table public.leave_requests enable row level security;
alter table public.salary_records enable row level security;
alter table public.notifications enable row level security;

-- ─── HELPER FUNCTION ────────────────────────────────────────
create or replace function public.current_user_role()
returns text
language sql
stable security definer
as $$
  select role::text from public.users where id = auth.uid()
$$;

-- ─── USERS POLICIES ─────────────────────────────────────────
-- Employees can read own profile; admins can read all
create policy "users_select"
  on public.users for select
  using (id = auth.uid() or public.current_user_role() = 'admin');

-- Only admins can insert/update/delete users
create policy "users_admin_all"
  on public.users for all
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

-- Employees can update their own non-sensitive fields
create policy "users_self_update"
  on public.users for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- ─── ATTENDANCE POLICIES ────────────────────────────────────
create policy "attendance_own_or_admin"
  on public.attendance for all
  using (user_id = auth.uid() or public.current_user_role() = 'admin')
  with check (user_id = auth.uid() or public.current_user_role() = 'admin');

-- ─── DAILY LOGS POLICIES ────────────────────────────────────
create policy "logs_own_or_admin"
  on public.daily_logs for all
  using (user_id = auth.uid() or public.current_user_role() = 'admin')
  with check (user_id = auth.uid() or public.current_user_role() = 'admin');

-- ─── PERFORMANCE STATS POLICIES ─────────────────────────────
create policy "perf_own_or_admin"
  on public.performance_stats for all
  using (user_id = auth.uid() or public.current_user_role() = 'admin')
  with check (user_id = auth.uid() or public.current_user_role() = 'admin');

-- ─── MONTHLY SUMMARY POLICIES ───────────────────────────────
create policy "summary_own_or_admin"
  on public.monthly_summary for all
  using (user_id = auth.uid() or public.current_user_role() = 'admin')
  with check (user_id = auth.uid() or public.current_user_role() = 'admin');

-- ─── REWARDS POLICIES ───────────────────────────────────────
create policy "rewards_own_or_admin"
  on public.employee_rewards for all
  using (user_id = auth.uid() or public.current_user_role() = 'admin')
  with check (user_id = auth.uid() or public.current_user_role() = 'admin');

-- ─── TASKS POLICIES ─────────────────────────────────────────
-- Admins can manage all tasks
create policy "tasks_admin_all"
  on public.tasks for all
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

-- Employees can view their own tasks
create policy "tasks_employee_select"
  on public.tasks for select
  using (employee_id = auth.uid());

-- Employees can update only status of their own tasks
create policy "tasks_employee_update_status"
  on public.tasks for update
  using (employee_id = auth.uid())
  with check (employee_id = auth.uid());

-- ─── LEAVE REQUESTS POLICIES ────────────────────────────────
-- Admins can manage all leaves
create policy "leaves_admin_all"
  on public.leave_requests for all
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

-- Employees can view and insert their own leave requests
create policy "leaves_employee_select"
  on public.leave_requests for select
  using (user_id = auth.uid());

create policy "leaves_employee_insert"
  on public.leave_requests for insert
  with check (user_id = auth.uid());

-- ─── SALARY RECORDS POLICIES ────────────────────────────────
-- Admins can manage all salary records
create policy "salary_admin_all"
  on public.salary_records for all
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

-- Employees can only view their own salary records
create policy "salary_employee_select"
  on public.salary_records for select
  using (user_id = auth.uid());

-- ─── NOTIFICATIONS POLICIES ─────────────────────────────────
-- Admins can manage all notifications (for sending)
create policy "notifications_admin_all"
  on public.notifications for all
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

-- Employees can view and update their own notifications
create policy "notifications_employee_select"
  on public.notifications for select
  using (user_id = auth.uid());

create policy "notifications_employee_update"
  on public.notifications for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
