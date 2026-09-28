import { NextRequest, NextResponse } from "next/server";

/**
 * TikTok Webhook Endpoint
 * Handles TikTok webhook events (e.g. user deauthorization, data updates)
 * and TikTok webhook URL challenge verification.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const challenge = searchParams.get("challenge") || searchParams.get("hub.challenge");

  // If TikTok is verifying the webhook endpoint via GET challenge
  if (challenge) {
    return new NextResponse(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return NextResponse.json({ status: "ok", message: "TikTok Webhook Active" }, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    console.log("Received TikTok Webhook Event:", JSON.stringify(body, null, 2));

    // Handle webhook event types (e.g. deauthorization, data export ready)
    const { event, client_key, user_open_id } = body;

    // Responding with 200 OK is mandatory to acknowledge receipt
    return NextResponse.json({ code: "ok", message: "Event received" }, { status: 200 });
  } catch (error) {
    console.error("Error processing TikTok Webhook:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
