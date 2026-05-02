export type UserRole = "admin" | "employee";
export type UserStatus = "active" | "inactive";
export type TaskStatus = "Pending" | "In Progress" | "Completed" | "Cancelled";
export type TaskPriority = "Low" | "Medium" | "High" | "Urgent";
export type LeaveType = "Sick" | "Casual" | "Earned" | "Unpaid" | "Maternity" | "Paternity" | "Bereavement" | "Compensatory";
export type LeaveStatus = "Pending" | "Approved" | "Rejected";
export type NotificationType = "info" | "task" | "leave" | "warning" | "success";
export type DocumentCategory = "contract" | "id_proof" | "address_proof" | "education" | "experience" | "payslip" | "tax" | "other";
export type AuditAction = "create" | "update" | "delete" | "login" | "logout" | "reset_password" | "approve" | "reject" | "assign" | "complete";
export type PayrollStatus = "Draft" | "Review" | "Processed" | "Paid";
export type AnnouncementPriority = "low" | "normal" | "high" | "urgent";

export interface UserProfile {
  id: string;
  employee_id: string;
  name: string;
  email?: string;
  role: UserRole;
  department?: string;
  position?: string;
  phone?: string;
  avatar_url?: string;
  status: UserStatus;
  is_first_login: boolean;
  hire_date?: string;
  created_at: string;
  updated_at?: string;
}

