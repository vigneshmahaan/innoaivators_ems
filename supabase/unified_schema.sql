-- ============================================================
-- EMS PROFESSIONAL UNIFIED SCHEMA
-- Run this ENTIRE file in Supabase SQL Editor
-- Creates ALL tables from scratch (original + v2 enhancements)
-- ============================================================

-- ============================================================
-- PART 1: BASE TABLES (Original Schema)
-- ============================================================

-- Enums (PostgreSQL CREATE TYPE does not support IF NOT EXISTS)
-- We use DO blocks to safely create them only if they don't exist

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type user_role as enum ('admin', 'employee');
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_status') then
    create type user_status as enum ('active', 'inactive');
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'employee_department') then
    create type employee_department as enum (
      'HR', 'Finance', 'IT', 'Sales', 'Marketing',
      'Operations', 'Customer Service', 'Legal', 'Product', 'Design'
    );
  end if;
end $$;

-- ─── USERS ──────────────────────────────────────────────────
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  employee_id text unique not null,
  name text not null,
  email text unique,
  role user_role not null default 'employee',
  department employee_department,
  position text,
  phone text,
  avatar_url text,
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
  leave_type text not null check (leave_type in ('Sick', 'Casual', 'Earned', 'Unpaid', 'Maternity', 'Paternity', 'Bereavement', 'Compensatory')),
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

-- ============================================================
-- PART 2: V2 ENHANCEMENTS (New Tables)
-- ============================================================

-- ─── COMPANY SETTINGS ───────────────────────────────────────
create table if not exists public.company_settings (
  id serial primary key,
  company_name text not null default 'My Company',
  company_logo_url text,
  address text,
  city text,
  state text,
  country text,
  zip_code text,
  phone text,
  email text,
  website text,
  timezone text not null default 'UTC',
  currency text not null default 'USD',
  currency_symbol text not null default '$',
  work_start_time time not null default '09:00',
  work_end_time time not null default '18:00',
  grace_period_minutes integer not null default 15,
  half_day_hours numeric(4,2) not null default 4,
  full_day_hours numeric(4,2) not null default 8,
  week_start_day integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.company_settings (id) values (1)
on conflict (id) do nothing;

-- ─── DEPARTMENTS ────────────────────────────────────────────
create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  code text unique,
  description text,
  head_id uuid references public.users(id) on delete set null,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── DESIGNATIONS ───────────────────────────────────────────
create table if not exists public.designations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  department_id uuid references public.departments(id) on delete set null,
  description text,
  level integer not null default 1,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── HOLIDAYS ───────────────────────────────────────────────
create table if not exists public.holidays (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  date date not null,
  type text not null default 'public' check (type in ('public', 'optional', 'restricted')),
  description text,
  recurring boolean not null default false,
  created_at timestamptz not null default now()
);

-- ─── LEAVE POLICIES ─────────────────────────────────────────
create table if not exists public.leave_policies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  leave_type text not null check (leave_type in ('Sick', 'Casual', 'Earned', 'Unpaid', 'Maternity', 'Paternity', 'Bereavement', 'Compensatory')),
  days_per_year numeric(5,2) not null default 0,
  carry_forward boolean not null default false,
  max_carry_forward_days numeric(5,2) default 0,
  requires_document boolean not null default false,
  applicable_to text not null default 'all' check (applicable_to in ('all', 'department', 'designation', 'employee')),
  applicable_ids uuid[] default '{}',
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── LEAVE BALANCES ─────────────────────────────────────────
create table if not exists public.leave_balances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  leave_type text not null,
  year integer not null,
  opening_balance numeric(5,2) not null default 0,
  earned numeric(5,2) not null default 0,
  taken numeric(5,2) not null default 0,
  closing_balance numeric(5,2) generated always as (opening_balance + earned - taken) stored,
  unique (user_id, leave_type, year)
);

-- ─── SHIFTS ─────────────────────────────────────────────────
create table if not exists public.shifts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  start_time time not null,
  end_time time not null,
  grace_period_minutes integer not null default 15,
  half_day_after_minutes integer not null default 240,
  full_day_hours numeric(4,2) not null default 8,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now()
);

-- ─── EMPLOYEE SHIFTS ────────────────────────────────────────
create table if not exists public.employee_shifts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  shift_id uuid not null references public.shifts(id) on delete cascade,
  effective_from date not null default current_date,
  effective_to date,
  unique (user_id, effective_from)
);

-- ─── ATTENDANCE REGULARIZATION ──────────────────────────────
create table if not exists public.attendance_regularizations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  date date not null,
  login_time time,
  logout_time time,
  reason text not null,
  status text not null default 'Pending' check (status in ('Pending', 'Approved', 'Rejected')),
  reviewed_by uuid references public.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ─── OVERTIME ───────────────────────────────────────────────
create table if not exists public.overtime (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  date date not null,
  hours numeric(4,2) not null default 0,
  rate_multiplier numeric(3,2) not null default 1.5,
  reason text,
  status text not null default 'Pending' check (status in ('Pending', 'Approved', 'Rejected')),
  reviewed_by uuid references public.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, date)
);

-- ─── TASK CATEGORIES ────────────────────────────────────────
create table if not exists public.task_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  color text not null default '#3b82f6',
  description text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now()
);

-- ─── TASK COMMENTS ──────────────────────────────────────────
create table if not exists public.task_comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  comment text not null,
  created_at timestamptz not null default now()
);

-- ─── TASK TIME LOGS ─────────────────────────────────────────
create table if not exists public.task_time_logs (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  start_time timestamptz not null,
  end_time timestamptz,
  hours numeric(5,2) default 0,
  description text,
  created_at timestamptz not null default now()
);

