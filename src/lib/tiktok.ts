/**
 * TikTok API Client & Token Management Service
 * Reference: https://developers.tiktok.com/docs/en/oauth-user-access-token-management
 */

const TIKTOK_TOKEN_URL = "https://open.tiktokapis.com/v2/oauth/token/";
const TIKTOK_REVOKE_URL = "https://open.tiktokapis.com/v2/oauth/revoke/";
const TIKTOK_USER_INFO_URL = "https://open.tiktokapis.com/v2/user/info/";

export interface TikTokTokenResponse {
  access_token: string;
  expires_in: number;
  open_id: string;
  refresh_expires_in?: number;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
}

export interface TikTokUserStats {
  open_id: string;
  union_id?: string;
  avatar_url?: string;
  display_name?: string;
  username?: string;
  follower_count?: number;
  likes_count?: number;
  video_count?: number;
  is_verified?: boolean;
}

/**
 * Exchange Authorization Code for User Access Token
 */
export async function exchangeTikTokCode(
  code: string,
  redirectUri: string
): Promise<TikTokTokenResponse> {
  const clientKey = process.env.TIKTOK_CLIENT_KEY || "sbawsch65yctvm5j4b";
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET || "oPyMpYfZQmN9VxHmAn46gfRgZwVuYLsp";

  const params = new URLSearchParams({
    client_key: clientKey,
    client_secret: clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
  });

  const response = await fetch(TIKTOK_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-Control": "no-cache",
    },
    body: params.toString(),
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    console.error("TikTok token exchange error:", data);
    throw new Error(data.error_description || data.error || "Failed to exchange TikTok code");
  }

  // Support both top-level and nested response structures
  return data.data || data;
}

/**
 * Refresh an existing TikTok User Access Token
 */
export async function refreshTikTokToken(
  refreshToken: string
): Promise<TikTokTokenResponse> {
  const clientKey = process.env.TIKTOK_CLIENT_KEY || "sbawsch65yctvm5j4b";
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET || "oPyMpYfZQmN9VxHmAn46gfRgZwVuYLsp";

  const params = new URLSearchParams({
    client_key: clientKey,
    client_secret: clientSecret,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const response = await fetch(TIKTOK_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-Control": "no-cache",
    },
    body: params.toString(),
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    console.error("TikTok token refresh error:", data);
    throw new Error(data.error_description || data.error || "Failed to refresh TikTok token");
  }

  return data.data || data;
}

/**
 * Revoke TikTok User Access Token (e.g. When Creator Disconnects Account)
 */
export async function revokeTikTokAccess(accessToken: string): Promise<boolean> {
  const clientKey = process.env.TIKTOK_CLIENT_KEY || "sbawsch65yctvm5j4b";
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET || "oPyMpYfZQmN9VxHmAn46gfRgZwVuYLsp";

  const params = new URLSearchParams({
    client_key: clientKey,
    client_secret: clientSecret,
    token: accessToken,
  });

  const response = await fetch(TIKTOK_REVOKE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-Control": "no-cache",
    },
    body: params.toString(),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.error) {
    console.warn("TikTok revoke warning:", data);
    return false;
  }

  return true;
}

/**
 * Fetch TikTok Creator Profile & Analytics
 */
export async function fetchTikTokUserInfo(
  accessToken: string
): Promise<TikTokUserStats | null> {
  try {
    const fields = "open_id,union_id,avatar_url,display_name,username,follower_count,likes_count,is_verified,video_count";
    const response = await fetch(`${TIKTOK_USER_INFO_URL}?fields=${fields}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    if (!response.ok || data.error?.code !== "ok" && !data.data?.user) {
      console.warn("TikTok fetch user info failed:", data);
      return null;
    }

    return data.data.user;
  } catch (err) {
    console.error("TikTok fetch user info exception:", err);
    return null;
  }
}
