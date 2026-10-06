"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/dashboard", label: "📊 ড্যাশবোর্ড" },
  { href: "/dashboard/send", label: "✉️ SMS পাঠান" },
  { href: "/dashboard/logs", label: "📜 লগ" },
  { href: "/dashboard/api-keys", label: "🔑 API Keys" },
  { href: "/dashboard/balance", label: "💳 ব্যালেন্স" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="sidebar">
      <Link href="/" className="logo">
        <div className="logo-dot" />
        <span>SMS Reseller</span>
      </Link>
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`side-link ${pathname === l.href ? "active" : ""}`}
        >
          {l.label}
        </Link>
      ))}
      <button onClick={logout} className="side-link" style={{ width: "100%", textAlign: "left", cursor: "pointer", background: "none", border: "none", marginTop: 12 }}>
        🚪 লগআউট
      </button>
    </aside>
  );
}
