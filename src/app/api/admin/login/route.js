import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const ADMIN_EMAIL = "admin@gmail.com";
    const ADMIN_PASSWORD = "admin";

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // create JWT
    const token = jwt.sign(
      {
        email: ADMIN_EMAIL,
        role: "admin",
      },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
    });

    // ✅ store token in cookie
    response.cookies.set("adminToken", token, {
      httpOnly: true,
      secure: false, // true in production (https)
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 // 1 day
    });

    return response;

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}