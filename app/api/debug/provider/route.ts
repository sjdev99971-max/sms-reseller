import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { config } from "@/lib/config";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const keyDisplay = config.PROVIDER_API_KEY;
  const keyEncoded = encodeURIComponent(config.PROVIDER_API_KEY);
  const keyChars = Array.from(keyDisplay).map(
    (c) => `${c} (U+${c.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0")})`
  );

  // Balance test
  const balanceUrl = `${config.PROVIDER_API_URL}/Balance.php?key=${keyEncoded}`;
  let balanceResult: any = null;
  try {
    const res = await fetch(balanceUrl, { cache: "no-store" });
    const text = await res.text();
    balanceResult = {
      status: res.status,
      bodyPreview: text.slice(0, 300),
    };
  } catch (e: any) {
    balanceResult = { error: e.message };
  }

  return NextResponse.json({
    keyRaw: keyDisplay,
    keyEncoded,
    keyChars,
    balanceUrlMasked: balanceUrl.replace(keyEncoded, "***"),
    balanceResult,
  });
}
