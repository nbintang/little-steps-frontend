import { NextRequest, NextResponse } from "next/server";
import { UserPayload } from "./types/user-payload";
import { jwtDecode } from "./lib/jwt-decoder";

const authPaths = [
  "/login",
  "/register",
  "/complete-register",
  "/forgot-password",
  "/reset-password",
  "/verify",
];
export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const pathname = req.nextUrl.pathname;
  const isProtected =
    pathname.startsWith("/admin") || pathname.startsWith("/parent");

  // jika token gada, dan coba akses protected, redirect ke sign in
  if (!accessToken) {
    if (isProtected) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  let userPayload: UserPayload;
  try {
    userPayload = jwtDecode(accessToken);
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const { role, verified } = userPayload;

  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));
  if (pathname === "/" || isAuthPath) {
    if (role === "ADMINISTRATOR") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    } else if (role === "PARENT") {
      return NextResponse.redirect(new URL("/parent/dashboard", req.url));
    } else {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Role guard: jika role tidak sesuai dengan prefix url, redirect ke dashboardnya
  if (role === "ADMINISTRATOR" && !pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/administrator/dashboard", req.url));
  }
  if (role === "PARENT" && !pathname.startsWith("/parent")) {
    return NextResponse.redirect(new URL("/parent/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/auth/verify",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
