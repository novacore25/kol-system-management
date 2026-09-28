import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  campaignApplications,
  campaigns,
  creatorProfiles,
  tiktokAccounts,
  users,
  sampleShipments,
  campaignTasks,
} from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getCurrentSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session || (session.role as string) !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rows = await db
      .select({
        id: campaignApplications.id,
        status: campaignApplications.status,
        rejectionReason: campaignApplications.rejectionReason,
        internalNotes: campaignApplications.internalNotes,
        shippingAddressSnapshot: campaignApplications.shippingAddressSnapshot,
        appliedAt: campaignApplications.appliedAt,
        reviewedAt: campaignApplications.reviewedAt,
        applicantName: campaignApplications.applicantName,
        applicantWhatsapp: campaignApplications.applicantWhatsapp,
        applicantTiktokHandle: campaignApplications.applicantTiktokHandle,
        applicantFollowerCount: campaignApplications.applicantFollowerCount,
        isGuestApply: campaignApplications.isGuestApply,
        
        // Campaign info
        campaignId: campaigns.id,
        campaignTitle: campaigns.title,
        campaignSlug: campaigns.slug,
        brandName: campaigns.brandName,
        bannerUrl: campaigns.bannerUrl,
        commissionRateText: campaigns.commissionRateText,
        platformType: campaigns.platformType,
        
        // Creator Profile info
        creatorProfileId: creatorProfiles.id,
        creatorFullName: creatorProfiles.fullName,
        creatorWhatsapp: creatorProfiles.whatsappNumber,
        creatorBio: creatorProfiles.bio,
        creatorTier: creatorProfiles.tier,
        
        // TikTok account info
        tiktokHandle: tiktokAccounts.handle,
        tiktokFollowerCount: tiktokAccounts.followerCount,
        tiktokEngagementRate: tiktokAccounts.engagementRate,
        tiktokIsVerified: tiktokAccounts.isVerified,

        // Shipment info
        shipmentId: sampleShipments.id,
        courierName: sampleShipments.courierName,
        trackingNumber: sampleShipments.trackingNumber,
        trackingStatus: sampleShipments.trackingStatus,
        dispatchedAt: sampleShipments.dispatchedAt,
      })
      .from(campaignApplications)
      .innerJoin(campaigns, eq(campaignApplications.campaignId, campaigns.id))
      .leftJoin(creatorProfiles, eq(campaignApplications.creatorProfileId, creatorProfiles.id))
      .leftJoin(tiktokAccounts, eq(campaignApplications.tiktokAccountId, tiktokAccounts.id))
      .leftJoin(sampleShipments, eq(sampleShipments.applicationId, campaignApplications.id))
      .orderBy(desc(campaignApplications.appliedAt));

    const formatted = rows.map((r) => {
      const creatorName = r.creatorFullName || r.applicantName || "Kreator";
      const whatsapp = r.creatorWhatsapp || r.applicantWhatsapp || "-";
      const tiktok = r.tiktokHandle || r.applicantTiktokHandle || "-";
      const followers = r.tiktokFollowerCount 
        ? Number(r.tiktokFollowerCount) 
        : (r.applicantFollowerCount ? Number(String(r.applicantFollowerCount).replace(/\D/g, "")) : 0);

      // Extract variant from internal notes if exists
      let selectedVariant = "-";
      if (r.internalNotes && r.internalNotes.startsWith("Varian dipilih: ")) {
        selectedVariant = r.internalNotes.replace("Varian dipilih: ", "");
      }

      return {
        id: r.id,
        status: r.status,
        rejectionReason: r.rejectionReason,
        internalNotes: r.internalNotes,
        selectedVariant,
        appliedAt: r.appliedAt,
        reviewedAt: r.reviewedAt,
        isGuestApply: !!r.isGuestApply,

        // Creator details
        creatorName,
        whatsapp,
        tiktokHandle: tiktok.startsWith("@") ? tiktok : `@${tiktok}`,
        followers,
        engagementRate: r.tiktokEngagementRate || "4.5%",
        tier: r.creatorTier || "NANO",
        city: "-",

        // Campaign details
        campaignId: r.campaignId,
        campaignTitle: r.campaignTitle,
        campaignSlug: r.campaignSlug,
        brandName: r.brandName,
        bannerUrl: r.bannerUrl,
        commissionRateText: r.commissionRateText,
        platformType: r.platformType,

        // Shipping details
        shippingAddress: r.shippingAddressSnapshot || {
          recipientName: creatorName,
          phoneNumber: whatsapp,
          streetAddress: "-",
          district: "-",
          city: "-",
          province: "-",
          postalCode: "-",
        },

        // Logistics details
        shipment: r.shipmentId ? {
          id: r.shipmentId,
          courierName: r.courierName,
          trackingNumber: r.trackingNumber,
          trackingStatus: r.trackingStatus,
          dispatchedAt: r.dispatchedAt,
        } : null,
      };
    });

    return NextResponse.json(formatted);
  } catch (err: any) {
    console.error("Error fetching admin applications:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch applications" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || (session.role as string) !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, status, rejectionReason } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Application ID and status are required" }, { status: 400 });
    }

    const [updated] = await db
      .update(campaignApplications)
      .set({
        status: status as any,
        rejectionReason: status === "REJECTED" ? (rejectionReason || "Tidak memenuhi kriteria campaign") : null,
        reviewedAt: new Date(),
        reviewedBy: session.id,
      })
      .where(eq(campaignApplications.id, id))
      .returning();

    // If approved, ensure a campaign task is created
    if (status === "APPROVED") {
      const existingTask = await db
        .select({ id: campaignTasks.id })
        .from(campaignTasks)
        .where(eq(campaignTasks.applicationId, id))
        .limit(1);

      if (existingTask.length === 0) {
        await db.insert(campaignTasks).values({
          applicationId: id,
          taskStatus: "WAITING_SAMPLE",
        });
      }
    }

    return NextResponse.json({ success: true, application: updated });
  } catch (err: any) {
    console.error("Error updating application status:", err);
    return NextResponse.json({ error: err.message || "Failed to update application" }, { status: 500 });
  }
}
