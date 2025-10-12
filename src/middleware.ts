import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "./lib/jwt-decoder";
import type { UserPayload } from "./types/user-payload";

const AUTH_PATHS = [
  "/login",
  "/register",
  "/complete-register",
  "/forgot-password",
  "/reset-password",
  "/verify",
];

const ADMIN_PREFIX = "/admin";

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const pathname = req.nextUrl.pathname;
  const isAdminPath = pathname.startsWith(ADMIN_PREFIX);
  if (!accessToken) {
    if (isAdminPath) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // 3️⃣ Decode JWT
  let userPayload: UserPayload;
  try {
    userPayload = jwtDecode(accessToken);
  } catch {
    if (isAdminPath) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next(); // parent tetap bisa ke public
  }

  const { role } = userPayload;

  if (pathname.startsWith(ADMIN_PREFIX) && role !== "ADMINISTRATOR") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (role === "ADMINISTRATOR" && !pathname.startsWith(ADMIN_PREFIX)) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  // 5️⃣ Parent bebas ke public path → tidak ada redirect
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
