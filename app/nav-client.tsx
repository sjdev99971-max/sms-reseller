"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type User = { id: number; email: string; role: string; name: string } | null;

export default function NavClient() {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  if (loading) {
    return <div style={{ width: 140, height: 40 }} />;
  }

  if (user) {
    return (
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <Link href="/dashboard" className="btn btn-primary">
          Dashboard →
        </Link>
        <button onClick={logout} className="btn btn-ghost">
          Logout
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 10 }}>
      <Link href="/login" className="btn btn-ghost">
        Login
      </Link>
      <Link href="/register" className="btn btn-primary">
        Register →
      </Link>
    </div>
  );
}
