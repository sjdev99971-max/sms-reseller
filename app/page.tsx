import Link from "next/link";

export default function Home() {
  return (
    <>
      <nav className="nav">
        <div className="logo">
          <div className="logo-dot" />
          <span>SMS Reseller</span>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#docs">Docs</a>
          <a href="#contact">Contact</a>
        </div>
        <Link href="/dashboard" className="btn btn-primary">
          Dashboard →
        </Link>
      </nav>

      <section className="hero">
        <div className="badge">
          <span className="badge-dot" />
          <span>Live · Neon Postgres + Vercel Edge</span>
        </div>
        <h1>
          Bulk SMS এর জন্য <span className="gradient-text">সবচেয়ে দ্রুত</span>
          <br />
          রিসেলার প্ল্যাটফর্ম
        </h1>
        <p>
          একাধিক প্রোভাইডার API, রিয়েল-টাইম ডেলিভারি, রিসেলার মার্জিন, আর
          এন্টারপ্রাইজ-লেভেল ড্যাশবোর্ড — সব একসাথে।
        </p>
        <div className="hero-actions">
          <Link href="/dashboard" className="btn btn-primary">
            ফ্রি শুরু করুন
          </Link>
          <a href="#features" className="btn btn-ghost">
            কীভাবে কাজ করে
          </a>
        </div>
      </section>

      <section className="stats">
        <div className="stat">
          <div className="stat-value">99.9%</div>
          <div className="stat-label">Uptime SLA</div>
        </div>
        <div className="stat">
          <div className="stat-value">&lt;1s</div>
          <div className="stat-label">Avg Delivery</div>
        </div>
        <div className="stat">
          <div className="stat-value">150+</div>
          <div className="stat-label">Countries</div>
        </div>
        <div className="stat">
          <div className="stat-value">24/7</div>
          <div className="stat-label">Support</div>
        </div>
      </section>

      <section className="section" id="features">
        <h2 className="section-title">সবকিছু এক প্ল্যাটফর্মে</h2>
        <p className="section-sub">রিসেলার থেকে এন্টারপ্রাইজ — সব চাহিদা মেটে</p>
        <div className="features">
          <div className="feature">
            <div className="feature-icon">⚡</div>
            <h3>ইনস্ট্যান্ট API</h3>
            <p>REST API দিয়ে সেকেন্ডেই SMS পাঠান। SDK, webhook, ব্যাচ সাপোর্ট সহ।</p>
          </div>
          <div className="feature">
            <div className="feature-icon">💰</div>
            <h3>রিসেলার মার্জিন</h3>
            <p>নিজের প্রাইসিং সেট করুন, সাব-ইউজার বানান, অটো কমিশন পান।</p>
          </div>
          <div className="feature">
            <div className="feature-icon">📊</div>
            <h3>রিয়েল-টাইম অ্যানালিটিক্স</h3>
            <p>প্রতি SMS-এর স্ট্যাটাস, ডেলিভারি রেট, কস্ট ব্রেকডাউন লাইভ দেখুন।</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🔐</div>
            <h3>নিরাপদ ও স্কেলেবল</h3>
            <p>Neon Postgres + Vercel Edge — যেকোনো ট্রাফিকে অটো-স্কেল।</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🌍</div>
            <h3>গ্লোবাল কাভারেজ</h3>
            <p>১৫০+ দেশে একাধিক প্রোভাইডার — বেস্ট রুট অটো সিলেক্ট।</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🔔</div>
            <h3>Webhook নোটিফিকেশন</h3>
            <p>প্রতি ডেলিভারি, ফেইল, বা রিপ্লাই-এর জন্য রিয়েল-টাইম ইভেন্ট।</p>
          </div>
        </div>
      </section>

      <section className="section" id="pricing">
        <h2 className="section-title">সহজ প্রাইসিং</h2>
        <p className="section-sub">যেকোনো প্ল্যান থেকে যেকোনো সময় আপগ্রেড</p>
        <div className="pricing">
          <div className="plan">
            <h3>Starter</h3>
            <div className="price">
              ৳০ <span>/ মাস</span>
            </div>
            <ul>
              <li>১,০০০ ফ্রি SMS</li>
              <li>১টি API Key</li>
              <li>বেসিক অ্যানালিটিক্স</li>
              <li>ইমেইল সাপোর্ট</li>
            </ul>
            <button className="btn btn-ghost">শুরু করুন</button>
          </div>
          <div className="plan featured">
            <div className="plan-tag">জনপ্রিয়</div>
            <h3>Reseller</h3>
            <div className="price">
              ৳৪,৯০০ <span>/ মাস</span>
            </div>
            <ul>
              <li>আনলিমিটেড SMS</li>
              <li>১০টি সাব-অ্যাকাউন্ট</li>
              <li>কাস্টম প্রাইসিং</li>
              <li>Webhook + API</li>
              <li>প্রায়োরিটি সাপোর্ট</li>
            </ul>
            <button className="btn btn-primary">এখনই কিনুন</button>
          </div>
          <div className="plan">
            <h3>Enterprise</h3>
            <div className="price">
              কাস্টম
            </div>
            <ul>
              <li>ডেডিকেটেড ইনফ্রা</li>
              <li>আনলিমিটেড সাব-ইউজার</li>
              <li>SLA গ্যারান্টি</li>
              <li>24/7 ফোন সাপোর্ট</li>
            </ul>
            <button className="btn btn-ghost">যোগাযোগ</button>
          </div>
        </div>
      </section>

      <footer className="footer">
        © 2026 SMS Reseller · Neon + Next.js + Vercel
      </footer>
    </>
  );
}
