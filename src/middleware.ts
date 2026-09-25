import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "creavy_jwt_secret_production_2026_super_secure"
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. ADMIN ROUTES
  if (pathname.startsWith("/admin")) {
    // Allow public access to /admin/login
    if (pathname === "/admin/login") {
      const token = req.cookies.get("creavy_session")?.value;
      if (token) {
        try {
          const { payload } = await jwtVerify(token, JWT_SECRET);
          if ((payload as any).role === "ADMIN") {
            // Already logged in as admin, redirect directly to admin dashboard
            return NextResponse.redirect(new URL("/admin", req.url));
          }
        } catch {
          // Token invalid, proceed to login page
        }
      }
      return NextResponse.next();
    }

    // Protect all other /admin/* routes
    const token = req.cookies.get("creavy_session")?.value;
    if (!token) {
      const url = new URL("/admin/login", req.url);
      url.searchParams.set("error", "login_required");
      return NextResponse.redirect(url);
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const role = (payload as any).role;

      if (role !== "ADMIN") {
        // Logged in user is not an admin, deny and redirect to admin login with error
        const url = new URL("/admin/login", req.url);
        url.searchParams.set("error", "not_admin");
        return NextResponse.redirect(url);
      }
    } catch {
      // Expired or invalid token
      const url = new URL("/admin/login", req.url);
      url.searchParams.set("error", "session_expired");
      return NextResponse.redirect(url);
    }
  }

  // 2. CREATOR PROTECTED ROUTES (/my-tasks, /earnings, /profile)
  if (
    pathname.startsWith("/my-tasks") ||
    pathname.startsWith("/earnings") ||
    pathname.startsWith("/profile")
  ) {
    const token = req.cookies.get("creavy_session")?.value;
    if (!token) {
      const url = new URL("/login", req.url);
      url.searchParams.set("returnUrl", pathname);
      url.searchParams.set("error", "login_required");
      return NextResponse.redirect(url);
    }

    try {
      await jwtVerify(token, JWT_SECRET);
    } catch {
      const url = new URL("/login", req.url);
      url.searchParams.set("returnUrl", pathname);
      url.searchParams.set("error", "session_expired");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/my-tasks/:path*",
    "/earnings/:path*",
    "/profile/:path*",
  ],
};
