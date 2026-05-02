import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(1, "Employee ID or email is required"),
  password: z.string().min(1, "Password is required"),
});

export const adminLoginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

export const adminSignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number")
    .regex(/[^A-Za-z0-9]/, "Password must contain a special character"),
});

export const createEmployeeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  employee_id: z.string().min(1, "Employee ID is required"),
  email: z.string().email("Valid email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
  department: z.string().min(1, "Department is required"),
  position: z.string().optional(),
  phone: z.string().optional(),
});

export const changePasswordSchema = z
  .object({
    old_password: z.string().min(1, "Current password is required"),
    new_password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[0-9]/, "Password must contain a number")
      .regex(/[^A-Za-z0-9]/, "Password must contain a special character"),
    confirm_password: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export const assignTaskSchema = z.object({
  employee_id: z.string().uuid("Valid employee is required"),
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().max(2000, "Description too long").optional(),
  deadline: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
    message: "Valid deadline is required",
  }),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]),
  category_id: z.string().uuid().optional(),
  hours_estimated: z.coerce.number().min(0).max(1000).optional(),
});

export const updateTaskSchema = z.object({
  task_id: z.string().uuid(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  deadline: z.string().optional(),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]).optional(),
  category_id: z.string().uuid().optional().nullable(),
  hours_estimated: z.coerce.number().min(0).max(1000).optional(),
});

export const updateTaskStatusSchema = z.object({
  task_id: z.string().uuid(),
  status: z.enum(["Pending", "In Progress", "Completed", "Cancelled"]),
  progress: z.coerce.number().min(0).max(100).optional(),
});

export const taskCommentSchema = z.object({
  task_id: z.string().uuid(),
  comment: z.string().min(1, "Comment is required").max(1000, "Comment too long"),
});

export const submitLeaveSchema = z.object({
  leave_type: z.string().min(1, "Leave type is required"),
  from_date: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
    message: "Valid from date is required",
  }),
  to_date: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
    message: "Valid to date is required",
  }),
  reason: z.string().max(500).optional(),
}).refine((data) => new Date(data.from_date) <= new Date(data.to_date), {
  message: "From date must be before or equal to to date",
  path: ["to_date"],
});

export const dailyLogSchema = z.object({
  task_title: z.string().min(1, "Task title is required").max(200),
  description: z.string().max(1000).optional(),
  status: z.enum(["Completed", "In Progress"]),
  hours_spent: z.coerce.number().min(0.1, "Hours must be greater than 0").max(24, "Max 24 hours"),
});

export const companySettingsSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zip_code: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  website: z.string().optional(),
  timezone: z.string().min(1, "Timezone is required"),
  currency: z.string().min(1, "Currency is required"),
  currency_symbol: z.string().min(1, "Currency symbol is required"),
  work_start_time: z.string().min(1, "Start time is required"),
  work_end_time: z.string().min(1, "End time is required"),
  grace_period_minutes: z.coerce.number().min(0).max(120),
  half_day_hours: z.coerce.number().min(0).max(12),
  full_day_hours: z.coerce.number().min(0).max(24),
});

export const departmentSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  code: z.string().max(20).optional(),
  description: z.string().max(500).optional(),
  head_id: z.string().uuid().optional().nullable(),
});

export const designationSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  department_id: z.string().uuid().optional().nullable(),
  description: z.string().max(500).optional(),
  level: z.coerce.number().min(1).max(100),
});

export const holidaySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  date: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
    message: "Valid date is required",
  }),
  type: z.enum(["public", "optional", "restricted"]),
  description: z.string().max(500).optional(),
  recurring: z.boolean().default(false),
});

export const announcementSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().min(1, "Content is required").max(5000),
  type: z.enum(["company", "department", "general"]),
  department_ids: z.array(z.string().uuid()).optional(),
  priority: z.enum(["low", "normal", "high", "urgent"]),
  pinned: z.boolean().default(false),
  expires_at: z.string().optional().nullable().or(z.literal(null)),
});

export const salaryComponentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["earning", "deduction"]),
  is_fixed: z.boolean().default(true),
  percentage_of_basic: z.coerce.number().min(0).max(100).optional(),
  fixed_amount: z.coerce.number().min(0).optional(),
  is_taxable: z.boolean().default(false),
  is_pf_applicable: z.boolean().default(false),
  is_esi_applicable: z.boolean().default(false),
  display_order: z.coerce.number().min(0),
});

export const processPayrollSchema = z.object({
  user_id: z.string().uuid(),
  month: z.string().min(1, "Month is required"),
  base_salary: z.coerce.number().min(0),
  bonus: z.coerce.number().min(0).default(0),
  deductions: z.coerce.number().min(0).default(0),
  notes: z.string().max(1000).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type AdminSignupInput = z.infer<typeof adminSignupSchema>;
export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type AssignTaskInput = z.infer<typeof assignTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;
export type TaskCommentInput = z.infer<typeof taskCommentSchema>;
export type SubmitLeaveInput = z.infer<typeof submitLeaveSchema>;
export type DailyLogInput = z.infer<typeof dailyLogSchema>;
export type CompanySettingsInput = z.infer<typeof companySettingsSchema>;
export type DepartmentInput = z.infer<typeof departmentSchema>;
export type DesignationInput = z.infer<typeof designationSchema>;
export type HolidayInput = z.infer<typeof holidaySchema>;
export type AnnouncementInput = z.infer<typeof announcementSchema>;
export type SalaryComponentInput = z.infer<typeof salaryComponentSchema>;
export type ProcessPayrollInput = z.infer<typeof processPayrollSchema>;
