import { config } from "./config";
const PROVIDER_URL = config.PROVIDER_API_URL;
const PROVIDER_KEY = config.PROVIDER_API_KEY;

export type BalanceInfo = {
  limit: number;
  used: number;
  balance: number;
};

export type SendResult = {
  ok: boolean;
  message: string;
  rawStatus: number;
};

export async function checkBalance(): Promise<BalanceInfo> {
  const url = `${PROVIDER_URL}/Balance.php?key=${encodeURIComponent(PROVIDER_KEY)}`;
  const res = await fetch(url, { method: "GET", cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Provider error: ${res.status}`);
  }

  const data = await res.json();

  return {
    limit: Number(data.Limit) || 0,
    used: Number(data.Used) || 0,
    balance: Number(data.Balance) || 0,
  };
}

export async function sendSms(to: string, msg: string): Promise<SendResult> {
  const url =
    `${PROVIDER_URL}/sms.php` +
    `?key=${encodeURIComponent(PROVIDER_KEY)}` +
    `&number=${encodeURIComponent(to)}` +
    `&msg=${encodeURIComponent(msg)}`;

  try {
    const res = await fetch(url, { method: "GET", cache: "no-store" });
    const text = await res.text();
    const ok = res.ok && !/error|invalid|fail/i.test(text.slice(0, 200));

    return {
      ok,
      message: ok ? "SMS পাঠানো হয়েছে" : "SMS পাঠানো ব্যর্থ হয়েছে",
      rawStatus: res.status,
    };
  } catch {
    return { ok: false, message: "প্রোভাইডারে সংযোগ ব্যর্থ", rawStatus: 0 };
  }
}
