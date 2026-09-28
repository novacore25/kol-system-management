import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { returnUrl = "/profile" } = body;

    const clientKey = process.env.TIKTOK_CLIENT_KEY || "sbawsch65yctvm5j4b";
    if (!clientKey) {
      return NextResponse.json(
        { error: "TIKTOK_CLIENT_KEY is not configured" },
        { status: 500 }
      );
    }

    let appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXTAUTH_URL ||
      `${req.nextUrl.protocol}//${req.nextUrl.host}`;

    appUrl = appUrl.trim().replace(/\/+$/, "");
    if (!appUrl.includes("localhost") && appUrl.startsWith("http://")) {
      appUrl = appUrl.replace(/^http:\/\//, "https://");
    }

    const redirectUri = `${appUrl}/api/auth/tiktok/callback`;

    // State payload encodes returnUrl and timestamp for CSRF verification
    const statePayload = {
      returnUrl,
      timestamp: Date.now(),
    };
    const state = Buffer.from(JSON.stringify(statePayload)).toString("base64url");

    // Scopes configured in TikTok Developer Console
    const scopes =
      process.env.TIKTOK_SCOPES ||
      "user.info.basic,user.info.profile,user.info.stats,video.list";

    // Build URL with exact parameter formatting compliant with TikTok Login Kit v2
    const queryParts = [
      `client_key=${encodeURIComponent(clientKey)}`,
      `scope=${encodeURIComponent(scopes).replace(/%2C/g, ",")}`,
      `response_type=code`,
      `redirect_uri=${encodeURIComponent(redirectUri)}`,
      `state=${encodeURIComponent(state)}`,
      `disable_auto_auth=0`,
    ];

    const tiktokAuthUrl = `https://www.tiktok.com/v2/auth/authorize/?${queryParts.join("&")}`;

    return NextResponse.json({ url: tiktokAuthUrl });
  } catch (error) {
    console.error("Error generating TikTok Auth URL:", error);
    return NextResponse.json(
      { error: "Failed to generate TikTok Auth URL" },
      { status: 500 }
    );
  }
}
