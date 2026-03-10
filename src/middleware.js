import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

export async function middleware(req) {

  const { pathname } = req.nextUrl;

  if (pathname === "/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get("adminToken")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const secret = new TextEncoder().encode(SECRET_KEY);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};