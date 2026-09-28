import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, reason } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Nama dan email wajib diisi." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Format email tidak valid." }, { status: 400 });
    }

    // Ensure the pending_admin_requests table exists
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS pending_admin_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(200) NOT NULL,
        email VARCHAR(200) NOT NULL,
        reason TEXT,
        status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        reviewed_at TIMESTAMPTZ,
        UNIQUE (email)
      )
    `);

    // Check for duplicate
    const existing = await db.execute(
      sql`SELECT id FROM pending_admin_requests WHERE email = ${email} LIMIT 1`
    );

    if (existing.rows && existing.rows.length > 0) {
      return NextResponse.json(
        { error: "Email ini sudah pernah mengajukan akses. Tunggu review dari Superadmin." },
        { status: 409 }
      );
    }

    await db.execute(
      sql`INSERT INTO pending_admin_requests (name, email, reason) VALUES (${name}, ${email}, ${reason || null})`
    );

    return NextResponse.json({ success: true, message: "Permintaan akses berhasil dikirim!" });
  } catch (err: any) {
    console.error("Admin request access error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
