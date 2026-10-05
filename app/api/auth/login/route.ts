import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyPassword, createToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "ইমেইল ও পাসওয়ার্ড দিন" }, { status: 400 });
    }

    const rows = await sql`
      SELECT id, email, password_hash, role, name, balance, active
      FROM users WHERE email = ${email}
    `;
    if (rows.length === 0) {
      return NextResponse.json({ error: "ভুল ইমেইল বা পাসওয়ার্ড" }, { status: 401 });
    }

    const user = rows[0];
    if (!user.active) {
      return NextResponse.json({ error: "অ্যাকাউন্ট নিষ্ক্রিয়" }, { status: 403 });
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "ভুল ইমেইল বা পাসওয়ার্ড" }, { status: 401 });
    }

    const token = await createToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const res = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        balance: user.balance,
      },
    });
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
