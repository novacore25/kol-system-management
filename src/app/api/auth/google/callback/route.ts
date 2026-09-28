import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, creatorProfiles, tiktokAccounts, shippingAddresses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createSessionToken, isAdminEmail } from "@/lib/auth";

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email?: boolean;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  let appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    `${req.nextUrl.protocol}//${req.nextUrl.host}`;

  appUrl = appUrl.trim().replace(/\/+$/, "");
  if (!appUrl.includes("localhost") && appUrl.startsWith("http://")) {
    appUrl = appUrl.replace(/^http:\/\//, "https://");
  }

  if (error || !code) {
    console.error("Google OAuth error:", error);
    return NextResponse.redirect(`${appUrl}/login?error=${encodeURIComponent(error || "oauth_failed")}`);
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${appUrl}/api/auth/google/callback`;

    if (!clientId || !clientSecret) {
      throw new Error("Missing Google OAuth credentials in environment");
    }

    // 1. Exchange code for Google access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Token exchange failed:", errorText);
      return NextResponse.redirect(`${appUrl}/login?error=token_exchange_failed`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. Fetch User Profile from Google
    const userinfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userinfoResponse.ok) {
      throw new Error("Failed to fetch user info from Google");
    }

    const googleUser: GoogleUserInfo = await userinfoResponse.json();

    // 3. Decode registration state data if present
    let registrationData: any = null;
    let returnUrl = "/profile";

    if (state) {
      try {
        const decoded = JSON.parse(Buffer.from(state, "base64url").toString("utf-8"));
        registrationData = decoded.registrationData;
        if (decoded.returnUrl) returnUrl = decoded.returnUrl;
      } catch (e) {
        console.warn("Failed to parse state:", e);
      }
    }

    // Check if there is pending TikTok OAuth data in cookies
    let tiktokPending: any = null;
    const tiktokCookie = req.cookies.get("creavy_tiktok_pending")?.value;
    if (tiktokCookie) {
      try {
        tiktokPending = JSON.parse(tiktokCookie);
      } catch (e) {
        console.warn("Failed to parse tiktok cookie:", e);
      }
    }

    // 4. Find or Create User in Database
    let existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, googleUser.email))
      .limit(1)
      .then((rows) => rows[0]);

    let userId: string;
    const isUserAdmin = isAdminEmail(googleUser.email);
    const assignedRole: "ADMIN" | "CREATOR" = isUserAdmin ? "ADMIN" : (existingUser?.role === "ADMIN" ? "ADMIN" : "CREATOR");

    const validPhone = registrationData?.whatsappNumber && registrationData.whatsappNumber.trim().length > 3
      ? registrationData.whatsappNumber.trim()
      : null;

    if (!existingUser) {
      const [newUser] = await db
        .insert(users)
        .values({
          email: googleUser.email,
          role: assignedRole,
          avatarUrl: googleUser.picture || null,
          phoneNumber: validPhone,
          isActive: true,
        })
        .returning();
      userId = newUser.id;
      existingUser = newUser;
    } else {
      userId = existingUser.id;
      await db
        .update(users)
        .set({
          avatarUrl: googleUser.picture || existingUser.avatarUrl,
          role: assignedRole,
          ...(validPhone && !existingUser.phoneNumber ? { phoneNumber: validPhone } : {}),
        })
        .where(eq(users.id, userId));
    }

    // 5. Upsert Creator Profile
    let creatorProfileId: string | undefined;

    const existingProfile = await db
      .select()
      .from(creatorProfiles)
      .where(eq(creatorProfiles.userId, userId))
      .limit(1)
      .then((rows) => rows[0]);

    const fullName = registrationData?.fullName || googleUser.name || "Kreator Creavy";
    const whatsapp = registrationData?.whatsappNumber || existingProfile?.whatsappNumber || "-";
    const niche = registrationData?.niche || existingProfile?.niche || "General";
    const bankName = registrationData?.bankName || existingProfile?.bankName || null;
    const bankAccountNumber = registrationData?.bankAccountNumber || existingProfile?.bankAccountNumber || null;
    const bankAccountHolder = registrationData?.bankAccountHolder || existingProfile?.bankAccountHolder || fullName;

    if (!existingProfile) {
      const [newProfile] = await db
        .insert(creatorProfiles)
        .values({
          userId,
          fullName,
          whatsappNumber: whatsapp,
          niche,
          bankName,
          bankAccountNumber,
          bankAccountHolder,
        })
        .returning();
      creatorProfileId = newProfile.id;
    } else {
      creatorProfileId = existingProfile.id;
      await db
        .update(creatorProfiles)
        .set({
          fullName: registrationData?.fullName || existingProfile.fullName,
          whatsappNumber: registrationData?.whatsappNumber || existingProfile.whatsappNumber,
          niche: registrationData?.niche || existingProfile.niche,
          bankName: bankName || existingProfile.bankName,
          bankAccountNumber: bankAccountNumber || existingProfile.bankAccountNumber,
          bankAccountHolder: bankAccountHolder || existingProfile.bankAccountHolder,
          updatedAt: new Date(),
        })
        .where(eq(creatorProfiles.id, creatorProfileId));
    }

    // 6. Upsert TikTok Account
    const tiktokHandle = tiktokPending?.handle || (registrationData?.tiktokHandle ? registrationData.tiktokHandle.replace(/^@/, "").trim() : "");
    if (tiktokHandle && creatorProfileId) {
      const existingTiktok = await db
        .select()
        .from(tiktokAccounts)
        .where(eq(tiktokAccounts.creatorProfileId, creatorProfileId))
        .limit(1)
        .then((rows) => rows[0]);

      const openId = tiktokPending?.openId || (existingTiktok ? existingTiktok.openId : `tiktok_${tiktokHandle}_${Date.now()}`);
      const displayName = tiktokPending?.displayName || fullName;
      const avatarUrl = tiktokPending?.avatarUrl || googleUser.picture || null;
      const followerCount = tiktokPending?.followerCount || existingTiktok?.followerCount || 0;
      const accessToken = tiktokPending?.accessToken || existingTiktok?.accessToken || null;

      if (existingTiktok) {
        await db
          .update(tiktokAccounts)
          .set({
            handle: tiktokHandle,
            displayName,
            avatarUrl,
            followerCount,
            ...(accessToken ? { accessToken } : {}),
            isVerified: true,
            lastSyncedAt: new Date(),
          })
          .where(eq(tiktokAccounts.id, existingTiktok.id));
      } else {
        await db.insert(tiktokAccounts).values({
          creatorProfileId,
          openId,
          handle: tiktokHandle,
          displayName,
          avatarUrl,
          followerCount,
          accessToken,
          isVerified: true,
          lastSyncedAt: new Date(),
        });
      }
    }

    // 7. Upsert Shipping Address if provided
    if (registrationData?.streetAddress && creatorProfileId) {
      const existingAddr = await db
        .select()
        .from(shippingAddresses)
        .where(eq(shippingAddresses.creatorProfileId, creatorProfileId))
        .limit(1)
        .then((rows) => rows[0]);

      const streetFull = `${registrationData.streetAddress}${registrationData.villageName ? ` (Kel. ${registrationData.villageName})` : ""}`;
      const recipientName = registrationData.recipientName || fullName;
      const phone = registrationData.shippingPhone || whatsapp;

      if (existingAddr) {
        await db
          .update(shippingAddresses)
          .set({
            recipientName,
            phoneNumber: phone,
            province: registrationData.provinceName || existingAddr.province,
            city: registrationData.regencyName || existingAddr.city,
            district: registrationData.districtName || existingAddr.district,
            postalCode: registrationData.postalCode || existingAddr.postalCode,
            streetAddress: streetFull || existingAddr.streetAddress,
          })
          .where(eq(shippingAddresses.id, existingAddr.id));
      } else {
        await db.insert(shippingAddresses).values({
          creatorProfileId,
          recipientName,
          phoneNumber: phone,
          province: registrationData.provinceName || "",
          city: registrationData.regencyName || "",
          district: registrationData.districtName || "",
          postalCode: registrationData.postalCode || "",
          streetAddress: streetFull,
          isDefault: true,
        });
      }
    }

    // 8. Security Check for Admin Portal Login
    if (returnUrl.startsWith("/admin") && assignedRole !== "ADMIN") {
      return NextResponse.redirect(`${appUrl}/admin/login?error=not_admin`);
    }

    // 9. Create Auth Session Token
    const sessionToken = await createSessionToken({
      id: userId,
      email: googleUser.email,
      name: googleUser.name,
      avatarUrl: googleUser.picture,
      role: assignedRole,
      creatorProfileId,
    });

    // 10. Redirect to user profile or destination
    const destination = assignedRole === "ADMIN" && !returnUrl.startsWith("/admin") ? "/admin" : returnUrl;
    const response = NextResponse.redirect(`${appUrl}${destination}`);

    // Set HTTP-only Cookie
    response.cookies.set("creavy_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    // Clear temporary pending TikTok cookie
    response.cookies.delete("creavy_tiktok_pending");

    return response;
  } catch (err: any) {
    console.error("Google Auth Callback Exception:", err);
    return NextResponse.redirect(`${appUrl}/profile?error=${encodeURIComponent(err.message || "auth_callback_error")}`);
  }
}
