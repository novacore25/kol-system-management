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
      productId: c.productId || undefined,
      tiktokCampaignId: c.tiktokCampaignId || undefined,
      salePrice: c.salePrice || undefined,
      shopName: c.shopName || undefined,
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
      productSkus: (c.productSkus as any[]) || [],
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

    // Support single item or batch array
    const items = Array.isArray(body) ? body : [body];
    const createdCampaigns = [];

    for (const item of items) {
      const {
        title,
        brandName,
        category = "General",
        bannerUrl = "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop",
        description = "",
        platformType = "TIKTOK_SHOP",
        productId,
        tiktokCampaignId,
        salePrice,
        shopName,
        locationId,
        locationName,
        merchantName,
        industryCategory,
        benefitType,
        benefitData,
        commissionType = "COMMISSION_ONLY",
        commissionRateText = "5.00%",
        isFreeSample = true,
        sampleQuota = 50,
        targetAffiliateLink,
        soundUrl,
        mandatoryHashtags = ["#CreavyCampaign", "#ReviewJujur"],
        mandatoryMentions = ["@creavy_official"],
        sowItems = ["Tautkan link keranjang kuning / showcase produk", "Durasi video minimal 30 detik", "Review jelas & pencahayaan bagus"],
        startDate = new Date().toISOString(),
        endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      } = item;

      const slug = `${title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .slice(0, 50)}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const [newCampaign] = await db
        .insert(campaigns)
        .values({
          title,
          slug,
          brandName: brandName || shopName || "Brand",
          category,
          bannerUrl,
          description: description || title,
          platformType,
          productId: productId ? String(productId) : null,
          tiktokCampaignId: tiktokCampaignId ? String(tiktokCampaignId) : null,
          salePrice: salePrice || null,
          shopName: shopName || brandName || null,
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
          productSkus: (item.productSkus as any[]) || [],
          mandatoryHashtags,
          mandatoryMentions,
          sowChecklist: sowItems.map((sow: string, idx: number) => ({
            id: `sow-${idx + 1}`,
            title: sow,
            required: true,
          })),
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          createdBy: session.id,
        })
        .returning();

      createdCampaigns.push(newCampaign);
    }

    return NextResponse.json({
      success: true,
      count: createdCampaigns.length,
      campaigns: createdCampaigns,
    });
  } catch (error: any) {
    console.error("Error creating campaign:", error);
    return NextResponse.json({ error: error.message || "Failed to create campaign" }, { status: 500 });
  }
}
