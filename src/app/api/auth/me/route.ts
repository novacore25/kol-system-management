import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { db } from "@/db";
import { creatorProfiles, tiktokAccounts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  // Fetch creator profile + tiktok accounts if available
  let creatorProfile = null;
  let tiktokAccountsList: any[] = [];

  try {
    let profile = null;
    if (session.creatorProfileId) {
      const profiles = await db
        .select()
        .from(creatorProfiles)
        .where(eq(creatorProfiles.id, session.creatorProfileId))
        .limit(1);
      if (profiles.length > 0) profile = profiles[0];
    }

    if (!profile && session.id) {
      const profiles = await db
        .select()
        .from(creatorProfiles)
        .where(eq(creatorProfiles.userId, session.id))
        .limit(1);
      if (profiles.length > 0) profile = profiles[0];
    }

    if (profile) {
      creatorProfile = {
        id: profile.id,
        fullName: profile.fullName,
        whatsappNumber: profile.whatsappNumber,
        tier: profile.tier,
      };

      // Fetch their TikTok accounts
      const accounts = await db
        .select({
          id: tiktokAccounts.id,
          handle: tiktokAccounts.handle,
          displayName: tiktokAccounts.displayName,
          followerCount: tiktokAccounts.followerCount,
          avatarUrl: tiktokAccounts.avatarUrl,
          engagementRate: tiktokAccounts.engagementRate,
          isVerified: tiktokAccounts.isVerified,
        })
        .from(tiktokAccounts)
        .where(eq(tiktokAccounts.creatorProfileId, profile.id));

      tiktokAccountsList = accounts;
    }
  } catch (e) {
    console.error("Error fetching creator profile in /api/auth/me:", e);
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.id,
      email: session.email,
      name: session.name,
      avatarUrl: session.avatarUrl,
      role: session.role,
      creatorProfileId: session.creatorProfileId,
    },
    creatorProfile,
    tiktokAccounts: tiktokAccountsList,
  });
}
