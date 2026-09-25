import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, creatorProfiles, shippingAddresses, tiktokAccounts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getCurrentSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session.id))
      .limit(1)
      .then((rows) => rows[0]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const profile = await db
      .select()
      .from(creatorProfiles)
      .where(eq(creatorProfiles.userId, user.id))
      .limit(1)
      .then((rows) => rows[0]);

    const addresses = profile
      ? await db
          .select()
          .from(shippingAddresses)
          .where(eq(shippingAddresses.creatorProfileId, profile.id))
          .orderBy(desc(shippingAddresses.createdAt))
      : [];

    const tiktok = profile
      ? await db
          .select()
          .from(tiktokAccounts)
          .where(eq(tiktokAccounts.creatorProfileId, profile.id))
          .limit(1)
          .then((rows) => rows[0])
      : null;

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      profile: profile
        ? {
            id: profile.id,
            fullName: profile.fullName,
            whatsappNumber: profile.whatsappNumber,
            niche: profile.niche,
            tier: profile.tier,
            completionRate: profile.completionRate,
            bankName: profile.bankName,
            bankAccountNumber: profile.bankAccountNumber,
            bankAccountHolder: profile.bankAccountHolder,
          }
        : null,
      tiktokAccount: tiktok
        ? {
            id: tiktok.id,
            handle: tiktok.handle,
            displayName: tiktok.displayName,
            avatarUrl: tiktok.avatarUrl,
            followerCount: tiktok.followerCount,
            isVerified: tiktok.isVerified,
          }
        : null,
      addresses: addresses.map((a) => ({
        id: a.id,
        recipientName: a.recipientName,
        phoneNumber: a.phoneNumber,
        province: a.province,
        city: a.city,
        district: a.district,
        postalCode: a.postalCode,
        streetAddress: a.streetAddress,
        isDefault: a.isDefault,
      })),
    });
  } catch (err: any) {
    console.error("Error fetching profile:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { fullName, whatsappNumber, niche, bankName, bankAccountNumber, bankAccountHolder } = body;

    let profile = await db
      .select()
      .from(creatorProfiles)
      .where(eq(creatorProfiles.userId, session.id))
      .limit(1)
      .then((rows) => rows[0]);

    if (!profile) {
      const [newProfile] = await db
        .insert(creatorProfiles)
        .values({
          userId: session.id,
          fullName: fullName || session.name || "Kreator",
          whatsappNumber: whatsappNumber || "",
          niche: niche || "General",
          bankName: bankName || null,
          bankAccountNumber: bankAccountNumber || null,
          bankAccountHolder: bankAccountHolder || fullName || session.name || "",
        })
        .returning();
      profile = newProfile;
    } else {
      await db
        .update(creatorProfiles)
        .set({
          fullName: fullName ?? profile.fullName,
          whatsappNumber: whatsappNumber ?? profile.whatsappNumber,
          niche: niche ?? profile.niche,
          bankName: bankName ?? profile.bankName,
          bankAccountNumber: bankAccountNumber ?? profile.bankAccountNumber,
          bankAccountHolder: bankAccountHolder ?? profile.bankAccountHolder,
        })
        .where(eq(creatorProfiles.id, profile.id));
    }

    return NextResponse.json({ success: true, profile });
  } catch (err: any) {
    console.error("Error updating profile:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
