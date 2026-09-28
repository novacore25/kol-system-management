import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { db } from "@/db";
import { campaignApplications, campaigns, creatorProfiles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get creator profile id from session
    let creatorProfileId = session.creatorProfileId;

    // If not in session, look up from DB
    if (!creatorProfileId) {
      const profiles = await db
        .select({ id: creatorProfiles.id })
        .from(creatorProfiles)
        .where(eq(creatorProfiles.userId, session.id))
        .limit(1);
      if (profiles.length > 0) {
        creatorProfileId = profiles[0].id;
      }
    }

    let applications: any[] = [];

    if (creatorProfileId) {
      // Fetch applications with campaign data joined
      const rows = await db
        .select({
          applicationId: campaignApplications.id,
          applicationStatus: campaignApplications.status,
          appliedAt: campaignApplications.appliedAt,
          reviewedAt: campaignApplications.reviewedAt,
          rejectionReason: campaignApplications.rejectionReason,
          // Campaign fields
          campaignId: campaigns.id,
          campaignTitle: campaigns.title,
          campaignSlug: campaigns.slug,
          brandName: campaigns.brandName,
          bannerUrl: campaigns.bannerUrl,
          platformType: campaigns.platformType,
          commissionRateText: campaigns.commissionRateText,
          sampleQuota: campaigns.sampleQuota,
          endDate: campaigns.endDate,
          campaignStatus: campaigns.status,
          productSkus: campaigns.productSkus,
          mandatoryHashtags: campaigns.mandatoryHashtags,
          sowChecklist: campaigns.sowChecklist,
        })
        .from(campaignApplications)
        .innerJoin(campaigns, eq(campaignApplications.campaignId, campaigns.id))
        .where(eq(campaignApplications.creatorProfileId, creatorProfileId))
        .orderBy(desc(campaignApplications.appliedAt));

      applications = rows.map((r) => ({
        applicationId: r.applicationId,
        applicationStatus: r.applicationStatus,
        appliedAt: r.appliedAt,
        reviewedAt: r.reviewedAt,
        rejectionReason: r.rejectionReason,
        campaign: {
          id: r.campaignId,
          title: r.campaignTitle,
          slug: r.campaignSlug,
          brandName: r.brandName,
          bannerUrl: r.bannerUrl,
          platformType: r.platformType,
          commissionRateText: r.commissionRateText,
          sampleQuota: r.sampleQuota,
          endDate: r.endDate,
          status: r.campaignStatus,
          productSkus: (r.productSkus as any[]) || [],
          mandatoryHashtags: (r.mandatoryHashtags as string[]) || [],
          sowChecklist: (r.sowChecklist as any[]) || [],
        },
      }));
    } else {
      // Guest applications — look up by applicant info not supported yet
      // Return empty for now
    }

    return NextResponse.json({ applications });
  } catch (err: any) {
    console.error("Error fetching my applications:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
