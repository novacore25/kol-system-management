import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, creatorProfiles, tiktokAccounts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    `${req.nextUrl.protocol}//${req.nextUrl.host}`;

  let returnUrl = "/profile";

  if (state) {
    try {
      const decoded = JSON.parse(Buffer.from(state, "base64url").toString("utf-8"));
      if (decoded.returnUrl) returnUrl = decoded.returnUrl;
    } catch (e) {
      console.warn("Failed to parse TikTok state:", e);
    }
  }

  if (error || !code) {
    console.error("TikTok OAuth error:", error, errorDescription);
    const redirectTarget = returnUrl.includes("?") ? `${returnUrl}&error=tiktok_denied` : `${returnUrl}?error=tiktok_denied`;
    return NextResponse.redirect(`${appUrl}${redirectTarget}`);
  }

  try {
    const clientKey = process.env.TIKTOK_CLIENT_KEY || "awkbncxurh4il884";
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET || "behlfH8cCWW8BrsgPxcbbST6MrIHDVfR";
    const redirectUri = `${appUrl}/api/auth/tiktok/callback`;

    // 1. Exchange authorization code for TikTok User Access Token
    const tokenParams = new URLSearchParams({
      client_key: clientKey,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    });

    const tokenRes = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cache-Control": "no-cache",
      },
      body: tokenParams.toString(),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || tokenData.error?.code !== "ok" && !tokenData.data?.access_token) {
      console.error("TikTok token exchange failed:", tokenData);
      const redirectTarget = returnUrl.includes("?") ? `${returnUrl}&error=tiktok_token_failed` : `${returnUrl}?error=tiktok_token_failed`;
      return NextResponse.redirect(`${appUrl}${redirectTarget}`);
    }

    const {
      access_token,
      refresh_token,
      expires_in,
      open_id,
      union_id,
    } = tokenData.data;

    // 2. Fetch User Profile & Stats from TikTok API
    let tiktokUser: {
      open_id: string;
      union_id?: string;
      avatar_url?: string;
      display_name?: string;
      username?: string;
      follower_count?: number;
      likes_count?: number;
      video_count?: number;
      is_verified?: boolean;
    } = {
      open_id: open_id || "tiktok_user",
      union_id,
      display_name: "TikTok Creator",
      username: "creator",
      follower_count: 0,
      likes_count: 0,
      is_verified: false,
    };

    try {
      const userRes = await fetch(
        "https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name,username,follower_count,likes_count,is_verified,video_count",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (userRes.ok) {
        const userData = await userRes.json();
        if (userData.data?.user) {
          tiktokUser = { ...tiktokUser, ...userData.data.user };
        }
      }
    } catch (e) {
      console.warn("Failed to fetch detailed TikTok user info, using token data:", e);
    }

    const cleanHandle = (tiktokUser.username || tiktokUser.display_name || "creator").replace(/^@/, "");
    const tokenExpiresAt = expires_in ? new Date(Date.now() + expires_in * 1000) : null;

    // 3. Check if user is currently authenticated
    const session = await getCurrentSession();

    if (session && session.id) {
      // User is logged in -> Bind directly to their Creator Profile in DB
      let existingProfile = await db
        .select()
        .from(creatorProfiles)
        .where(eq(creatorProfiles.userId, session.id))
        .limit(1)
        .then((rows) => rows[0]);

      if (!existingProfile) {
        const [newProfile] = await db
          .insert(creatorProfiles)
          .values({
            userId: session.id,
            fullName: session.name || tiktokUser.display_name || "Kreator Creavy",
            whatsappNumber: "-",
          })
          .returning();
        existingProfile = newProfile;
      }

      // Upsert TikTok Account in DB
      const existingTiktok = await db
        .select()
        .from(tiktokAccounts)
        .where(eq(tiktokAccounts.creatorProfileId, existingProfile.id))
        .limit(1)
        .then((rows) => rows[0]);

      if (existingTiktok) {
        await db
          .update(tiktokAccounts)
          .set({
            openId: tiktokUser.open_id || existingTiktok.openId,
            unionId: tiktokUser.union_id || existingTiktok.unionId,
            handle: cleanHandle,
            displayName: tiktokUser.display_name || cleanHandle,
            avatarUrl: tiktokUser.avatar_url || null,
            followerCount: tiktokUser.follower_count || 0,
            likesCount: tiktokUser.likes_count || 0,
            videoCount: tiktokUser.video_count || 0,
            accessToken: access_token,
            refreshToken: refresh_token || null,
            tokenExpiresAt,
            isVerified: true,
            lastSyncedAt: new Date(),
          })
          .where(eq(tiktokAccounts.id, existingTiktok.id));
      } else {
        await db.insert(tiktokAccounts).values({
          creatorProfileId: existingProfile.id,
          openId: tiktokUser.open_id,
          unionId: tiktokUser.union_id || null,
          handle: cleanHandle,
          displayName: tiktokUser.display_name || cleanHandle,
          avatarUrl: tiktokUser.avatar_url || null,
          followerCount: tiktokUser.follower_count || 0,
          likesCount: tiktokUser.likes_count || 0,
          videoCount: tiktokUser.video_count || 0,
          accessToken: access_token,
          refreshToken: refresh_token || null,
          tokenExpiresAt,
          isVerified: true,
          lastSyncedAt: new Date(),
        });
      }

      const redirectTarget = returnUrl.includes("?")
        ? `${returnUrl}&tiktok=connected`
        : `${returnUrl}?tiktok=connected`;
      return NextResponse.redirect(`${appUrl}${redirectTarget}`);
    }

    // 4. If user is in registration process (not logged in yet)
    // Save verified TikTok payload in temporary secure cookie so registration form can read it
    const tiktokPendingPayload = {
      openId: tiktokUser.open_id,
      unionId: tiktokUser.union_id,
      handle: cleanHandle,
      displayName: tiktokUser.display_name || cleanHandle,
      avatarUrl: tiktokUser.avatar_url,
      followerCount: tiktokUser.follower_count || 0,
      accessToken: access_token,
      isVerified: true,
    };

    const redirectTarget = returnUrl.includes("?")
      ? `${returnUrl}&tiktok=connected&handle=${encodeURIComponent(cleanHandle)}`
      : `${returnUrl}?tiktok=connected&handle=${encodeURIComponent(cleanHandle)}`;

    const response = NextResponse.redirect(`${appUrl}${redirectTarget}`);
    response.cookies.set("creavy_tiktok_pending", JSON.stringify(tiktokPendingPayload), {
      httpOnly: false, // Accessible by client registration form
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600, // 1 hour
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("TikTok callback exception:", err);
    const redirectTarget = returnUrl.includes("?") ? `${returnUrl}&error=server_error` : `${returnUrl}?error=server_error`;
    return NextResponse.redirect(`${appUrl}${redirectTarget}`);
  }
}
