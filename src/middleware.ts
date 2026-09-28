import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "creavy_jwt_secret_production_2026_super_secure"
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. PUBLIC LOGIN ROUTES: Redirect already-logged-in users
  if (pathname === "/login") {
    const token = req.cookies.get("creavy_session")?.value;
    if (token) {
      try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        if (payload && (payload as any).id) {
          const dest = (payload as any).role === "ADMIN" ? "/admin" : "/profile";
          return NextResponse.redirect(new URL(dest, req.url));
        }
      } catch {
        // Invalid or expired token, let user proceed to login
      }
    }
    return NextResponse.next();
  }

  // 2. ADMIN ROUTES
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      const token = req.cookies.get("creavy_session")?.value;
      if (token) {
        try {
          const { payload } = await jwtVerify(token, JWT_SECRET);
          if ((payload as any).role === "ADMIN") {
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
        const url = new URL("/admin/login", req.url);
        url.searchParams.set("error", "not_admin");
        return NextResponse.redirect(url);
      }
    } catch {
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
