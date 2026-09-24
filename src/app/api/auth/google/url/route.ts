import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { registrationData, returnUrl = "/my-tasks" } = body;

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return NextResponse.json(
        { error: "GOOGLE_CLIENT_ID is not configured in environment variables" },
        { status: 500 }
      );
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXTAUTH_URL ||
      `${req.nextUrl.protocol}//${req.nextUrl.host}`;

    const redirectUri = `${appUrl}/api/auth/google/callback`;

    // State payload encodes temporary registration form data & returnUrl
    const statePayload = {
      registrationData: registrationData || null,
      returnUrl,
      timestamp: Date.now(),
    };
    const state = Buffer.from(JSON.stringify(statePayload)).toString("base64url");

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "select_account",
      state,
    });

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    return NextResponse.json({ url: googleAuthUrl });
  } catch (error) {
    console.error("Error generating Google Auth URL:", error);
    return NextResponse.json(
      { error: "Failed to generate Google Auth URL" },
      { status: 500 }
    );
  }
}
