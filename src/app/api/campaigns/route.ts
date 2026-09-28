import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { campaigns, campaignApplications } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { getCurrentSession } from "@/lib/auth";
import { ensureDbColumns } from "@/db/ensure-schema";

export async function GET(req: NextRequest) {
  try {
    await ensureDbColumns();

    const allCampaigns = await db
      .select()
      .from(campaigns)
      .orderBy(desc(campaigns.createdAt));

    // Get application counts per campaign
    const appStats = await db
      .select({
        campaignId: campaignApplications.campaignId,
        pendingCount: sql<number>`count(*) filter (where ${campaignApplications.status} = 'PENDING_REVIEW')::int`,
        approvedCount: sql<number>`count(*) filter (where ${campaignApplications.status} in ('APPROVED', 'DISPATCHED'))::int`,
        rejectedCount: sql<number>`count(*) filter (where ${campaignApplications.status} = 'REJECTED')::int`,
        totalCount: sql<number>`count(*)::int`,
      })
      .from(campaignApplications)
      .groupBy(campaignApplications.campaignId);

    const statsMap = new Map<string, { pending: number; approved: number; rejected: number; total: number }>();
    for (const stat of appStats) {
      statsMap.set(stat.campaignId, {
        pending: Number(stat.pendingCount) || 0,
        approved: Number(stat.approvedCount) || 0,
        rejected: Number(stat.rejectedCount) || 0,
        total: Number(stat.totalCount) || 0,
      });
    }

    // Format for frontend consumption
    const formatted = allCampaigns.map((c) => {
      const stats = statsMap.get(c.id) || { pending: 0, approved: 0, rejected: 0, total: 0 };

      return {
        id: c.id,
        title: c.title,
        slug: c.slug,
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
        brief: c.brief || undefined,
        campaignVariants: (c.campaignVariants as string[]) || [],
        targetAffiliateLink: c.targetAffiliateLink || undefined,
        soundUrl: c.soundUrl || undefined,
        productSkus: (c.productSkus as any[]) || [],
        applicantStats: stats,
      };
    });

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
        slug: providedSlug,
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
        brief = "",
        campaignVariants = [],
      } = item;

      // Use provided slug exactly if given — no timestamp suffix so the preview link matches reality
      // If no slug provided, auto-generate with timestamp to guarantee uniqueness
      const slug = providedSlug
        ? String(providedSlug).toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").slice(0, 80)
        : `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 50)}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

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
          brief: brief || null,
          campaignVariants: campaignVariants as any,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          createdBy: session.id,
        } as any)
        .returning();

      createdCampaigns.push(newCampaign);
    }

    return NextResponse.json({
      success: true,
      count: createdCampaigns.length,
      campaigns: createdCampaigns,
      // Return slug of first created campaign for toast/link display
      slug: createdCampaigns[0]?.slug,
    });
  } catch (error: any) {
    console.error("Error creating campaign:", error);
    // Friendly error for duplicate slug (unique constraint violation)
    if (error.message?.includes("unique") || error.code === "23505") {
      return NextResponse.json(
        { error: `Link campaign "${error.detail?.match(/"(.+?)"/)?.[1] || "ini"}" sudah dipakai campaign lain. Ubah slug di field Link Pendaftaran Kreator.` },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message || "Failed to create campaign" }, { status: 500 });
  }
}
