import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const employeeRoutes = ["/dashboard", "/attendance", "/daily-log", "/history", "/change-password"];

function isEmployeeRoute(pathname: string) {
  return employeeRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export async function middleware(request: NextRequest) {
  const { user, response, supabase } = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next") || pathname === "/favicon.ico") {
    return response;
  }

  // Allow unauthenticated access to login pages
  if (!user && (pathname === "/login" || pathname === "/admin-login")) {
    return response;
  }

  // Redirect unauthenticated users to login
  if (!user && pathname !== "/login" && pathname !== "/admin-login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is logged in
  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("role,status")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile || profile.status !== "active") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Redirect logged-in users away from login pages
    if (pathname === "/login") {
      const redirectPath = profile.role === "admin" ? "/admin/dashboard" : "/dashboard";
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    if (pathname === "/admin-login") {
      const redirectPath = profile.role === "admin" ? "/admin/dashboard" : "/dashboard";
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    // Role-based route protection
    if (profile.role === "employee") {
      if (pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      if (!isEmployeeRoute(pathname) && pathname !== "/") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    if (profile.role === "admin" && isEmployeeRoute(pathname)) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
