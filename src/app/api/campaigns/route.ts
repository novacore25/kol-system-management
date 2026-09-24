import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { campaigns } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { getCurrentSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const allCampaigns = await db
      .select()
      .from(campaigns)
      .orderBy(desc(campaigns.createdAt));

    // Format for frontend consumption
    const formatted = allCampaigns.map((c) => ({
      id: c.id,
      title: c.title,
      brandName: c.brandName,
      category: c.category,
      bannerUrl: c.bannerUrl || "",
      platformType: c.platformType,
      locationId: c.locationId || undefined,
      locationName: c.locationName || undefined,
      merchantName: c.merchantName || undefined,
      industryCategory: c.industryCategory || undefined,
      benefitType: c.benefitType || undefined,
      benefitData: c.benefitData || undefined,
      commissionType: c.commissionType,
      commissionRateText: c.commissionRateText,
      isFreeSample: c.isFreeSample,
      sampleQuota: c.sampleQuota,
      sampleStockRemaining: c.sampleStockRemaining,
      startDate: c.startDate.toISOString().split("T")[0],
      endDate: c.endDate.toISOString().split("T")[0],
      daysRemaining: Math.max(
        0,
        Math.ceil((new Date(c.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      ),
      mandatoryHashtags: (c.mandatoryHashtags as string[]) || [],
      mandatoryMentions: (c.mandatoryMentions as string[]) || [],
      sowItems: ((c.sowChecklist as any[]) || []).map((s) => (typeof s === "string" ? s : s.title)),
      targetAffiliateLink: c.targetAffiliateLink || undefined,
      soundUrl: c.soundUrl || undefined,
    }));

    return NextResponse.json(formatted);
  } catch (err: any) {
    console.error("Error fetching campaigns:", err);
    return NextResponse.json([], { status: 200 }); // Return empty array gracefully if db not populated yet
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      brandName,
      category = "General",
      bannerUrl = "",
      description = "",
      platformType = "TIKTOK_SHOP",
      locationId,
      locationName,
      merchantName,
      industryCategory,
      benefitType,
      benefitData,
      commissionType = "COMMISSION_ONLY",
      commissionRateText = "Komisi 15%",
      isFreeSample = true,
      sampleQuota = 100,
      targetAffiliateLink,
      soundUrl,
      mandatoryHashtags = [],
      mandatoryMentions = [],
      sowItems = [],
      startDate = new Date().toISOString(),
      endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    } = body;

    const slug = `${title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 50)}-${Date.now()}`;

    const [newCampaign] = await db
      .insert(campaigns)
      .values({
        title,
        slug,
        brandName,
        category,
        bannerUrl,
        description: description || title,
        platformType,
        locationId: locationId || null,
        locationName: locationName || null,
        merchantName: merchantName || null,
        industryCategory: industryCategory || null,
        benefitType: benefitType || null,
        benefitData: benefitData || null,
        commissionType,
        commissionRateText,
        isFreeSample,
        sampleQuota,
        sampleStockRemaining: sampleQuota,
        targetAffiliateLink: targetAffiliateLink || null,
        soundUrl: soundUrl || null,
        mandatoryHashtags,
        mandatoryMentions,
        sowChecklist: sowItems.map((item: string, idx: number) => ({
          id: `sow-${idx + 1}`,
          title: item,
          required: true,
        })),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        createdBy: session.id,
      })
      .returning();

    return NextResponse.json({ success: true, campaign: newCampaign });
  } catch (error: any) {
    console.error("Error creating campaign:", error);
    return NextResponse.json({ error: error.message || "Failed to create campaign" }, { status: 500 });
  }
}
