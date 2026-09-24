export type UserRole = "ADMIN" | "CREATOR";

export type CreatorTier = "TIER_1" | "TIER_2" | "TIER_3" | "TIER_4" | "TIER_5";

export type CampaignStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED" | "ARCHIVED";

export type CommissionType = "COMMISSION_ONLY" | "FIXED_FEE" | "HYBRID";

export type ApplicationStatus = "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "WAITLISTED";

export type ShipmentStatus = "LABEL_CREATED" | "PICKED_UP" | "IN_TRANSIT" | "DELIVERED" | "RETURNED";

export type TaskStatus =
  | "WAITING_SAMPLE"
  | "SAMPLE_DELIVERED"
  | "WAITING_POST"
  | "DETECTED_ACTIVE"
  | "VERIFIED_COMPLETE"
  | "FLAGGED_OR_REMOVED";

export type TikTokContentType = "VIDEO" | "LIVE" | "SHOWCASE";

export type TikTokOrderStatus =
  | "AWAITING_PAYMENT"
  | "PAID"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "SETTLED"
  | "CANCELLED"
  | "REFUNDED";

export interface SOWChecklistItem {
  id: string;
  title: string;
  required: boolean;
}

export interface DosAndDontsItem {
  type: "DO" | "DONT";
  text: string;
}

export interface ShippingAddressData {
  recipientName: string;
  phoneNumber: string;
  province: string;
  city: string;
  district: string;
  postalCode: string;
  streetAddress: string;
}

export interface TikTokTokenResponse {
  open_id: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
  scope: string;
  token_type: string;
}

export interface TikTokUserStatsResponse {
  follower_count: number;
  following_count: number;
  likes_count: number;
  video_count: number;
}

export interface TikTokVideoItem {
  id: string;
  title: string;
  video_description: string;
  create_time: number;
  cover_image_url: string;
  share_url: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  share_count: number;
}

// ==========================================
// RAW DATA MODELS (VIDEO, LIVE, SALES)
// ==========================================
export interface RawDataVideo {
  id: string;
  campaignId?: string;
  productId: string; // TikTok Shop Product ID
  creatorUsername: string; // @handle
  creatorOpenId?: string;
  videoId: string;
  videoUrl: string;
  caption: string;
  postTime: string;
  durationSeconds: number;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  retentionRate: number; // e.g. 68.5%
}

export interface RawDataLive {
  id: string;
  campaignId?: string;
  productId: string;
  creatorUsername: string;
  liveRoomId: string;
  liveTitle: string;
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  totalLiveViews: number;
  peakViewersPcu: number;
  avgViewersAcu: number;
  totalComments: number;
  totalShares: number;
  totalProductClicks: number;
}

export interface RawDataSales {
  id: string;
  campaignId?: string;
  productId: string;
  skuId?: string;
  productName: string;
  creatorUsername: string;
  orderId: string;
  subOrderId?: string;
  contentType: TikTokContentType;
  sourceId?: string; // videoId or liveRoomId
  orderStatus: TikTokOrderStatus;
  quantity: number;
  itemPrice: number;
  totalGmv: number;
  commissionRate: number; // e.g. 10.0
  commissionAmount: number;
  settledCommission: number;
  orderCreatedTime: string;
  orderSettledTime?: string;
  buyerRegion?: string;
}

export interface CampaignSalesAwarenessSummary {
  productId: string;
  creatorUsername: string;
  totalViews: number;
  totalLikes: number;
  totalLiveDurationMinutes: number;
  totalLivePeakViewers: number;
  totalItemsSold: number;
  totalGmv: number;
  estimatedCommission: number;
  settledCommission: number;
  videoCount: number;
  liveCount: number;
  // TikTok Go specific metrics
  redemptionAmount?: number;
  redeemedOrders?: number;
}

// ==========================================
// TIKTOK GO SPECIFIC TYPES & DATASETS
// ==========================================
export type CampaignPlatformType = "TIKTOK_SHOP" | "TIKTOK_GO";
export type TikTokGoBenefitType = "VOUCHER_DIGITAL" | "OUTLET_PASS_LINK";
export type TikTokGoIndustry = "Dining" | "Accommodations" | "Attractions" | "Beauty & Wellness" | "Retail & Other";

export interface RawTikTokGoVideo {
  industry: string;
  creatorType: string;
  postId: string;
  postTitle: string;
  postDate: string;
  currentStatus: string;
  duration: string;
  taskType: string;
  locationId: string; // POI ID
  locationName: string; // Nama Outlet / Resto / Hotel
  productId: string; // ID Voucher
  productName: string; // Nama Voucher / Menu
  locationRegion: string;
  locationCity: string;
  merchant: string;
  creatorName: string;
  creatorId: string;
  postLink: string;
  salesValue: number; // GMV Penjualan Voucher
  orders: number; // Qty Voucher Terjual
  redemptionAmount: number; // Nilai Voucher yang Sudah Di-redeem
  redeemedOrders: number; // Qty Voucher yang Sudah Di-redeem di Kasir
  videoViews: number;
  ctr: string;
  cvr: string;
  aov: number;
  videoCompletionRate: string;
  likeRate: string;
  commentRate: string;
}

export interface RawTikTokGoLiveProduct {
  roomId: string;
  liveTitle: string;
  creatorId: string;
  productName: string;
  productId: string;
  merchant: string;
  merchantId: string;
  salesValue: number;
  orders: number;
  aov: number;
}

export interface RawTikTokGoLiveRoom {
  roomId: string;
  liveTitle: string;
  liveStartTime: string;
  liveEndTime: string;
  liveDuration: string;
  creatorName: string;
  creatorId: string;
  liveType: string;
  salesValue: number;
  orders: number;
  redemptionAmount: number;
  redeemedOrders: number;
  viewers: number;
  liveEntryRate: string;
  cvr: string;
  aov: number;
}
