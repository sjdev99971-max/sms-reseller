"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setErr(data.error || "রেজিস্ট্রেশন ব্যর্থ");
    router.push(data.user.role === "admin" ? "/admin" : "/dashboard");
    router.refresh();
  }

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={submit}>
        <div className="auth-logo">
          <div className="logo-dot" />
        </div>
        <h1>নতুন অ্যাকাউন্ট</h1>
        <p className="auth-sub">৩০ সেকেন্ডে শুরু করুন</p>

        {err && <div className="auth-error">{err}</div>}

        <label>নাম</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="আপনার নাম" />

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
          placeholder="অন্তত ৬ অক্ষর"
          required
        />

        <button className="btn btn-primary auth-submit" disabled={loading}>
          {loading ? "তৈরি হচ্ছে..." : "রেজিস্টার"}
        </button>

        <p className="auth-foot">
          অ্যাকাউন্ট আছে? <Link href="/login">লগইন করুন</Link>
        </p>
      </form>
    </div>
  );
}
