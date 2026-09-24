import {
  RawDataVideo,
  RawDataLive,
  RawDataSales,
  CampaignSalesAwarenessSummary,
  CampaignPlatformType,
  TikTokGoBenefitType,
  RawTikTokGoVideo,
  RawTikTokGoLiveProduct,
  RawTikTokGoLiveRoom,
} from "@/types";

export interface CreatorTaskItem {
  id: string;
  campaignId: string;
  campaignTitle: string;
  brandName: string;
  bannerUrl: string;
  commissionRateText: string;
  productId: string;
  creatorUsername: string;
  platformType?: CampaignPlatformType;
  status:
    | "PENDING_REVIEW"
    | "SAMPLE_DISPATCHED"
    | "WAITING_POST"
    | "VIDEO_DETECTED"
    | "REJECTED";
  rejectionReason?: string;
  
  // TikTok Go Specific Meta
  locationId?: string;
  locationName?: string;
  merchantName?: string;
  industryCategory?: string;
  benefitType?: TikTokGoBenefitType;
  benefitData?: string;
  outletAddress?: string;

  // Logistics (TikTok Shop Physical Courier)
  courierName?: string;
  trackingNumber?: string;
  dispatchedDate?: string;
  estimatedArrival?: string;
  trackingTimeline?: {
    date: string;
    title: string;
    description: string;
    isCompleted: boolean;
  }[];

  // SOW & Guidelines
  deadlineDate: string;
  daysRemaining: number;
  mandatoryHashtags: string[];
  mandatoryMentions: string[];
  soundUrl?: string;
  targetAffiliateLink: string;
  sowChecklist: string[];
  dosAndDonts?: { type: "DO" | "DONT"; text: string }[];

  // Video Tracking
  detectedVideo?: {
    videoId: string;
    videoUrl: string;
    title: string;
    coverUrl: string;
    viewsCount: string;
    likesCount: string;
    commentsCount: string;
    postDate: string;
    isBasketVerified: boolean;
    isLocationVerified?: boolean;
    locationName?: string;
  };

  // Raw Ingestion Datasets & Summary Analytics (TikTok Shop)
  rawVideos?: RawDataVideo[];
  rawLives?: RawDataLive[];
  rawSales?: RawDataSales[];
  salesSummary?: CampaignSalesAwarenessSummary;

  // Raw Ingestion Datasets (TikTok Go)
  rawGoVideos?: RawTikTokGoVideo[];
  rawGoLiveProducts?: RawTikTokGoLiveProduct[];
  rawGoLiveRooms?: RawTikTokGoLiveRoom[];
}

export const initialCreatorTasks: CreatorTaskItem[] = [];
