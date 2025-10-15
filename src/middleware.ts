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
const PARENT_ONLY_PREFIX = ["/settings"];

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const childStatusCookie = req.cookies.get("childStatus")?.value;
  const pathname = req.nextUrl.pathname;

  const isAdminPath = pathname.startsWith(ADMIN_PREFIX);
  const isChildrenPath = pathname.startsWith(CHILDREN_PREFIX);
  const isParentOnlyPath = PARENT_ONLY_PREFIX.some((p) =>
    pathname.startsWith(p)
  );

  // ✅ 1. Belum login → hanya public routes
  if (!accessToken) {
    if (isAdminPath || isChildrenPath || isParentOnlyPath) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // ✅ 2. Decode token
  let userPayload: UserPayload;
  try {
    userPayload = jwtDecode(accessToken);
  } catch {
    if (isAdminPath || isChildrenPath || isParentOnlyPath) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  const { role } = userPayload;

  // ✅ 3. Role-based logic

  // Admin hanya boleh di area admin
  if (role === "ADMINISTRATOR") {
    if (!isAdminPath) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Kalau parent login
  if (role === "PARENT") {
    // 🚨 Tambahan: kalau akses /children tapi childStatus tidak ada → redirect /
    if (isChildrenPath && !childStatusCookie) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (childStatusCookie) {
      try {
        const childStatus = JSON.parse(childStatusCookie);

        // 🚸 Kalau anak aktif → HANYA boleh di `/children/...`
        if (childStatus.isAllowed && childStatus.isActive) {
          if (!isChildrenPath) {
            return NextResponse.redirect(
              new URL("/children/playground", req.url)
            );
          }
          return NextResponse.next(); // tetap di area anak
        }
      } catch {
        // invalid cookie, abaikan
      }
    }

    // kalau tidak child mode, parent hanya tidak boleh ke admin
    if (isAdminPath) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // Kalau role lain (misal anak langsung login) → batasi ke /children
  if (role === "CHILD" && !isChildrenPath) {
    return NextResponse.redirect(new URL("/children/playground", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
