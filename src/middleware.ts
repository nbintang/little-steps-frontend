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
const PARENT_PREFIX = "/parent";

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const pathname = req.nextUrl.pathname;

  const isProtected =
    pathname.startsWith(ADMIN_PREFIX) || pathname.startsWith(PARENT_PREFIX);

  // 1️⃣ Tidak ada token → redirect ke login jika halaman butuh auth
  if (!accessToken) {
    if (isProtected) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // 2️⃣ Decode JWT
  let userPayload: UserPayload;
  try {
    userPayload = jwtDecode(accessToken);
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const { role } = userPayload;

  // 3️⃣ Jika user sudah login dan masuk ke /login atau /register → redirect ke dashboard masing-masing
  const isAuthPath = AUTH_PATHS.some((path) => pathname.startsWith(path));
  if (pathname === "/" || isAuthPath) {
    if (role === "ADMINISTRATOR") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    } else if (role === "PARENT") {
      return NextResponse.redirect(new URL("/parent/dashboard", req.url));
    }
  }

  // 4️⃣ Akses Role Protection
  if (role === "ADMINISTRATOR") {
    // Admin hanya boleh akses /admin/**
    if (!pathname.startsWith(ADMIN_PREFIX)) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    // Admin boleh ke /admin/dashboard dan /admin/settings
    // tidak perlu logic tambahan, karena keduanya match /admin prefix
  }

  if (role === "PARENT") {
    // Parent hanya boleh akses /parent/**
    if (!pathname.startsWith(PARENT_PREFIX)) {
      return NextResponse.redirect(new URL("/parent/dashboard", req.url));
    }
  }

  // 5️⃣ Jika semuanya aman, lanjutkan
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
