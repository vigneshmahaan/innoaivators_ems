# Dual Login Portal Implementation

## Overview
Your EMS now has a **separate login system** for admins and employees with clear role-based access control.

---

## 🔐 Login Portals

### 1. Employee Portal: `/login`
- **For**: Employees who already have accounts created by admins
- **Login with**: Employee ID or Email + Password
- **After login**: Redirected to `/dashboard`
- **Features**:
  - View daily dashboard (hours, attendance, tasks)
  - Track attendance (login/logout)
  - Submit daily task logs
  - View work history
  - Change password independently

### 2. Admin Portal: `/admin-login`
- **For**: Administrators of the system
- **Two options**:
  
  #### Option A: Admin Login
  - Email + Password
  - After login: Redirected to `/admin/dashboard`
  
  #### Option B: Create First Admin Account
  - Click "Create New Admin Account"
  - Fill: Name, Email, Password (min 6 chars)
  - Account auto-created and setup
  - Redirected to login page to complete authentication
  - First admin can then create other admins and employees

- **After login**: Redirected to `/admin/dashboard`
- **Features**:
  - Employee Management: Create/view/reset employee accounts
  - Attendance Monitoring: Review all employee attendance
  - Analytics & Reports: View monthly leaderboard, Employee of the Month

---

## 📋 Workflow

### Starting the System (First Time Setup)
```
1. Go to: http://localhost:3000/admin-login
2. Click "Create New Admin Account"
3. Fill in your admin details
4. You're now the first admin!
5. Go to /admin/employees to create employee accounts
```

### Admin Creating Employee Accounts
```
1. Login to admin portal: /admin-login
2. Go to "Employees" section
3. Fill the "Add Employee" form:
   - Employee ID (unique identifier)
   - Name
   - Email
   - Temporary Password (share securely)
   - Role: select "employee"
4. Click "Create Account"
5. Share Employee ID and Password with the employee
```

### Employee Logging In
```
1. Go to: http://localhost:3000/login
2. Enter Employee ID (or Email) + Password (provided by admin)
3. Access your employee dashboard
4. First action: Change your password at /change-password
```

### Employee Changing Password
```
1. Login to employee portal
2. Go to "Change Password"
3. Enter old password
4. Enter new password
5. Password is updated - use this going forward
```

### Creating Additional Admins
```
1. Login to admin portal as an existing admin
2. Go to /admin/employees
3. In "Add Employee" form:
   - Fill details as normal
   - Role: select "admin"
4. New admin receives credentials and can login to /admin-login
```

---

## 🔒 Access Control & Route Protection

### Employee Can Access:
- `/login` - Employee login
- `/dashboard` - Main employee dashboard
- `/attendance` - Attendance tracking
- `/daily-log` - Submit daily task logs
- `/history/` - View past work logs
- `/change-password` - Change own password

### Employee CANNOT Access:
- `/admin` - Any admin routes (auto-redirected to `/dashboard`)
- `/admin-login` - Admin portal (auto-redirected to `/dashboard`)

### Admin Can Access:
- `/admin-login` - Admin login/signup
- `/admin/dashboard` - Admin dashboard
- `/admin/employees` - Create & manage employees
- `/admin/attendance` - Review all employee attendance
- `/admin/reports` - Analytics & leaderboards

### Admin CANNOT Access:
- Employee routes - Auto-redirected to `/admin/dashboard`

---

## 📄 Key Files Modified/Created

### New Files
- `src/app/admin-login/page.tsx` - Admin login & signup page
- `src/components/admin-login-form.tsx` - Admin login form component
- `src/components/admin-signup-form.tsx` - Admin signup form component

### Modified Files
- `middleware.ts` - Enhanced routing with dual login support
- `src/app/login/page.tsx` - Updated employee login UI
- `src/app/actions.ts` - Added `adminLoginAction` and `adminSignupAction`

---

## 🚀 URL Quick Reference

| Purpose | URL | Auth Required |
|---------|-----|---|
| Employee Login | `/login` | No |
| Admin Login | `/admin-login` | No |
| Employee Dashboard | `/dashboard` | Yes (Employee) |
| Admin Dashboard | `/admin/dashboard` | Yes (Admin) |
| Manage Employees | `/admin/employees` | Yes (Admin) |
| Attendance Tracking | `/attendance` | Yes (Employee) |
| Daily Logs | `/daily-log` | Yes (Employee) |
| Change Password | `/change-password` | Yes (Employee) |
| Admin Attendance | `/admin/attendance` | Yes (Admin) |
| Reports | `/admin/reports` | Yes (Admin) |

---

## ✅ Features Summary

### For Admins:
✓ Self-signup for first admin
✓ Create employee accounts with temporary passwords
✓ Create additional admin accounts
✓ View all employee attendance
✓ View performance analytics
✓ Monthly leaderboard & Employee of the Month

### For Employees:
✓ Login with Employee ID or Email
✓ Change their own password
✓ Track daily attendance (login/logout)
✓ Submit daily task logs
✓ View performance metrics
✓ View attendance history

---

## 🔄 Security Features

1. **Role-Based Access Control (RBAC)**
   - Employees cannot access admin routes
   - Admins cannot access employee routes

2. **Password Management**
   - Admins set temporary passwords for new employees
   - Employees must change passwords on first access
   - Employees can self-service change passwords

3. **Session Management**
   - Middleware enforces route protection on every request
   - Inactive users are redirected to login
   - Logged-in users auto-redirected away from auth pages

4. **Status Checking**
   - Only "active" users can login
   - Admins can deactivate employees
   - Inactive employees cannot access any features

---

## 📝 Notes for Implementation

- First admin signup creates initial admin account manually without admin verification
- Employee IDs must be unique within the system
- Passwords must be at least 6 characters for admin signup
- Employee accounts are marked `is_first_login=true` until they change their password
- All user data is stored in Supabase PostgreSQL
- Row-Level Security (RLS) policies ensure data isolation

---

## 🆘 Troubleshooting

**Admin cannot access /admin-login after signing up**
→ Check middleware - should redirect authenticated admin to /admin/dashboard

**Employee sees "Admins must use admin login portal" error**
→ This employee account has admin role - use /admin-login instead

**"Only admins can access admin portal" error**
→ This account has employee role - use /login instead

**Cannot create employee without admin access**
→ Only authenticated admins can create employees. Admin must login first.
