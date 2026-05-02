import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// ✅ FIXED: Added /tasks, /profile, /leave routes — previously missing
const employeeRoutes = [
  "/dashboard",
  "/attendance",
  "/daily-log",
  "/history",
  "/change-password",
  "/tasks",
  "/profile",
  "/leave",
];

const adminRoutes = ["/admin"];

function isEmployeeRoute(pathname: string) {
  return employeeRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

function isAdminRoute(pathname: string) {
  return adminRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

const publicRoutes = ["/login", "/admin-login", "/admin-signup"];

export async function middleware(request: NextRequest) {
  const { user, response, supabase } = await updateSession(request);
  const { pathname } = request.nextUrl;

  // Static assets
  if (pathname.startsWith("/_next") || pathname === "/favicon.ico") {
    return response;
  }

  // Allow public routes for unauthenticated users
  if (!user && publicRoutes.includes(pathname)) {
    return response;
  }

  // Redirect unauthenticated users to login
  if (!user) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Fetch user profile with role and status
  const { data: profile } = await supabase
    .from("users")
    .select("role,status")
    .eq("id", user.id)
    .maybeSingle();

  // Inactive accounts → redirect to login
  if (!profile || profile.status !== "active") {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/login?error=account_inactive", request.url));
  }

  const { role } = profile;

  // Redirect authenticated users away from public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.redirect(
      new URL(role === "admin" ? "/admin/dashboard" : "/dashboard", request.url)
    );
  }

  // Root redirect
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(role === "admin" ? "/admin/dashboard" : "/dashboard", request.url)
    );
  }

  // Role-based access control
  if (role === "employee" && isAdminRoute(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (role === "admin" && isEmployeeRoute(pathname)) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
