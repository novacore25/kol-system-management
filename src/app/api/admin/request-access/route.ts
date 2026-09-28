import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Nama dan email wajib diisi." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Format email tidak valid." }, { status: 400 });
    }

    // Ensure PENDING_ADMIN value exists in the enum (safe to run multiple times)
    await db.execute(sql`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_enum
          WHERE enumlabel = 'PENDING_ADMIN'
            AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')
        ) THEN
          ALTER TYPE user_role ADD VALUE 'PENDING_ADMIN';
        END IF;
      END $$;
    `);

    // Check if email already exists in users table
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .then((rows) => rows[0]);

    if (existing) {
      if (existing.role === "ADMIN") {
        return NextResponse.json(
          { error: "Email ini sudah terdaftar sebagai Admin." },
          { status: 409 }
        );
      }
      if (existing.role === "PENDING_ADMIN") {
        return NextResponse.json(
          { error: "Permintaan untuk email ini sudah ada dan sedang menunggu persetujuan Superadmin." },
          { status: 409 }
        );
      }
      // Update existing user to PENDING_ADMIN
      await db
        .update(users)
        .set({ role: "PENDING_ADMIN" as any })
        .where(eq(users.email, email));
    } else {
      // Insert new user with PENDING_ADMIN role
      await db.insert(users).values({
        email,
        role: "PENDING_ADMIN" as any,
        isActive: false,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Permintaan akses admin berhasil dikirim! Superadmin akan mengubah role kamu menjadi ADMIN di database.",
    });
  } catch (err: any) {
    console.error("Admin request access error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
