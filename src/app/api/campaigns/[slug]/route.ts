import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { campaigns, campaignApplications, creatorProfiles, tiktokAccounts } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getCurrentSession } from "@/lib/auth";
import { ensureDbColumns } from "@/db/ensure-schema";

// GET /api/campaigns/[slug] — public, no auth needed
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await ensureDbColumns();

    const { slug } = await params;
    const [campaign] = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.slug, slug))
      .limit(1);

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // Check if current user has already applied
    const session = await getCurrentSession();
    let alreadyApplied = false;
    let userApplication: {
      id: string;
      status: string;
      appliedAt: string;
      selectedVariant?: string | null;
    } | null = null;

    if (session) {
      let creatorProfileId = session.creatorProfileId || null;
      if (!creatorProfileId && session.id) {
        const [prof] = await db
          .select({ id: creatorProfiles.id })
          .from(creatorProfiles)
          .where(eq(creatorProfiles.userId, session.id))
          .limit(1);
        if (prof) creatorProfileId = prof.id;
      }

      if (creatorProfileId) {
        const [app] = await db
          .select({
            id: campaignApplications.id,
            status: campaignApplications.status,
            appliedAt: campaignApplications.appliedAt,
            internalNotes: campaignApplications.internalNotes,
          })
          .from(campaignApplications)
          .where(
            and(
              eq(campaignApplications.campaignId, campaign.id),
              eq(campaignApplications.creatorProfileId, creatorProfileId)
            )
          )
          .limit(1);

        if (app) {
          alreadyApplied = true;
          userApplication = {
            id: app.id,
            status: app.status,
            appliedAt: app.appliedAt.toISOString(),
            selectedVariant: app.internalNotes?.startsWith("Varian dipilih: ")
              ? app.internalNotes.replace("Varian dipilih: ", "")
              : null,
          };
        }
      }
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
      campaignVariants: ((campaign as any).campaignVariants as string[]) || [],
      targetAffiliateLink: campaign.targetAffiliateLink,
      productSkus: (campaign.productSkus as any[]) || [],
      status: campaign.status,
      alreadyApplied,
      userApplication,
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
    const {
      applicantName,
      applicantWhatsapp,
      applicantTiktokHandle,
      applicantFollowerCount,
      selectedVariant,
      shippingAddressSnapshot,
    } = body;

    if (!applicantName || !applicantWhatsapp || !applicantTiktokHandle) {
      return NextResponse.json(
        { error: "Nama, nomor WhatsApp, dan akun TikTok wajib diisi." },
        { status: 400 }
      );
    }

    // Check if user is logged in — link application to their profile
    const session = await getCurrentSession();
    let creatorProfileId: string | null = null;
    let resolvedTiktokAccountId: string | null = body.tiktokAccountId || null;
    let finalTiktokHandle = String(applicantTiktokHandle).trim();
    let finalFollowerCount = applicantFollowerCount ? String(applicantFollowerCount).trim() : null;

    if (session?.creatorProfileId) {
      creatorProfileId = session.creatorProfileId;
    } else if (session?.id) {
      const profiles = await db
        .select({ id: creatorProfiles.id })
        .from(creatorProfiles)
        .where(eq(creatorProfiles.userId, session.id))
        .limit(1);
      if (profiles.length > 0) {
        creatorProfileId = profiles[0].id;
      }
    }

    // If profile exists, automatically resolve TikTok account if not explicitly passed
    if (creatorProfileId) {
      const accounts = await db
        .select({
          id: tiktokAccounts.id,
          handle: tiktokAccounts.handle,
          followerCount: tiktokAccounts.followerCount,
        })
        .from(tiktokAccounts)
        .where(
          resolvedTiktokAccountId
            ? eq(tiktokAccounts.id, resolvedTiktokAccountId)
            : eq(tiktokAccounts.creatorProfileId, creatorProfileId)
        )
        .limit(1);

      if (accounts.length > 0) {
        resolvedTiktokAccountId = accounts[0].id;
        if (!finalTiktokHandle || finalTiktokHandle === "-") {
          finalTiktokHandle = accounts[0].handle;
        }
        if (!finalFollowerCount) {
          finalFollowerCount = String(accounts[0].followerCount || "0");
        }
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

    // Build internal notes (selected variant info)
    const internalNotes = selectedVariant ? `Varian dipilih: ${selectedVariant}` : null;

    // Insert application
    const [newApp] = await db
      .insert(campaignApplications)
      .values({
        campaignId: campaign.id,
        creatorProfileId: creatorProfileId,
        tiktokAccountId: resolvedTiktokAccountId,
        shippingAddressSnapshot: (shippingAddressSnapshot || null) as any,
        status: "PENDING_REVIEW",
        applicantName: String(applicantName).trim(),
        applicantWhatsapp: String(applicantWhatsapp).trim(),
        applicantTiktokHandle: finalTiktokHandle,
        applicantFollowerCount: finalFollowerCount,
        isGuestApply: !creatorProfileId,
        internalNotes: internalNotes,
      })
      .returning({ id: campaignApplications.id });

    return NextResponse.json({
      success: true,
      applicationId: newApp.id,
      linked: !!creatorProfileId,
      message: `Pendaftaranmu untuk campaign "${campaign.title}" berhasil dikirim! Tim kami akan menghubungimu via WhatsApp dalam 1-3 hari kerja.`,
    });
  } catch (err: any) {
    console.error("Error submitting application:", err);
    return NextResponse.json({ error: err.message || "Gagal mengirim pendaftaran." }, { status: 500 });
  }
}
