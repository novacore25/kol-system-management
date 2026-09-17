export type UserRole = "ADMIN" | "PIC" | "CREATOR" | "BRAND";

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
