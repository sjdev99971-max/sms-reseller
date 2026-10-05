import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { checkBalance } from "@/lib/provider";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  try {
    const info = await checkBalance();
    // ✅ Only safe fields — no provider identity leaked
    return NextResponse.json({ ok: true, ...info });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: "Provider unavailable" }, { status: 502 });
  }
}
