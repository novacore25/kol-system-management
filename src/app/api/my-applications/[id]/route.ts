import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { db } from "@/db";
import {
  campaignApplications,
  campaigns,
  creatorProfiles,
  sampleShipments,
  tiktokAccounts,
  campaignTasks,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { ensureDbColumns } from "@/db/ensure-schema";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureDbColumns();
    const { id } = await params;

    // Get creator profile ID
    let creatorProfileId = session.creatorProfileId || null;
    if (!creatorProfileId && session.id) {
      const [prof] = await db
        .select({ id: creatorProfiles.id })
        .from(creatorProfiles)
        .where(eq(creatorProfiles.userId, session.id))
        .limit(1);
      if (prof) creatorProfileId = prof.id;
    }

    // Query application with joins
    const rows = await db
      .select({
        application: campaignApplications,
        campaign: campaigns,
        shipment: sampleShipments,
        tiktokAccount: tiktokAccounts,
        task: campaignTasks,
      })
      .from(campaignApplications)
      .innerJoin(campaigns, eq(campaignApplications.campaignId, campaigns.id))
      .leftJoin(sampleShipments, eq(sampleShipments.applicationId, campaignApplications.id))
      .leftJoin(tiktokAccounts, eq(tiktokAccounts.id, campaignApplications.tiktokAccountId))
      .leftJoin(campaignTasks, eq(campaignTasks.applicationId, campaignApplications.id))
      .where(eq(campaignApplications.id, id))
      .limit(1);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Campaign detail not found" }, { status: 404 });
    }

    const { application, campaign, shipment, tiktokAccount, task } = rows[0];

    // Security check: only allow creator who owns it or admin
    if (
      session.role !== "ADMIN" &&
      creatorProfileId &&
      application.creatorProfileId &&
      application.creatorProfileId !== creatorProfileId
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const sowList = ((campaign.sowChecklist as any[]) || []).map((s) =>
      typeof s === "string" ? s : s.title
    );

    const dosAndDonts = ((campaign.dosAndDonts as any[]) || []).map((d) =>
      typeof d === "string" ? { type: "DO" as const, text: d } : d
    );

    const daysRemaining = Math.max(
      0,
      Math.ceil((new Date(campaign.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    );

    const selectedVariant = application.internalNotes?.startsWith("Varian dipilih: ")
      ? application.internalNotes.replace("Varian dipilih: ", "")
      : null;

    return NextResponse.json({
      id: application.id,
      applicationId: application.id,
      applicationStatus: application.status,
      appliedAt: application.appliedAt ? application.appliedAt.toISOString() : new Date().toISOString(),
      reviewedAt: application.reviewedAt ? application.reviewedAt.toISOString() : null,
      rejectionReason: application.rejectionReason,
      selectedVariant,
      shippingAddressSnapshot: application.shippingAddressSnapshot,
      creatorUsername: tiktokAccount?.handle
        ? `@${tiktokAccount.handle.replace(/^@/, "")}`
        : application.applicantTiktokHandle
        ? `@${application.applicantTiktokHandle.replace(/^@/, "")}`
        : "@kreator",
      courierName: shipment?.courierName || null,
      trackingNumber: shipment?.trackingNumber || null,
      trackingStatus: shipment?.trackingStatus || "LABEL_CREATED",
      dispatchedAt: shipment?.dispatchedAt ? shipment.dispatchedAt.toISOString() : null,
      deliveredAt: shipment?.deliveredAt ? shipment.deliveredAt.toISOString() : null,
      campaign: {
        id: campaign.id,
        title: campaign.title,
        slug: campaign.slug,
        brandName: campaign.brandName,
        bannerUrl: campaign.bannerUrl,
        description: campaign.description,
        brief: (campaign as any).brief || null,
        platformType: campaign.platformType,
        productId: campaign.productId,
        salePrice: campaign.salePrice,
        shopName: campaign.shopName,
        locationId: campaign.locationId,
        locationName: campaign.locationName,
        merchantName: campaign.merchantName,
        industryCategory: campaign.industryCategory,
        benefitType: campaign.benefitType,
        benefitData: campaign.benefitData,
        commissionRateText: campaign.commissionRateText,
        startDate: campaign.startDate.toISOString().split("T")[0],
        endDate: campaign.endDate.toISOString().split("T")[0],
        daysRemaining,
        targetAffiliateLink: campaign.targetAffiliateLink || "",
        productSkus: (campaign.productSkus as any[]) || [],
        mandatoryHashtags: (campaign.mandatoryHashtags as string[]) || [],
        mandatoryMentions: (campaign.mandatoryMentions as string[]) || [],
        sowItems: sowList,
        dosAndDonts,
        campaignVariants: ((campaign as any).campaignVariants as string[]) || [],
        status: campaign.status,
      },
      task: task
        ? {
            id: task.id,
            taskStatus: task.taskStatus,
            detectedVideo: task.detectedVideoId
              ? {
                  videoId: task.detectedVideoId,
                  videoUrl: task.videoUrl || "",
                  title: task.videoTitle || "Video Kreator",
                  coverUrl: task.videoCoverUrl || "",
                  viewsCount: (task.viewsCount || 0).toLocaleString(),
                  likesCount: (task.likesCount || 0).toLocaleString(),
                  commentsCount: (task.commentsCount || 0).toLocaleString(),
                  postDate: task.postTime ? task.postTime.toISOString().split("T")[0] : "-",
                  isBasketVerified: task.isBasketVerified || false,
                }
              : null,
          }
        : null,
    });
  } catch (err: any) {
    console.error("Error fetching my application detail:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
