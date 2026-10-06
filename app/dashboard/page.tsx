import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Dashboard() {
  const session = await getSession();
  if (!session) redirect("/login");

  const userRows = await sql`
    SELECT id, email, name, role, balance, created_at
    FROM users WHERE id = ${session.id}
  `;
  if (userRows.length === 0) redirect("/login");
  const user = userRows[0];

  const statsRows = await sql`
    SELECT
      COUNT(*)::int as total,
      COUNT(*) FILTER (WHERE status = 'delivered')::int as delivered,
      COUNT(*) FILTER (WHERE status = 'failed')::int as failed,
      COALESCE(SUM(cost), 0)::float as spent
    FROM sms_logs WHERE user_id = ${session.id}
  `;
  const stats = statsRows[0];

  const logs = await sql`
    SELECT id, to_number, status, cost, created_at
    FROM sms_logs WHERE user_id = ${session.id}
    ORDER BY created_at DESC LIMIT 10
  `;

  const cards = [
    { label: "মোট SMS", value: stats.total.toString(), up: true },
    { label: "ডেলিভারড", value: stats.delivered.toString(), up: true },
    { label: "ফেইলড", value: stats.failed.toString(), up: false },
    { label: "ব্যালেন্স", value: "৳ " + Number(user.balance).toFixed(2), up: true },
  ];

  return (
    <>
      <div className="main-header">
        <div>
          <h1>স্বাগতম, {user.name || user.email.split("@")[0]} 👋</h1>
          <p>{user.email} · {user.role === "admin" ? "অ্যাডমিন" : "ইউজার"}</p>
        </div>
        <Link href="/dashboard/send" className="btn btn-primary">
          নতুন SMS পাঠান
        </Link>
      </div>

      <div className="grid-stats">
        {cards.map((c) => (
          <div key={c.label} className="card">
            <div className="card-label">{c.label}</div>
            <div className="card-value">{c.value}</div>
            <div className={`card-change ${c.up ? "up" : "down"}`}>
              সর্বমোট
            </div>
          </div>
        ))}
      </div>

      <div className="table-card">
        <h2>সাম্প্রতিক SMS</h2>
        {logs.length === 0 ? (
          <p style={{ color: "var(--muted)", padding: "20px 0" }}>
            এখনো কোনো SMS পাঠানো হয়নি।{" "}
            <Link href="/dashboard/send" style={{ color: "#a5b4fc" }}>
              প্রথম SMS পাঠান →
            </Link>
          </p>
        ) : (
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
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.to_number}</td>
                  <td>
                    <span className={`pill ${log.status === "delivered" ? "success" : log.status === "failed" ? "failed" : "pending"}`}>
                      {log.status === "delivered" ? "ডেলিভারড" : log.status === "failed" ? "ফেইলড" : "পেন্ডিং"}
                    </span>
                  </td>
                  <td>৳{Number(log.cost).toFixed(2)}</td>
                  <td style={{ color: "var(--muted)" }}>
                    {new Date(log.created_at).toLocaleString("bn-BD")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
