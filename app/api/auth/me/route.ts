import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const rows = await sql`
    SELECT id, email, name, role, balance, created_at
    FROM users WHERE id = ${session.id}
  `;
  if (rows.length === 0) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return NextResponse.json({ user: rows[0] });
}
