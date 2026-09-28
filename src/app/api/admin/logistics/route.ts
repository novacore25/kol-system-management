import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  campaignApplications,
  campaigns,
  creatorProfiles,
  tiktokAccounts,
  sampleShipments,
} from "@/db/schema";
import { eq, or, desc } from "drizzle-orm";
import { getCurrentSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session || (session.role as string) !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ambil pendaftaran yang APPROVED
    const rows = await db
      .select({
        id: campaignApplications.id,
        status: campaignApplications.status,
        internalNotes: campaignApplications.internalNotes,
        shippingAddressSnapshot: campaignApplications.shippingAddressSnapshot,
        appliedAt: campaignApplications.appliedAt,
        reviewedAt: campaignApplications.reviewedAt,
        applicantName: (campaignApplications as any).applicantName,
        applicantWhatsapp: (campaignApplications as any).applicantWhatsapp,
        applicantTiktokHandle: (campaignApplications as any).applicantTiktokHandle,
        
        // Campaign info
        campaignId: campaigns.id,
        campaignTitle: campaigns.title,
        brandName: campaigns.brandName,
        bannerUrl: campaigns.bannerUrl,
        platformType: campaigns.platformType,
        
        // Creator Profile info
        creatorFullName: creatorProfiles.fullName,
        creatorWhatsapp: creatorProfiles.whatsappNumber,
        
        // TikTok account info
        tiktokHandle: tiktokAccounts.handle,

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
      .where(eq(campaignApplications.status, "APPROVED"))
      .orderBy(desc(campaignApplications.reviewedAt));

    const formatted = rows.map((r) => {
      const creatorName = r.creatorFullName || r.applicantName || "Kreator";
      const whatsapp = r.creatorWhatsapp || r.applicantWhatsapp || "-";
      const tiktok = r.tiktokHandle || r.applicantTiktokHandle || "-";

      let selectedVariant = "-";
      if (r.internalNotes && r.internalNotes.startsWith("Varian dipilih: ")) {
        selectedVariant = r.internalNotes.replace("Varian dipilih: ", "");
      }

      return {
        id: r.id,
        status: r.shipmentId ? "DISPATCHED" : "APPROVED",
        creatorName,
        whatsapp,
        tiktokHandle: tiktok.startsWith("@") ? tiktok : `@${tiktok}`,
        campaignTitle: r.campaignTitle,
        brandName: r.brandName,
        selectedVariant,
        shippingAddress: r.shippingAddressSnapshot || {
          recipientName: creatorName,
          phoneNumber: whatsapp,
          streetAddress: "-",
          district: "-",
          city: "-",
          province: "-",
          postalCode: "-",
        },
        shipmentId: r.shipmentId || null,
        courierName: r.courierName || null,
        trackingNumber: r.trackingNumber || null,
        trackingStatus: r.trackingStatus || null,
        dispatchedAt: r.dispatchedAt || null,
      };
    });

    return NextResponse.json(formatted);
  } catch (err: any) {
    console.error("Error fetching logistics queue:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch logistics" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || (session.role as string) !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { applicationId, courierName, trackingNumber } = body;

    if (!applicationId || !courierName || !trackingNumber) {
      return NextResponse.json(
        { error: "Application ID, kurir, dan nomor resi wajib diisi" },
        { status: 400 }
      );
    }

    // Check existing shipment
    const [existing] = await db
      .select({ id: sampleShipments.id })
      .from(sampleShipments)
      .where(eq(sampleShipments.applicationId, applicationId))
      .limit(1);

    if (existing) {
      await db
        .update(sampleShipments)
        .set({
          courierName: String(courierName).trim(),
          trackingNumber: String(trackingNumber).trim(),
          trackingStatus: "IN_TRANSIT",
          dispatchedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(sampleShipments.id, existing.id));
    } else {
      await db.insert(sampleShipments).values({
        applicationId,
        courierName: String(courierName).trim(),
        trackingNumber: String(trackingNumber).trim(),
        trackingStatus: "IN_TRANSIT",
        dispatchedAt: new Date(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error saving tracking number:", err);
    return NextResponse.json({ error: err.message || "Failed to save tracking" }, { status: 500 });
  }
}
