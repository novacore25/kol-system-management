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

  // If creator, also return their profile + tiktok accounts
  let creatorProfile = null;
  let tiktokAccountsList: any[] = [];

  if (session.role === "CREATOR" && session.creatorProfileId) {
    try {
      const profiles = await db
        .select()
        .from(creatorProfiles)
        .where(eq(creatorProfiles.id, session.creatorProfileId))
        .limit(1);

      if (profiles.length > 0) {
        creatorProfile = {
          id: profiles[0].id,
          fullName: profiles[0].fullName,
          whatsappNumber: profiles[0].whatsappNumber,
        };

        // Fetch their TikTok accounts
        const accounts = await db
          .select({
            id: tiktokAccounts.id,
            handle: tiktokAccounts.handle,
            displayName: tiktokAccounts.displayName,
            followerCount: tiktokAccounts.followerCount,
            avatarUrl: tiktokAccounts.avatarUrl,
          })
          .from(tiktokAccounts)
          .where(eq(tiktokAccounts.creatorProfileId, profiles[0].id));

        tiktokAccountsList = accounts;
      }
    } catch (e) {
      console.error("Error fetching creator profile in /api/auth/me:", e);
    }
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
