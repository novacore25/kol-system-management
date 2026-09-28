import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { campaigns, campaignApplications, creatorProfiles } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getCurrentSession } from "@/lib/auth";

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

// POST /api/campaigns/[slug] — creator application (works for both logged-in and guest)
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

    // Check if user is logged in — if so, link application to their profile
    const session = await getCurrentSession();
    let creatorProfileId: string | null = null;

    if (session?.creatorProfileId) {
      creatorProfileId = session.creatorProfileId;
    } else if (session?.id) {
      // Try looking up creator profile by user id
      const profiles = await db
        .select({ id: creatorProfiles.id })
        .from(creatorProfiles)
        .where(eq(creatorProfiles.userId, session.id))
        .limit(1);
      if (profiles.length > 0) {
        creatorProfileId = profiles[0].id;
      }
    }

    // Find campaign by slug
    const [campaign] = await db
      .select({
        id: campaigns.id,
        title: campaigns.title,
        sampleStockRemaining: campaigns.sampleStockRemaining,
        status: campaigns.status,
        endDate: campaigns.endDate,
      })
      .from(campaigns)
      .where(eq(campaigns.slug, slug))
      .limit(1);

    if (!campaign) {
      return NextResponse.json({ error: "Campaign tidak ditemukan." }, { status: 404 });
    }

    if (campaign.status !== "ACTIVE") {
      return NextResponse.json({ error: "Campaign ini sudah tidak aktif." }, { status: 409 });
    }

    if (new Date(campaign.endDate) < new Date()) {
      return NextResponse.json({ error: "Campaign ini sudah berakhir." }, { status: 409 });
    }

    if (campaign.sampleStockRemaining <= 0) {
      return NextResponse.json(
        { error: "Kuota sampel campaign ini sudah penuh. Terima kasih atas minatmu!" },
        { status: 409 }
      );
    }

    // Prevent duplicate application (per profile if logged in)
    if (creatorProfileId) {
      const existing = await db
        .select({ id: campaignApplications.id })
        .from(campaignApplications)
        .where(
          and(
            eq(campaignApplications.campaignId, campaign.id),
            eq(campaignApplications.creatorProfileId, creatorProfileId)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        return NextResponse.json(
          { error: "Kamu sudah pernah mendaftar campaign ini sebelumnya." },
          { status: 409 }
        );
      }
    }

    // Insert application — linked to profile if logged in, guest otherwise
    const [newApp] = await db
      .insert(campaignApplications)
      .values({
        campaignId: campaign.id,
        creatorProfileId: creatorProfileId as any,
        tiktokAccountId: null as any,
        shippingAddressSnapshot: null as any,
        status: "PENDING_REVIEW",
        applicantName: String(applicantName).trim(),
        applicantWhatsapp: String(applicantWhatsapp).trim(),
        applicantTiktokHandle: String(applicantTiktokHandle).trim(),
        applicantFollowerCount: applicantFollowerCount ? String(applicantFollowerCount).trim() : null,
        isGuestApply: !creatorProfileId, // false if linked to profile, true if guest
      } as any)
      .returning({ id: campaignApplications.id });

    return NextResponse.json({
      success: true,
      applicationId: newApp.id,
      linked: !!creatorProfileId, // tells frontend if it's linked to their profile
      message: `Pendaftaranmu untuk campaign "${campaign.title}" berhasil dikirim! Tim kami akan menghubungimu via WhatsApp dalam 1-3 hari kerja.`,
    });
  } catch (err: any) {
    console.error("Error submitting application:", err);
    return NextResponse.json({ error: err.message || "Gagal mengirim pendaftaran." }, { status: 500 });
  }
}
