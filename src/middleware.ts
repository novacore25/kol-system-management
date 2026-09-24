import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "creavy_jwt_secret_production_2026_super_secure"
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /admin routes
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("creavy_session")?.value;

    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/register";
      url.searchParams.set("returnUrl", pathname);
      url.searchParams.set("error", "login_required");
      return NextResponse.redirect(url);
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const role = (payload as any).role;

      if (role !== "ADMIN") {
        // Creators attempting to access admin routes are redirected to creator tasks
        const url = req.nextUrl.clone();
        url.pathname = "/my-tasks";
        return NextResponse.redirect(url);
      }
    } catch {
      // Invalid/expired token
      const url = req.nextUrl.clone();
      url.pathname = "/register";
      url.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