-- ─── SALARY COMPONENTS ──────────────────────────────────────
create table if not exists public.salary_components (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('earning', 'deduction')),
  is_fixed boolean not null default true,
  percentage_of_basic numeric(5,2) default 0,
  fixed_amount numeric(12,2) default 0,
  is_taxable boolean not null default false,
  is_pf_applicable boolean not null default false,
  is_esi_applicable boolean not null default false,
  display_order integer not null default 0,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── EMPLOYEE SALARY STRUCTURES ─────────────────────────────
create table if not exists public.employee_salary_structures (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  component_id uuid not null references public.salary_components(id) on delete cascade,
  amount numeric(12,2) not null default 0,
  effective_from date not null default current_date,
  effective_to date,
  unique (user_id, component_id, effective_from)
);

-- ─── ANNOUNCEMENTS ──────────────────────────────────────────
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  type text not null default 'company' check (type in ('company', 'department', 'general')),
  department_ids uuid[] default '{}',
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  pinned boolean not null default false,
  published_by uuid not null references public.users(id) on delete cascade,
  published_at timestamptz not null default now(),
  expires_at timestamptz,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now()
);

-- ─── DOCUMENTS ──────────────────────────────────────────────
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  file_url text not null,
  file_type text,
  file_size integer,
  category text not null default 'other' check (category in ('contract', 'id_proof', 'address_proof', 'education', 'experience', 'payslip', 'tax', 'other')),
  description text,
  uploaded_by uuid not null references public.users(id),
  created_at timestamptz not null default now()
);

-- ─── AUDIT LOGS ─────────────────────────────────────────────
create table if not exists public.audit_logs (
  id bigserial primary key,
  user_id uuid references public.users(id) on delete set null,
  user_name text,
  action text not null,
  entity_type text not null,
  entity_id text,
  old_data jsonb,
  new_data jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

-- ─── EMPLOYEE ONBOARDING CHECKLIST ──────────────────────────
create table if not exists public.onboarding_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text,
  category text not null default 'general' check (category in ('general', 'documents', 'it_setup', 'training', 'hr')),
  assigned_to uuid references public.users(id) on delete set null,
  due_date date,
  is_completed boolean not null default false,
  completed_at timestamptz,
  completed_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ─── EMPLOYMENT HISTORY ─────────────────────────────────────
create table if not exists public.employment_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  event_type text not null check (event_type in ('hired', 'promotion', 'department_change', 'designation_change', 'salary_change', 'termination', 'reinstated', 'other')),
  old_value text,
  new_value text,
  effective_date date not null,
  notes text,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- PART 3: ALTER EXISTING TABLES (Add new columns)
-- ============================================================

-- Add new columns to tasks table
alter table public.tasks add column if not exists category_id uuid references public.task_categories(id) on delete set null;
alter table public.tasks add column if not exists progress integer not null default 0 check (progress >= 0 and progress <= 100);
alter table public.tasks add column if not exists hours_estimated numeric(5,2) default 0;
alter table public.tasks add column if not exists hours_spent numeric(5,2) default 0;

-- Add new columns to salary_records table
alter table public.salary_records add column if not exists tax_amount numeric(12,2) default 0;
alter table public.salary_records add column if not exists pf_amount numeric(12,2) default 0;
alter table public.salary_records add column if not exists esi_amount numeric(12,2) default 0;
alter table public.salary_records add column if not exists professional_tax numeric(12,2) default 0;
alter table public.salary_records add column if not exists other_deductions numeric(12,2) default 0;
alter table public.salary_records add column if not exists gross_salary numeric(12,2) default 0;

-- ============================================================
-- PART 4: INDEXES
-- ============================================================

-- Original indexes
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

-- New indexes
create index if not exists idx_departments_head on public.departments(head_id);
create index if not exists idx_designations_dept on public.designations(department_id);
create index if not exists idx_holidays_date on public.holidays(date);
create index if not exists idx_leave_balances_user on public.leave_balances(user_id, year);
create index if not exists idx_employee_shifts_user on public.employee_shifts(user_id);
create index if not exists idx_attendance_reg_user on public.attendance_regularizations(user_id, date);
create index if not exists idx_overtime_user on public.overtime(user_id, date);
create index if not exists idx_task_comments_task on public.task_comments(task_id);
create index if not exists idx_task_time_logs_task on public.task_time_logs(task_id);
create index if not exists idx_announcements_published on public.announcements(published_at desc);
create index if not exists idx_documents_user on public.documents(user_id, category);
create index if not exists idx_audit_logs_user on public.audit_logs(user_id, created_at desc);
create index if not exists idx_audit_logs_entity on public.audit_logs(entity_type, entity_id);
create index if not exists idx_onboarding_user on public.onboarding_items(user_id);
create index if not exists idx_employment_history_user on public.employment_history(user_id, effective_date desc);

-- ============================================================
-- PART 5: TRIGGERS
-- ============================================================

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

create or replace trigger company_settings_updated_at
  before update on public.company_settings
  for each row execute function public.set_updated_at();

create or replace trigger departments_updated_at
  before update on public.departments
  for each row execute function public.set_updated_at();

create or replace trigger designations_updated_at
  before update on public.designations
  for each row execute function public.set_updated_at();

create or replace trigger leave_policies_updated_at
  before update on public.leave_policies
  for each row execute function public.set_updated_at();

create or replace trigger salary_components_updated_at
  before update on public.salary_components
  for each row execute function public.set_updated_at();
