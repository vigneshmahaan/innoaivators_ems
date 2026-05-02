-- ============================================================
-- EMS COMPLETE SCHEMA — Run in Supabase SQL Editor
-- ============================================================

-- Enums
create type if not exists user_role as enum ('admin', 'employee');
create type if not exists user_status as enum ('active', 'inactive');
create type if not exists employee_department as enum (
  'HR', 'Finance', 'IT', 'Sales', 'Marketing',
  'Operations', 'Customer Service', 'Legal', 'Product', 'Design'
);

-- ─── USERS ──────────────────────────────────────────────────
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  employee_id text unique not null,
  name text not null,
  email text unique,
  role user_role not null default 'employee',
  department employee_department,
  position text,                          -- Job title / position
  phone text,                             -- Contact number
  avatar_url text,                        -- Profile picture URL
  status user_status not null default 'active',
  is_first_login boolean not null default true,
  hire_date date default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── ATTENDANCE ─────────────────────────────────────────────
create table if not exists public.attendance (
  id bigserial primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  date date not null,
  login_time timestamptz,
  logout_time timestamptz,
  total_hours numeric(5,2) default 0,
  notes text,
  unique (user_id, date)
);

-- ─── DAILY LOGS ─────────────────────────────────────────────
create table if not exists public.daily_logs (
  id bigserial primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  date date not null,
  task_title text not null,
  description text,
  status text not null check (status in ('Completed', 'In Progress')),
  hours_spent numeric(4,2) not null default 0
);

-- ─── TASKS ──────────────────────────────────────────────────
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  admin_id uuid not null references public.users(id) on delete cascade,
  employee_id uuid not null references public.users(id) on delete cascade,
  priority text not null default 'Medium' check (priority in ('Low', 'Medium', 'High', 'Urgent')),
  assign_date timestamptz not null default now(),
  deadline timestamptz not null,
  status text not null default 'Pending' check (status in ('Pending', 'In Progress', 'Completed', 'Cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── LEAVE REQUESTS ─────────────────────────────────────────
create table if not exists public.leave_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  leave_type text not null check (leave_type in ('Sick', 'Casual', 'Earned', 'Unpaid')),
  from_date date not null,
  to_date date not null,
  reason text,
  status text not null default 'Pending' check (status in ('Pending', 'Approved', 'Rejected')),
  reviewed_by uuid references public.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ─── SALARY RECORDS ─────────────────────────────────────────
create table if not exists public.salary_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  month date not null,
  base_salary numeric(12,2) not null default 0,
  bonus numeric(12,2) default 0,
  deductions numeric(12,2) default 0,
  net_salary numeric(12,2) generated always as (base_salary + coalesce(bonus, 0) - coalesce(deductions, 0)) stored,
  status text not null default 'Pending' check (status in ('Pending', 'Paid')),
  paid_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  unique (user_id, month)
);

-- ─── NOTIFICATIONS ──────────────────────────────────────────
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null default 'info' check (type in ('info', 'task', 'leave', 'warning', 'success')),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ─── PERFORMANCE STATS ──────────────────────────────────────
create table if not exists public.performance_stats (
  id bigserial primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  date date not null,
  attendance_score numeric(5,2) not null default 0,
  task_score numeric(5,2) not null default 0,
  total_score numeric(5,2) not null default 0
);

-- ─── MONTHLY SUMMARY ────────────────────────────────────────
create table if not exists public.monthly_summary (
  id bigserial primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  month date not null,
  total_hours numeric(6,2) not null default 0,
  tasks_completed integer not null default 0,
  attendance_percentage numeric(5,2) not null default 0,
  final_score numeric(6,2) not null default 0,
  unique (user_id, month)
);

-- ─── EMPLOYEE REWARDS ───────────────────────────────────────
create table if not exists public.employee_rewards (
  id bigserial primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  month integer not null,
  year integer not null,
  title text not null,
  unique (user_id, month, year, title)
);

-- ─── ANNOUNCEMENTS ──────────────────────────────────────────
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  type text not null default 'company' check (type in ('company', 'department', 'general')),
  department_ids uuid[],                 -- Array of department IDs
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  pinned boolean not null default false,
  status text not null default 'active' check (status in ('active', 'inactive')),
  published_by uuid not null references public.users(id),
  expires_at timestamptz,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── INDEXES ────────────────────────────────────────────────
create index if not exists idx_attendance_user_date on public.attendance(user_id, date desc);
create index if not exists idx_logs_user_date on public.daily_logs(user_id, date desc);
create index if not exists idx_tasks_employee on public.tasks(employee_id, assign_date desc);
create index if not exists idx_tasks_admin on public.tasks(admin_id, assign_date desc);
create index if not exists idx_tasks_status on public.tasks(status);
create index if not exists idx_leave_user on public.leave_requests(user_id, created_at desc);
create index if not exists idx_leave_status on public.leave_requests(status);
create index if not exists idx_notifications_user on public.notifications(user_id, created_at desc);
create index if not exists idx_notifications_unread on public.notifications(user_id, is_read);
create index if not exists idx_salary_user_month on public.salary_records(user_id, month desc);

-- ─── UPDATED_AT TRIGGER ─────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger users_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

create or replace trigger tasks_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();

create or replace trigger announcements_updated_at
  before update on public.announcements
  for each row execute function public.set_updated_at();
