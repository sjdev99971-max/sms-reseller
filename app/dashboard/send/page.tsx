"use client";
import { useState } from "react";

export default function SendPage() {
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    const res = await fetch("/api/sms/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, message }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok || !data.ok) {
      setStatus({ type: "err", text: data.error || data.message || "ব্যর্থ" });
      return;
    }
    setStatus({ type: "ok", text: `${data.message} · খরচ ৳${data.cost}` });
    setMessage("");
  }

  return (
    <>
      <div className="main-header">
        <div>
          <h1>নতুন SMS পাঠান</h1>
          <p>গ্রাহকের নম্বর ও মেসেজ দিন</p>
        </div>
      </div>

      <div className="table-card" style={{ maxWidth: 640 }}>
        <form onSubmit={send}>
          <label style={{ display: "block", fontSize: 13, color: "var(--muted)", marginBottom: 6 }}>
            প্রাপকের নম্বর
          </label>
          <input
            type="tel"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="01XXXXXXXXX"
            required
            style={{
              width: "100%", padding: "12px 14px", borderRadius: 10,
              background: "rgba(0,0,0,0.3)", border: "1px solid var(--border)",
              color: "var(--text)", fontSize: 14, marginBottom: 18, outline: "none",
            }}
          />

          <label style={{ display: "block", fontSize: 13, color: "var(--muted)", marginBottom: 6 }}>
            মেসেজ
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="আপনার মেসেজ লিখুন..."
            required
            rows={5}
            style={{
              width: "100%", padding: "12px 14px", borderRadius: 10,
              background: "rgba(0,0,0,0.3)", border: "1px solid var(--border)",
              color: "var(--text)", fontSize: 14, marginBottom: 18, outline: "none",
              fontFamily: "inherit", resize: "vertical",
            }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "var(--muted)", fontSize: 13 }}>
              {message.length} অক্ষর
            </span>
            <button className="btn btn-primary" disabled={loading}>
              {loading ? "পাঠানো হচ্ছে..." : "SMS পাঠান"}
            </button>
          </div>
        </form>

        {status && (
          <div
            style={{
              marginTop: 20, padding: "12px 14px", borderRadius: 10,
              background: status.type === "ok" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
              border: `1px solid ${status.type === "ok" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
              color: status.type === "ok" ? "#6ee7b7" : "#fca5a5",
              fontSize: 14,
            }}
          >
            {status.text}
          </div>
        )}
      </div>
    </>
  );
}
