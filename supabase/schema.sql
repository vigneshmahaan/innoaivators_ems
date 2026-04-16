create type user_role as enum ('admin', 'employee');
create type user_status as enum ('active', 'inactive');
create type employee_department as enum ('HR', 'Finance', 'IT', 'Sales', 'Marketing', 'Operations', 'Customer Service', 'Legal', 'Product', 'Design');

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  employee_id text unique not null,
  name text not null,
  email text unique,
  role user_role not null default 'employee',
  department employee_department,
  status user_status not null default 'active',
  is_first_login boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.attendance (
  id bigserial primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  date date not null,
  login_time timestamptz,
  logout_time timestamptz,
  total_hours numeric(5,2) default 0,
  unique (user_id, date)
);

create table if not exists public.daily_logs (
  id bigserial primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  date date not null,
  task_title text not null,
  description text,
  status text not null check (status in ('Completed', 'In Progress')),
  hours_spent numeric(4,2) not null default 0
);

create table if not exists public.performance_stats (
  id bigserial primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  date date not null,
  attendance_score numeric(5,2) not null default 0,
  task_score numeric(5,2) not null default 0,
  total_score numeric(5,2) not null default 0
);

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

create table if not exists public.employee_rewards (
  id bigserial primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  month integer not null,
  year integer not null,
  title text not null,
  unique (user_id, month, year, title)
);

create index if not exists idx_attendance_user_date on public.attendance(user_id, date desc);
create index if not exists idx_logs_user_date on public.daily_logs(user_id, date desc);
create index if not exists idx_perf_user_date on public.performance_stats(user_id, date desc);
