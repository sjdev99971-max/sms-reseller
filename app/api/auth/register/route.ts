import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { hashPassword, createToken } from "@/lib/auth";
import { config } from "@/lib/config";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "ইমেইল ও পাসওয়ার্ড দিন" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে" }, { status: 400 });
    }

    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: "এই ইমেইল আগেই ব্যবহৃত হয়েছে" }, { status: 400 });
    }

    const hash = await hashPassword(password);
    const adminEmail = config.ADMIN_EMAIL;
    const role = adminEmail && email === adminEmail ? "admin" : "user";

    const result = await sql`
      INSERT INTO users (email, password_hash, name, role, balance)
      VALUES (${email}, ${hash}, ${name || email.split("@")[0]}, ${role}, 0)
      RETURNING id, email, role, name, balance
    `;

    const user = result[0];
    const token = await createToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const res = NextResponse.json({ ok: true, user });
    res.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
