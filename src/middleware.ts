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
const CHILDREN_PREFIX = "/children";
const PARENT_ONLY_PREFIX = ["/settings", "/forum"];


export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const childStatusCookie = req.cookies.get("childStatus")?.value;
  const pathname = req.nextUrl.pathname;

  const isAdminPath = pathname.startsWith(ADMIN_PREFIX);
  const isChildrenPath = pathname.startsWith(CHILDREN_PREFIX);
  const isParentOnlyPath = PARENT_ONLY_PREFIX.some((p) =>
    pathname.startsWith(p)
  );

  // ✅ 1. Jika belum login → hanya public routes
  if (!accessToken) {
    if (isAdminPath || isChildrenPath || isParentOnlyPath) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // ✅ 2. Decode token
  let userPayload: UserPayload | null = null;
  try {
    userPayload = jwtDecode(accessToken);
  } catch {
    // token invalid → redirect login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ✅ 3. Redirect dari public pages kalau sudah login
  if (AUTH_PATHS.some((p) => pathname.startsWith(p))) {
    const { role } = userPayload;
    let redirectUrl = "/";
    if (role === "ADMINISTRATOR") redirectUrl = "/admin/dashboard";
    else redirectUrl = "/"; // parent dashboard

    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  const { role } = userPayload;

  // ✅ 4. Role-based routing
  if (role === "ADMINISTRATOR") {
    if (!isAdminPath) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (role === "PARENT") {
    // Jika child mode aktif, hanya boleh akses /children
    if (childStatusCookie) {
      try {
        const childStatus = JSON.parse(childStatusCookie);

        if (childStatus.isAllowed && childStatus.isActive) {
          if (!isChildrenPath) {
            return NextResponse.redirect(
              new URL("/children/playground", req.url)
            );
          }
          return NextResponse.next(); // tetap di area anak
        }
      } catch {
        // invalid cookie → abaikan
      }
    }

    // Parent normal → tidak boleh ke admin
    if (isAdminPath) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Jika akses /children tapi childStatus tidak ada → redirect /
    if (isChildrenPath && !childStatusCookie) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  }

  // fallback
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
