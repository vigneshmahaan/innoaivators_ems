export type UserRole = "admin" | "employee";
export type UserStatus = "active" | "inactive";

export interface UserProfile {
  id: string;
  employee_id: string;
  name: string;
  email: string | null;
  role: UserRole;
  status: UserStatus;
  is_first_login: boolean;
}

export interface DashboardStats {
  totalHours: number;
  attendancePercentage: number;
  tasksCompleted: number;
  productivityScore: number;
}
