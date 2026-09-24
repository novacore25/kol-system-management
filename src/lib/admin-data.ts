export interface AdminApplicationItem {
  id: string;
  creatorName: string;
  creatorAvatar: string;
  whatsappNumber: string;
  tiktokHandle: string;
  followersCount: string;
  tier: "TIER_1" | "TIER_2" | "TIER_3" | "TIER_4" | "TIER_5";
  niche: string;
  completionRate: string;
  campaignId: string;
  campaignTitle: string;
  brandName: string;
  appliedDate: string;
  status: "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "DISPATCHED";
  rejectionReason?: string;
  // Shipping info
  shippingAddress: {
    recipientName: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    postalCode: string;
    street: string;
  };
  // Logistics
  courierName?: string;
  trackingNumber?: string;
  dispatchedAt?: string;
}

export const initialApplications: AdminApplicationItem[] = [];
