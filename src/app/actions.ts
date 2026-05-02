// Barrel file: re-export all modular server actions
// This preserves backward compatibility for components importing from @/app/actions

// Auth & Employee Management
export {
  loginAction,
  adminLoginAction,
  adminSignupAction,
  logoutAction,
  changePasswordAction,
  createEmployeeAction,
  updateEmployeeStatusAction,
  resetPasswordAction,
} from "./actions/auth";

// Tasks
export {
  assignTaskAction,
  updateTaskAction,
  deleteTaskAction,
  updateTaskStatusAction,
  addTaskCommentAction,
  addTaskTimeLogAction,
} from "./actions/tasks";

// Attendance
export {
  startWorkAction,
  endWorkAction,
} from "./actions/attendance";

// Leaves
export {
  submitLeaveRequestAction,
  reviewLeaveRequestAction,
} from "./actions/leaves";

// Daily Logs
export {
  submitDailyLogAction,
} from "./actions/daily-logs";

// Notifications
export {
  markNotificationReadAction,
  markAllNotificationsReadAction,
} from "./actions/notifications";

// Profile
export {
  updateProfileAction,
} from "./actions/profile";

// Settings
export {
  updateCompanySettingsAction,
  createDepartmentAction,
  updateDepartmentAction,
  createDesignationAction,
  createHolidayAction,
  deleteHolidayAction,
  createAnnouncementAction,
  deleteAnnouncementAction,
} from "./actions/settings";
