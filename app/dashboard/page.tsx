import Link from "next/link";

export default function Dashboard() {
  const stats = [
    { label: "মোট SMS", value: "12,847", change: "+18%", up: true },
    { label: "ডেলিভারড", value: "12,591", change: "+18%", up: true },
    { label: "ফেইলড", value: "256", change: "-4%", up: false },
    { label: "ব্যালেন্স", value: "৳ 24,580", change: "+৳৩,২০০", up: true },
  ];

  const logs = [
    { to: "+8801712345678", status: "success", cost: "৳0.35", time: "১ মিনিট আগে" },
    { to: "+8801812345678", status: "success", cost: "৳0.35", time: "৩ মিনিট আগে" },
    { to: "+8801912345678", status: "pending", cost: "৳0.35", time: "৫ মিনিট আগে" },
    { to: "+8801612345678", status: "failed", cost: "৳0", time: "৮ মিনিট আগে" },
    { to: "+8801512345678", status: "success", cost: "৳0.35", time: "১০ মিনিট আগে" },
  ];

  return (
    <div className="dash">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-dot" />
          <span>SMS Reseller</span>
        </div>
        <Link href="/dashboard" className="side-link active">📊 ড্যাশবোর্ড</Link>
        <Link href="/dashboard/send" className="side-link">✉️ SMS পাঠান</Link>
        <Link href="/dashboard/logs" className="side-link">📜 লগ</Link>
        <Link href="/dashboard/api" className="side-link">🔑 API Keys</Link>
        <Link href="/dashboard/balance" className="side-link">💳 ব্যালেন্স</Link>
        <Link href="/dashboard/settings" className="side-link">⚙️ সেটিংস</Link>
      </aside>

      <main className="main">
        <div className="main-header">
          <div>
            <h1>স্বাগতম 👋</h1>
            <p>আপনার SMS গেটওয়ে স্ট্যাটাস ওভারভিউ</p>
          </div>
          <Link href="/dashboard/send" className="btn btn-primary">
            নতুন SMS পাঠান
          </Link>
        </div>

        <div className="grid-stats">
          {stats.map((s) => (
            <div key={s.label} className="card">
              <div className="card-label">{s.label}</div>
              <div className="card-value">{s.value}</div>
              <div className={`card-change ${s.up ? "up" : "down"}`}>
                {s.change} আগের সপ্তাহ থেকে
              </div>
            </div>
          ))}
        </div>

        <div className="table-card">
          <h2>সাম্প্রতিক SMS লগ</h2>
          <table>
            <thead>
              <tr>
                <th>প্রাপক</th>
                <th>স্ট্যাটাস</th>
                <th>খরচ</th>
                <th>সময়</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={i}>
                  <td>{log.to}</td>
                  <td>
                    <span className={`pill ${log.status}`}>
                      {log.status === "success" ? "ডেলিভারড" : log.status === "pending" ? "পেন্ডিং" : "ফেইলড"}
                    </span>
                  </td>
                  <td>{log.cost}</td>
                  <td style={{ color: "var(--muted)" }}>{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
