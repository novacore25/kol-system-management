import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { campaigns, campaignApplications } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// GET /api/campaigns/[slug] — public, no auth needed
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const [campaign] = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.slug, slug))
      .limit(1);

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: campaign.id,
      title: campaign.title,
      slug: campaign.slug,
      brandName: campaign.brandName,
      bannerUrl: campaign.bannerUrl,
      description: campaign.description,
      category: campaign.category,
      platformType: campaign.platformType,
      productId: campaign.productId,
      salePrice: campaign.salePrice,
      shopName: campaign.shopName,
      locationId: campaign.locationId,
      locationName: campaign.locationName,
      industryCategory: campaign.industryCategory,
      benefitType: campaign.benefitType,
      benefitData: campaign.benefitData,
      commissionRateText: campaign.commissionRateText,
      isFreeSample: campaign.isFreeSample,
      sampleQuota: campaign.sampleQuota,
      sampleStockRemaining: campaign.sampleStockRemaining,
      startDate: campaign.startDate.toISOString().split("T")[0],
      endDate: campaign.endDate.toISOString().split("T")[0],
      daysRemaining: Math.max(
        0,
        Math.ceil((new Date(campaign.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      ),
      mandatoryHashtags: (campaign.mandatoryHashtags as string[]) || [],
      mandatoryMentions: (campaign.mandatoryMentions as string[]) || [],
      sowItems: ((campaign.sowChecklist as any[]) || []).map((s) =>
        typeof s === "string" ? s : s.title
      ),
      brief: (campaign as any).brief || null,
      targetAffiliateLink: campaign.targetAffiliateLink,
      productSkus: (campaign.productSkus as any[]) || [],
      status: campaign.status,
    });
  } catch (err: any) {
    console.error("Error fetching campaign by slug:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/campaigns/[slug] — simple creator application (no login needed)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const { applicantName, applicantWhatsapp, applicantTiktokHandle, applicantFollowerCount } = body;

    if (!applicantName || !applicantWhatsapp || !applicantTiktokHandle) {
      return NextResponse.json(
        { error: "Nama, nomor WhatsApp, dan akun TikTok wajib diisi." },
        { status: 400 }
      );
    }

    // Find campaign by slug
    const [campaign] = await db
      .select({ id: campaigns.id, title: campaigns.title, sampleStockRemaining: campaigns.sampleStockRemaining })
      .from(campaigns)
      .where(eq(campaigns.slug, slug))
      .limit(1);

    if (!campaign) {
      return NextResponse.json({ error: "Campaign tidak ditemukan." }, { status: 404 });
    }

    if (campaign.sampleStockRemaining <= 0) {
      return NextResponse.json(
        { error: "Kuota sampel campaign ini sudah penuh. Terima kasih atas minatmu!" },
        { status: 409 }
      );
    }

    // Insert guest application
    const [newApp] = await db
      .insert(campaignApplications)
      .values({
        campaignId: campaign.id,
        creatorProfileId: null as any,
        tiktokAccountId: null as any,
        shippingAddressSnapshot: null as any,
        status: "PENDING_REVIEW",
        applicantName: String(applicantName).trim(),
        applicantWhatsapp: String(applicantWhatsapp).trim(),
        applicantTiktokHandle: String(applicantTiktokHandle).trim(),
        applicantFollowerCount: applicantFollowerCount ? String(applicantFollowerCount).trim() : null,
        isGuestApply: true,
      } as any)
      .returning({ id: campaignApplications.id });

    return NextResponse.json({
      success: true,
      applicationId: newApp.id,
      message: `Pendaftaranmu untuk campaign "${campaign.title}" berhasil dikirim! Tim kami akan menghubungimu via WhatsApp dalam 1-3 hari kerja.`,
    });
  } catch (err: any) {
    console.error("Error submitting application:", err);
    return NextResponse.json({ error: err.message || "Gagal mengirim pendaftaran." }, { status: 500 });
  }
}
