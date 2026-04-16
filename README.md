# INNOAIVATORS Employee Management System

Production-ready EMS built with Next.js App Router, TypeScript, Tailwind, Supabase Auth/Postgres, and Recharts.

## Features

- Admin-controlled user provisioning (no public signup)
- Employee login via employee ID/email + password
- RBAC + centralized middleware route protection
- Employee portal: dashboard, attendance, daily logs, history, password change
- Admin portal: dashboard, employees, attendance, reports
- Monthly leaderboard and Employee of the Month scoring
- Supabase SQL scripts for schema, RLS policies, and scheduled jobs

## Tech stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS
- Supabase (PostgreSQL, Auth, RLS)
- Recharts for analytics charts
- Vercel-ready deployment

## Environment

Copy `.env.example` to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Supabase setup

Run the SQL files in order in your Supabase SQL editor:

1. `supabase/schema.sql`
2. `supabase/policies.sql`
3. `supabase/jobs.sql`

## Local development

```bash
npm install
npm run dev
```

## Route map

- Public: `/login`
- Employee: `/dashboard`, `/attendance`, `/daily-log`, `/history`, `/change-password`
- Admin: `/admin/dashboard`, `/admin/employees`, `/admin/attendance`, `/admin/reports`

## Deployment

- Set environment variables in Vercel project settings
- Deploy using:

```bash
npm run build
```
