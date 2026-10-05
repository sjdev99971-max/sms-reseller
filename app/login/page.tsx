"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setErr(data.error || "লগইন ব্যর্থ");
    router.push(data.user.role === "admin" ? "/admin" : "/dashboard");
    router.refresh();
  }

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={submit}>
        <div className="auth-logo">
          <div className="logo-dot" />
        </div>
        <h1>স্বাগতম</h1>
        <p className="auth-sub">আপনার অ্যাকাউন্টে লগইন করুন</p>

        {err && <div className="auth-error">{err}</div>}

        <label>ইমেইল</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        <label>পাসওয়ার্ড</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        <button className="btn btn-primary auth-submit" disabled={loading}>
          {loading ? "লগইন হচ্ছে..." : "লগইন"}
        </button>

        <p className="auth-foot">
          অ্যাকাউন্ট নেই? <Link href="/register">রেজিস্টার করুন</Link>
        </p>
      </form>
    </div>
  );
}
