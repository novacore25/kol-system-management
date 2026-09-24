import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, creatorProfiles, tiktokAccounts, shippingAddresses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createSessionToken } from "@/lib/auth";

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

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    `${req.nextUrl.protocol}//${req.nextUrl.host}`;

  if (error || !code) {
    console.error("Google OAuth error:", error);
    return NextResponse.redirect(`${appUrl}/register?error=${encodeURIComponent(error || "oauth_failed")}`);
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${appUrl}/api/auth/google/callback`;

    if (!clientId || !clientSecret) {
      throw new Error("Missing Google OAuth credentials in environment");
    }

    // 1. Exchange code for access token
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
      return NextResponse.redirect(`${appUrl}/register?error=token_exchange_failed`);
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
    let returnUrl = "/my-tasks";

    if (state) {
      try {
        const decoded = JSON.parse(Buffer.from(state, "base64url").toString("utf-8"));
        registrationData = decoded.registrationData;
        if (decoded.returnUrl) returnUrl = decoded.returnUrl;
      } catch (e) {
        console.warn("Failed to parse state:", e);
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

    if (!existingUser) {
      const [newUser] = await db
        .insert(users)
        .values({
          email: googleUser.email,
          role: "CREATOR",
          avatarUrl: googleUser.picture || null,
          phoneNumber: registrationData?.whatsappNumber || null,
          isActive: true,
        })
        .returning();
      userId = newUser.id;
      existingUser = newUser;
    } else {
      userId = existingUser.id;
      // Update avatar if not set
      if (!existingUser.avatarUrl && googleUser.picture) {
        await db
          .update(users)
          .set({ avatarUrl: googleUser.picture })
          .where(eq(users.id, userId));
      }
    }

    // 5. If registration form data was submitted, persist Creator Profile, TikTok Account & Address
    let creatorProfileId: string | undefined;

    const existingProfile = await db
      .select()
      .from(creatorProfiles)
      .where(eq(creatorProfiles.userId, userId))
      .limit(1)
      .then((rows) => rows[0]);

    if (registrationData) {
      if (!existingProfile) {
        const [newProfile] = await db
          .insert(creatorProfiles)
          .values({
            userId,
            fullName: registrationData.fullName || googleUser.name,
            whatsappNumber: registrationData.whatsappNumber || "",
            niche: registrationData.niche || "General",
            bankName: registrationData.bankName || null,
            bankAccountNumber: registrationData.bankAccountNumber || null,
            bankAccountHolder: registrationData.bankAccountHolder || registrationData.fullName || googleUser.name,
          })
          .returning();
        creatorProfileId = newProfile.id;
      } else {
        creatorProfileId = existingProfile.id;
        await db
          .update(creatorProfiles)
          .set({
            fullName: registrationData.fullName || existingProfile.fullName,
            whatsappNumber: registrationData.whatsappNumber || existingProfile.whatsappNumber,
            niche: registrationData.niche || existingProfile.niche,
            bankName: registrationData.bankName || existingProfile.bankName,
            bankAccountNumber: registrationData.bankAccountNumber || existingProfile.bankAccountNumber,
            bankAccountHolder: registrationData.bankAccountHolder || existingProfile.bankAccountHolder,
          })
          .where(eq(creatorProfiles.id, creatorProfileId));
      }

      // Save TikTok Account if provided
      if (registrationData.tiktokHandle && creatorProfileId) {
        const cleanHandle = registrationData.tiktokHandle.replace(/^@/, "").trim();
        const existingTiktok = await db
          .select()
          .from(tiktokAccounts)
          .where(eq(tiktokAccounts.creatorProfileId, creatorProfileId))
          .limit(1)
          .then((rows) => rows[0]);

        if (!existingTiktok) {
          await db.insert(tiktokAccounts).values({
            creatorProfileId,
            openId: `tiktok_${cleanHandle}_${Date.now()}`,
            handle: cleanHandle,
            displayName: registrationData.fullName || googleUser.name,
            avatarUrl: googleUser.picture || null,
            isVerified: true,
          });
        }
      }

      // Save Shipping Address if provided
      if (registrationData.streetAddress && creatorProfileId) {
        const existingAddr = await db
          .select()
          .from(shippingAddresses)
          .where(eq(shippingAddresses.creatorProfileId, creatorProfileId))
          .limit(1)
          .then((rows) => rows[0]);

        if (!existingAddr) {
          await db.insert(shippingAddresses).values({
            creatorProfileId,
            recipientName: registrationData.recipientName || registrationData.fullName || googleUser.name,
            phoneNumber: registrationData.shippingPhone || registrationData.whatsappNumber || "",
            province: registrationData.provinceName || "",
            city: registrationData.regencyName || "",
            district: registrationData.districtName || "",
            postalCode: registrationData.postalCode || "",
            streetAddress: `${registrationData.streetAddress}${registrationData.villageName ? ` (Kel. ${registrationData.villageName})` : ""}`,
            isDefault: true,
          });
        }
      }
    } else if (existingProfile) {
      creatorProfileId = existingProfile.id;
    }

    // 6. Create Auth Session Token
    const sessionToken = await createSessionToken({
      id: userId,
      email: googleUser.email,
      name: googleUser.name,
      avatarUrl: googleUser.picture,
      role: existingUser.role,
      creatorProfileId,
    });

    // 7. Set HTTP-only Cookie and Redirect
    const response = NextResponse.redirect(`${appUrl}${returnUrl}`);
    response.cookies.set("creavy_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("Google Auth Callback Exception:", err);
    return NextResponse.redirect(`${appUrl}/register?error=${encodeURIComponent(err.message || "auth_callback_error")}`);
  }
}
