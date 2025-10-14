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

const PARENT_ONLY_PREFIX = ["/settings"];

const CHILDREN_PREFIX = "/children";

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const childStatusCookie = req.cookies.get("childStatus")?.value;
  const pathname = req.nextUrl.pathname;
  const isAdminPath = pathname.startsWith(ADMIN_PREFIX);
  // 1️⃣ Redirect kalau tidak ada token
  if (!accessToken) {
    if (
      isAdminPath ||
      PARENT_ONLY_PREFIX.some((prefix) => pathname.startsWith(prefix))
    ) {
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
  const isChildrenPath = pathname.startsWith(CHILDREN_PREFIX);

  if (role === "PARENT" && !isChildrenPath) {
    if (childStatusCookie) {
      try {
        const childStatus = JSON.parse(childStatusCookie);
        if (childStatus.isAllowed && childStatus.isActive) {
          // redirect ke playground/children path
          return NextResponse.redirect(
            new URL("/children/playground", req.url)
          );
        }
      } catch {
        // invalid cookie → biarkan akses public
      }
    }
  }

  // 5️⃣ Parent bebas ke public path → tidak ada redirect
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
