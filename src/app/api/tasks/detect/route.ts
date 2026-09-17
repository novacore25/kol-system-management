import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskId, tiktokHandle } = body;

    // Simulate real TikTok Open API query latency
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulated matched video result
    const detectedVideo = {
      videoId: `tt_${Date.now()}`,
      videoUrl: `https://www.tiktok.com/${tiktokHandle || "@kreator"}/video/7281920192831`,
      title: "Review Jujur Campaign Produk! Bagus banget hasilnya!",
      coverUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400&auto=format&fit=crop",
      viewsCount: "12.8K",
      likesCount: "1.4K",
      commentsCount: "89",
      postDate: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      isBasketVerified: true,
    };

    return NextResponse.json({
      success: true,
      message: "Video TikTok berhasil terdeteksi otomatis oleh robot agency!",
      detectedVideo,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Gagal mendeteksi video" },
      { status: 500 }
    );
  }
}
