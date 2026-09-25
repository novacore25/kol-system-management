import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { returnUrl = "/profile" } = body;

    const clientKey = process.env.TIKTOK_CLIENT_KEY || "awkbncxurh4il884";
    if (!clientKey) {
      return NextResponse.json(
        { error: "TIKTOK_CLIENT_KEY is not configured" },
        { status: 500 }
      );
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXTAUTH_URL ||
      `${req.nextUrl.protocol}//${req.nextUrl.host}`;

    const redirectUri = `${appUrl}/api/auth/tiktok/callback`;

    // State payload encodes returnUrl and timestamp for CSRF verification
    const statePayload = {
      returnUrl,
      timestamp: Date.now(),
    };
    const state = Buffer.from(JSON.stringify(statePayload)).toString("base64url");

    // Scopes requested from TikTok (default to standard user.info.basic)
    const scopes = process.env.TIKTOK_SCOPES || "user.info.basic";

    const params = new URLSearchParams({
      client_key: clientKey,
      scope: scopes,
      response_type: "code",
      redirect_uri: redirectUri,
      state,
      disable_auto_auth: "0",
    });

    const tiktokAuthUrl = `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`;

    return NextResponse.json({ url: tiktokAuthUrl });
  } catch (error) {
    console.error("Error generating TikTok Auth URL:", error);
    return NextResponse.json(
      { error: "Failed to generate TikTok Auth URL" },
      { status: 500 }
    );
  }
}
