import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { config } from "@/lib/config";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const testNumber = searchParams.get("number");
  const testMsg = searchParams.get("msg") || "Test SMS";

  const keyEncoded = encodeURIComponent(config.PROVIDER_API_KEY);

  const balanceUrl = `${config.PROVIDER_API_URL}/Balance.php?key=${keyEncoded}`;
  let balanceResult: any = null;
  try {
    const res = await fetch(balanceUrl, { cache: "no-store" });
    const text = await res.text();
    balanceResult = { status: res.status, body: text.slice(0, 400) };
  } catch (e: any) {
    balanceResult = { error: e.message };
  }

  let smsResult: any = null;
  if (testNumber) {
    const smsUrl =
      `${config.PROVIDER_API_URL}/sms.php` +
      `?key=${keyEncoded}` +
      `&number=${encodeURIComponent(testNumber)}` +
      `&msg=${encodeURIComponent(testMsg)}`;

    try {
      const res = await fetch(smsUrl, { cache: "no-store" });
      const text = await res.text();
      smsResult = {
        status: res.status,
        ok: res.ok,
        body: text.slice(0, 500),
        wouldMarkFailed: /error|invalid|fail/i.test(text.slice(0, 200)),
        urlMasked: smsUrl.replace(keyEncoded, "***"),
      };
    } catch (e: any) {
      smsResult = { error: e.message };
    }
  }

  return NextResponse.json({
    keyEncodedMasked: keyEncoded.slice(0, 8) + "***",
    balanceResult,
    smsResult: testNumber ? smsResult : "Add ?number=01XXXXXXXXX&msg=Hello to test",
  });
}
