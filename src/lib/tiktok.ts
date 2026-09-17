import { TikTokTokenResponse, TikTokUserStatsResponse, TikTokVideoItem } from "@/types";

const CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY || "";
const CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET || "";
const REDIRECT_URI = process.env.TIKTOK_REDIRECT_URI || "http://localhost:3000/api/auth/tiktok/callback";

/**
 * Generate TikTok OAuth URL untuk binding akun kreator
 */
export function getTikTokAuthUrl(state: string): string {
  const rootUrl = "https://www.tiktok.com/v2/auth/authorize/";
  const options = {
    client_key: CLIENT_KEY,
    scope: "user.info.basic,user.info.profile,user.info.stats,video.list",
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    state,
  };

  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
}

/**
 * Tukar Auth Code dengan Access Token
 */
export async function exchangeCodeForToken(code: string): Promise<TikTokTokenResponse> {
  const response = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-Control": "no-cache",
    },
    body: new URLSearchParams({
      client_key: CLIENT_KEY,
      client_secret: CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: REDIRECT_URI,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gagal menukar token TikTok: ${errText}`);
  }

  const data = await response.json();
  return data.data as TikTokTokenResponse;
}

/**
 * Fetch stats kreator (Followers, likes, video count)
 */
export async function getTikTokUserStats(accessToken: string): Promise<TikTokUserStatsResponse> {
  const response = await fetch(
    "https://open.tiktokapis.com/v2/user/info/?fields=follower_count,following_count,likes_count,video_count",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Gagal mengambil data statistik user TikTok");
  }

  const data = await response.json();
  return data.data.user as TikTokUserStatsResponse;
}

/**
 * Fetch video list kreator untuk auto-detection hashtag SOW
 */
export async function getTikTokVideoList(
  accessToken: string,
  cursor: number = 0,
  maxCount: number = 20
): Promise<{ videos: TikTokVideoItem[]; cursor: number; hasMore: boolean }> {
  const response = await fetch("https://open.tiktokapis.com/v2/video/list/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      max_count: maxCount,
      cursor,
      fields: [
        "id",
        "title",
        "video_description",
        "create_time",
        "cover_image_url",
        "share_url",
        "view_count",
        "like_count",
        "comment_count",
        "share_count",
      ],
    }),
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil daftar video TikTok");
  }

  const data = await response.json();
  return {
    videos: (data.data?.videos || []) as TikTokVideoItem[],
    cursor: data.data?.cursor || 0,
    hasMore: data.data?.has_more || false,
  };
}
