import { sql } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { config } from "@/lib/config";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (token !== config.SETUP_TOKEN) {
    return NextResponse.json({ error: "Invalid setup token" }, { status: 401 });
  }

  try {
    // ============ SCHEMA ============
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT,
        role TEXT NOT NULL DEFAULT 'user',
        balance NUMERIC(10,2) NOT NULL DEFAULT 0,
        active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS api_keys (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        key TEXT UNIQUE NOT NULL,
        name TEXT,
        active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS packages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        sms_count INTEGER NOT NULL,
        price NUMERIC(10,2) NOT NULL,
        description TEXT,
        popular BOOLEAN NOT NULL DEFAULT false,
        active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        package_id INTEGER REFERENCES packages(id),
        amount NUMERIC(10,2) NOT NULL,
        sms_count INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        method TEXT,
        trx_id TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS sms_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        to_number TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        cost NUMERIC(10,4) NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    // ============ DEFAULT PACKAGES ============
    const pkgCount = await sql`SELECT COUNT(*)::int as c FROM packages`;
    if (pkgCount[0].c === 0) {
      await sql`
        INSERT INTO packages (name, sms_count, price, description, popular)
        VALUES 
          ('Starter', 1000, 500, '১,০০০ SMS · পার্সোনাল ব্যবহারের জন্য', false),
          ('Reseller', 10000, 4000, '১০,০০০ SMS · রিসেলারদের জন্য সেরা', true),
          ('Business', 50000, 18000, '৫০,০০০ SMS · বিজনেস গ্রেড', false),
          ('Enterprise', 200000, 65000, '২,০০,০০০ SMS · এন্টারপ্রাইজ', false)
      `;
    }

    // ============ DEFAULT SETTINGS ============
    await sql`
      INSERT INTO settings (key, value) VALUES
        ('sms_rate', '0.35'),
        ('currency', 'BDT'),
        ('site_name', 'SMS Reseller')
      ON CONFLICT (key) DO NOTHING
    `;

    // ============ AUTO-CREATE ADMIN ============
    const adminEmail = config.ADMIN_EMAIL;
    let adminCreated = false;
    if (adminEmail) {
      const existing = await sql`SELECT id FROM users WHERE email = ${adminEmail}`;
      if (existing.length === 0) {
        const defaultPass = "admin1234";
        const hash = await hashPassword(defaultPass);
        await sql`
          INSERT INTO users (email, password_hash, name, role, balance)
          VALUES (${adminEmail}, ${hash}, 'Admin', 'admin', 1000)
        `;
        adminCreated = true;
      }
    }

    return NextResponse.json({
      ok: true,
      message: "Database initialized ✅",
      adminCreated,
      adminEmail: adminCreated ? adminEmail : undefined,
      defaultPassword: adminCreated ? "admin1234" : undefined,
      warning: adminCreated ? "লগইন করার পর সাথে সাথে পাসওয়ার্ড বদলান!" : undefined,
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