export interface Department {
  id: string;
  name: string;
  code?: string;
  description?: string;
  head_id?: string;
  head_name?: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface Designation {
  id: string;
  title: string;
  department_id?: string;
  department_name?: string;
  description?: string;
  level: number;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface CompanySettings {
  id: number;
  company_name: string;
  company_logo_url?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  phone?: string;
  email?: string;
  website?: string;
  timezone: string;
  currency: string;
  currency_symbol: string;
  work_start_time: string;
  work_end_time: string;
  grace_period_minutes: number;
  half_day_hours: number;
  full_day_hours: number;
  week_start_day: number;
  created_at: string;
  updated_at: string;
}

export interface AttendanceRecord {
  id: number;
  user_id: string;
  date: string;
  login_time?: string;
  logout_time?: string;
  total_hours: number;
  notes?: string;
}

export interface DailyLog {
  id: number;
  user_id: string;
  date: string;
  task_title: string;
  description?: string;
  status: "Completed" | "In Progress";
  hours_spent: number;
}

export interface TaskCategory {
  id: string;
  name: string;
  color: string;
  description?: string;
  status: "active" | "inactive";
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  admin_id: string;
  employee_id: string;
  priority: TaskPriority;
  assign_date: string;
  deadline: string;
  status: TaskStatus;
  progress: number;
  hours_estimated?: number;
  hours_spent?: number;
  category_id?: string;
  category_name?: string;
  category_color?: string;
  created_at: string;
  updated_at: string;
  admin?: { name: string };
  employee?: { name: string; employee_id: string };
}

export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  user_name?: string;
  comment: string;
  created_at: string;
}

export interface TaskTimeLog {
  id: string;
  task_id: string;
  user_id: string;
  start_time: string;
  end_time?: string;
  hours?: number;
  description?: string;
  created_at: string;
}

export interface LeaveRequest {
  id: string;
  user_id: string;
  leave_type: LeaveType;
  from_date: string;
  to_date: string;
  reason?: string;
  status: LeaveStatus;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  users?: { name: string; employee_id: string; department?: string };
}

export interface LeaveBalance {
  id: string;
  user_id: string;
  leave_type: string;
  year: number;
  opening_balance: number;
  earned: number;
  taken: number;
  closing_balance: number;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  type: "public" | "optional" | "restricted";
  description?: string;
  recurring: boolean;
  created_at: string;
}

export interface Shift {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  grace_period_minutes: number;
  half_day_after_minutes: number;
  full_day_hours: number;
  status: "active" | "inactive";
  created_at: string;
}

export interface Overtime {
  id: string;
  user_id: string;
  user_name?: string;
  date: string;
  hours: number;
  rate_multiplier: number;
  reason?: string;
  status: LeaveStatus;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
}

export interface SalaryComponent {
  id: string;
  name: string;
  type: "earning" | "deduction";
  is_fixed: boolean;
  percentage_of_basic?: number;
  fixed_amount?: number;
  is_taxable: boolean;
  is_pf_applicable: boolean;
  is_esi_applicable: boolean;
  display_order: number;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface EmployeeSalaryStructure {
  id: string;
  user_id: string;
  component_id: string;
  component_name?: string;
  component_type?: "earning" | "deduction";
  amount: number;
  effective_from: string;
  effective_to?: string;
}

export interface SalaryRecord {
  id: string;
  user_id: string;
  month: string;
  base_salary: number;
  bonus: number;
  deductions: number;
  tax_amount: number;
  pf_amount: number;
  esi_amount: number;
  professional_tax: number;
  other_deductions: number;
  gross_salary: number;
  net_salary: number;
  status: "Pending" | "Paid";
  paid_at?: string;
  notes?: string;
  created_at: string;
  users?: { name: string; employee_id: string };
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: "company" | "department" | "general";
  department_ids: string[];
  department_names?: string[];
  priority: AnnouncementPriority;
  pinned: boolean;
  published_by: string;
  published_by_name?: string;
  published_at: string;
  expires_at?: string;
  status: "active" | "inactive";
  created_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  user_name?: string;
  name: string;
  file_url: string;
  file_type?: string;
  file_size?: number;
  category: DocumentCategory;
  description?: string;
  uploaded_by: string;
  uploaded_by_name?: string;
  created_at: string;
}

export interface AuditLog {
  id: number;
  user_id?: string;
  user_name?: string;
  action: AuditAction;
  entity_type: string;
  entity_id?: string;
  old_data?: Record<string, unknown>;
  new_data?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface OnboardingItem {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: "general" | "documents" | "it_setup" | "training" | "hr";
  assigned_to?: string;
  assigned_to_name?: string;
  due_date?: string;
  is_completed: boolean;
  completed_at?: string;
  completed_by?: string;
  created_at: string;
}

export interface EmploymentHistory {
  id: string;
  user_id: string;
  event_type: "hired" | "promotion" | "department_change" | "designation_change" | "salary_change" | "termination" | "reinstated" | "other";
  old_value?: string;
  new_value?: string;
  effective_date: string;
  notes?: string;
  created_by?: string;
  created_at: string;
}

export interface PerformanceStat {
  id: number;
  user_id: string;
  date: string;
  attendance_score: number;
  task_score: number;
  total_score: number;
}

export interface EmployeeDashboardData {
  attendance: AttendanceRecord[];
  logs: DailyLog[];
  performance: PerformanceStat[];
  tasks: Task[];
  notifications: Notification[];
  announcements: Announcement[];
  leaveBalances: LeaveBalance[];
  stats: {
    totalHours: number;
    attendancePercentage: number;
    tasksCompleted: number;
    productivityScore: number;
    pendingTasksCount: number;
    unreadNotifications: number;
  };
  hasTodayAttendance: boolean;
  hasEndedToday: boolean;
  companySettings?: CompanySettings;
}

export interface AdminDashboardData {
  totalEmployees: number;
  activeToday: number;
  totalHours: number;
  averageProductivity: number;
  topPerformers: Array<{
    final_score: number;
    tasks_completed: number;
    attendance_percentage: number;
    users: { name: string; employee_id: string } | null;
  }>;
  recentLogs: Array<DailyLog & { users: { name: string; employee_id: string } }>;
  pendingLeaves: number;
  pendingTasks: number;
  pendingOvertime: number;
  pendingRegularizations: number;
  recentAuditLogs: AuditLog[];
  upcomingBirthdays: Array<{ name: string; hire_date?: string }>;
}
