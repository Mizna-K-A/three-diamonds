import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export function middleware(req) {

  const { pathname } = req.nextUrl;

  if (pathname === "/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get("adminToken")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    jwt.verify(token, SECRET_KEY);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};