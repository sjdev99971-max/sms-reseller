import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";
import { sendSms } from "@/lib/provider";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { to, message } = await req.json();
    if (!to || !message) {
      return NextResponse.json({ error: "নম্বর ও মেসেজ দিন" }, { status: 400 });
    }

    const userRows = await sql`SELECT balance FROM users WHERE id = ${session.id}`;
    if (userRows.length === 0) {
      return NextResponse.json({ error: "ইউজার পাওয়া যায়নি" }, { status: 404 });
    }
    const userBalance = parseFloat(userRows[0].balance);

    const rateRows = await sql`SELECT value FROM settings WHERE key = 'sms_rate'`;
    const rate = parseFloat(rateRows[0]?.value || "0.35");

    if (userBalance < rate) {
      return NextResponse.json({ error: "পর্যাপ্ত ব্যালেন্স নেই" }, { status: 402 });
    }

    const result = await sendSms(to, message);

    await sql`
      INSERT INTO sms_logs (user_id, to_number, message, status, cost)
      VALUES (
        ${session.id}, ${to}, ${message},
        ${result.ok ? "delivered" : "failed"},
        ${result.ok ? rate : 0}
      )
    `;

    if (result.ok) {
      await sql`UPDATE users SET balance = balance - ${rate} WHERE id = ${session.id}`;
    }

    return NextResponse.json({
      ok: result.ok,
      message: result.message,
      cost: result.ok ? rate : 0,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
