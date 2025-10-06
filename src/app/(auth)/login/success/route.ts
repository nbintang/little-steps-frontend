import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const accessToken = searchParams.get("access-token");
  if (!accessToken) return NextResponse.redirect(new URL("/login", req.url));
  const res = NextResponse.redirect(new URL("/parent/dashboard", req.url));
  res.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
  return res;
}
