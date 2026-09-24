import {
  pgTable,
  text,
  timestamp,
  integer,
  bigint,
  boolean,
  uuid,
  numeric,
  jsonb,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ==========================================
// ENUMS
// ==========================================
export const roleEnum = pgEnum("user_role", [
  "ADMIN",
  "PIC",
  "CREATOR",
  "BRAND",
]);

export const creatorTierEnum = pgEnum("creator_tier", [
  "TIER_1", // Nano (<10k)
  "TIER_2", // Micro (10k-50k)
  "TIER_3", // Mid-Tier (50k-250k)
  "TIER_4", // Macro (250k-1M)
  "TIER_5", // Mega (>1M)
]);

export const campaignStatusEnum = pgEnum("campaign_status", [
  "DRAFT",
  "ACTIVE",
  "PAUSED",
  "COMPLETED",
  "ARCHIVED",
]);

export const commissionTypeEnum = pgEnum("commission_type", [
  "COMMISSION_ONLY",
  "FIXED_FEE",
  "HYBRID",
]);

export const applicationStatusEnum = pgEnum("application_status", [
  "PENDING_REVIEW",
  "APPROVED",
  "REJECTED",
  "WAITLISTED",
]);

export const shipmentStatusEnum = pgEnum("shipment_status", [
  "LABEL_CREATED",
  "PICKED_UP",
  "IN_TRANSIT",
  "DELIVERED",
  "RETURNED",
]);

export const taskStatusEnum = pgEnum("task_status", [
  "WAITING_SAMPLE",
  "SAMPLE_DELIVERED",
  "WAITING_POST",
  "DETECTED_ACTIVE",
  "VERIFIED_COMPLETE",
  "FLAGGED_OR_REMOVED",
]);

export const contentTypeEnum = pgEnum("content_type", [
  "VIDEO",
  "LIVE",
  "SHOWCASE",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "AWAITING_PAYMENT",
  "PAID",
  "IN_TRANSIT",
  "DELIVERED",
  "SETTLED",
  "CANCELLED",
  "REFUNDED",
]);

export const campaignPlatformTypeEnum = pgEnum("campaign_platform_type", [
  "TIKTOK_SHOP",
  "TIKTOK_GO",
]);

export const tiktokGoBenefitTypeEnum = pgEnum("tiktok_go_benefit_type", [
  "VOUCHER_DIGITAL",
  "OUTLET_PASS_LINK",
]);

// ==========================================
// 1. USERS & PROFILES
// ==========================================
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  phoneNumber: text("phone_number").unique(),
  role: roleEnum("role").default("CREATOR").notNull(),
  passwordHash: text("password_hash"),
  avatarUrl: text("avatar_url"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const creatorProfiles = pgTable("creator_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  fullName: text("full_name").notNull(),
  whatsappNumber: text("whatsapp_number").notNull(),
  bio: text("bio"),
  tier: creatorTierEnum("tier").default("TIER_1").notNull(),
  niche: text("niche"), // e.g. 'Beauty & Skincare', 'Fashion', 'Gadget'
  completionRate: numeric("completion_rate", { precision: 5, scale: 2 }).default("100.00"), // persentase video selesai sesuai SOW
  bankName: text("bank_name"), // e.g. BCA, Mandiri, BRI
  bankAccountNumber: text("bank_account_number"),
  bankAccountHolder: text("bank_account_holder"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const shippingAddresses = pgTable("shipping_addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  creatorProfileId: uuid("creator_profile_id")
    .references(() => creatorProfiles.id, { onDelete: "cascade" })
    .notNull(),
  recipientName: text("recipient_name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  province: text("province").notNull(),
  city: text("city").notNull(),
  district: text("district").notNull(),
  postalCode: text("postal_code").notNull(),
  streetAddress: text("street_address").notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const tiktokAccounts = pgTable("tiktok_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  creatorProfileId: uuid("creator_profile_id")
    .references(() => creatorProfiles.id, { onDelete: "cascade" })
    .notNull(),
  openId: text("open_id").unique().notNull(),
  unionId: text("union_id"),
  handle: text("handle").notNull(), // e.g. @banibanzl
  displayName: text("display_name").notNull(),
  avatarUrl: text("avatar_url"),
  followerCount: integer("follower_count").default(0).notNull(),
  likesCount: integer("likes_count").default(0).notNull(),
  videoCount: integer("video_count").default(0).notNull(),
  engagementRate: numeric("engagement_rate", { precision: 5, scale: 2 }).default("0.00"),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  tokenExpiresAt: timestamp("token_expires_at", { withTimezone: true }),
  isVerified: boolean("is_verified").default(false),
  lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ==========================================
// 2. CAMPAIGNS & SOW
// ==========================================
export const campaigns = pgTable("campaigns", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").unique().notNull(),
  brandName: text("brand_name").notNull(),
  brandLogoUrl: text("brand_logo_url"),
  bannerUrl: text("banner_url").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // Beauty, Tech, Food, etc.
  
  platformType: campaignPlatformTypeEnum("platform_type").default("TIKTOK_SHOP").notNull(),
  locationId: text("location_id"), // Tag Lokasi POI ID untuk TikTok Go
  locationName: text("location_name"), // Nama Outlet / Tempat / Hotel
  merchantName: text("merchant_name"),
  industryCategory: text("industry_category"), // Dining, Accommodations, Attractions, etc.
  benefitType: tiktokGoBenefitTypeEnum("benefit_type"), // VOUCHER_DIGITAL / OUTLET_PASS_LINK
  benefitData: text("benefit_data"), // URL gambar voucher / Kode voucher / Link Spreadsheet agensi
  
  commissionType: commissionTypeEnum("commission_type").default("COMMISSION_ONLY").notNull(),
  commissionRateText: text("commission_rate_text").notNull(), // e.g. "15% per penjualan"
  fixedFeeAmount: numeric("fixed_fee_amount", { precision: 12, scale: 2 }).default("0.00"),
  
  isFreeSample: boolean("is_free_sample").default(true).notNull(),
  sampleQuota: integer("sample_quota").default(100).notNull(),
  sampleStockRemaining: integer("sample_stock_remaining").default(100).notNull(),
  
  // Link keranjang kuning / TTAP Target link dari TikTok Shop Partner Center
  targetAffiliateLink: text("target_affiliate_link"),
  soundUrl: text("sound_url"),
  
  // SOW Checklist & Do's and Don'ts dalam format JSONB
  mandatoryHashtags: jsonb("mandatory_hashtags").$type<string[]>().default([]).notNull(),
  mandatoryMentions: jsonb("mandatory_mentions").$type<string[]>().default([]).notNull(),
  sowChecklist: jsonb("sow_checklist").$type<{ id: string; title: string; required: boolean }[]>().default([]).notNull(),
  dosAndDonts: jsonb("dos_and_donts").$type<{ type: "DO" | "DONT"; text: string }[]>().default([]).notNull(),
  
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }).notNull(),
  deadlineDaysAfterSample: integer("deadline_days_after_sample").default(7).notNull(), // wajib posting max 7 hari setelah sampel diterima
  
  status: campaignStatusEnum("status").default("ACTIVE").notNull(),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("campaign_status_idx").on(table.status),
  index("campaign_category_idx").on(table.category),
]);

// ==========================================
// 3. APPLICATIONS & LOGISTICS
// ==========================================
export const campaignApplications = pgTable("campaign_applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  campaignId: uuid("campaign_id")
    .references(() => campaigns.id, { onDelete: "cascade" })
    .notNull(),
  creatorProfileId: uuid("creator_profile_id")
    .references(() => creatorProfiles.id, { onDelete: "cascade" })
    .notNull(),
  tiktokAccountId: uuid("tiktok_account_id")
    .references(() => tiktokAccounts.id, { onDelete: "restrict" })
    .notNull(),
  status: applicationStatusEnum("status").default("PENDING_REVIEW").notNull(),
  rejectionReason: text("rejection_reason"),
  internalNotes: text("internal_notes"),
  
  // Snapshot alamat yang dipilih kreator saat mendaftar
  shippingAddressSnapshot: jsonb("shipping_address_snapshot").notNull(),
  
  appliedAt: timestamp("applied_at", { withTimezone: true }).defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  reviewedBy: uuid("reviewed_by").references(() => users.id),
}, (table) => [
  index("app_campaign_status_idx").on(table.campaignId, table.status),
  index("app_creator_idx").on(table.creatorProfileId),
]);

export const sampleShipments = pgTable("sample_shipments", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id")
    .references(() => campaignApplications.id, { onDelete: "cascade" })
    .notNull(),
  courierName: text("courier_name").notNull(), // J&T, SiCepat, JNE, etc.
  trackingNumber: text("tracking_number").notNull(),
  trackingStatus: shipmentStatusEnum("tracking_status").default("LABEL_CREATED").notNull(),
  trackingHistory: jsonb("tracking_history").$type<{ date: string; description: string; location: string }[]>().default([]),
  dispatchedAt: timestamp("dispatched_at", { withTimezone: true }),
  deliveredAt: timestamp("delivered_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ==========================================
// 4. TASKS & AUTO-DETECTION TRACKING
// ==========================================
export const campaignTasks = pgTable("campaign_tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id")
    .references(() => campaignApplications.id, { onDelete: "cascade" })
    .notNull(),
  taskStatus: taskStatusEnum("task_status").default("WAITING_SAMPLE").notNull(),
  
  // Data video TikTok yang terdeteksi otomatis
  detectedVideoId: text("detected_video_id"),
  videoUrl: text("video_url"),
  videoTitle: text("video_title"),
  videoCoverUrl: text("video_cover_url"),
  caption: text("caption"),
  detectedHashtags: jsonb("detected_hashtags").$type<string[]>().default([]),
  
  // Metrics performa konten
  viewsCount: integer("views_count").default(0).notNull(),
  likesCount: integer("likes_count").default(0).notNull(),
  commentsCount: integer("comments_count").default(0).notNull(),
  sharesCount: integer("shares_count").default(0).notNull(),
  postTime: timestamp("post_time", { withTimezone: true }),
  
  isBasketVerified: boolean("is_basket_verified").default(false), // Terdeteksi keranjang kuning aktif
  verificationNotes: text("verification_notes"),
  lastCheckedAt: timestamp("last_checked_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("task_status_idx").on(table.taskStatus),
  index("task_video_idx").on(table.detectedVideoId),
]);

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  entityType: text("entity_type").notNull(), // 'CAMPAIGN', 'APPLICATION', 'TASK', etc.
  entityId: uuid("entity_id").notNull(),
  action: text("action").notNull(), // 'APPROVED', 'REJECTED', 'VIDEO_DETECTED', 'DISPATCHED'
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ==========================================
// 6. RAW DATA INGESTION (VIDEO, LIVE, SALES)
// ==========================================
export const rawDataVideos = pgTable("raw_data_videos", {
  id: uuid("id").primaryKey().defaultRandom(),
  campaignId: uuid("campaign_id").references(() => campaigns.id, { onDelete: "set null" }),
  productId: text("product_id").notNull(), // TikTok Shop Product ID
  creatorUsername: text("creator_username").notNull(), // TikTok handle e.g. @banibanzl
  creatorOpenId: text("creator_open_id"),
  videoId: text("video_id").unique().notNull(),
  videoUrl: text("video_url").notNull(),
  caption: text("caption"),
  postTime: timestamp("post_time", { withTimezone: true }),
  durationSeconds: integer("duration_seconds").default(0),
  viewsCount: bigint("views_count", { mode: "number" }).default(0).notNull(),
  likesCount: integer("likes_count").default(0).notNull(),
  commentsCount: integer("comments_count").default(0).notNull(),
  sharesCount: integer("shares_count").default(0).notNull(),
  retentionRate: numeric("retention_rate", { precision: 5, scale: 2 }).default("0.00"),
  rawPayload: jsonb("raw_payload"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("raw_video_product_idx").on(table.productId),
  index("raw_video_creator_idx").on(table.creatorUsername),
  index("raw_video_campaign_idx").on(table.campaignId),
]);

export const rawDataLives = pgTable("raw_data_lives", {
  id: uuid("id").primaryKey().defaultRandom(),
  campaignId: uuid("campaign_id").references(() => campaigns.id, { onDelete: "set null" }),
  productId: text("product_id").notNull(), // TikTok Shop Product ID pinned during live
  creatorUsername: text("creator_username").notNull(), // TikTok handle
  liveRoomId: text("live_room_id").unique().notNull(),
  liveTitle: text("live_title"),
  startTime: timestamp("start_time", { withTimezone: true }).notNull(),
  endTime: timestamp("end_time", { withTimezone: true }),
  durationMinutes: integer("duration_minutes").default(0).notNull(),
  totalLiveViews: bigint("total_live_views", { mode: "number" }).default(0).notNull(),
  peakViewersPcu: integer("peak_viewers_pcu").default(0).notNull(),
  avgViewersAcu: integer("avg_viewers_acu").default(0).notNull(),
  totalComments: integer("total_comments").default(0).notNull(),
  totalShares: integer("total_shares").default(0).notNull(),
  totalProductClicks: integer("total_product_clicks").default(0).notNull(),
  rawPayload: jsonb("raw_payload"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("raw_live_product_idx").on(table.productId),
  index("raw_live_creator_idx").on(table.creatorUsername),
  index("raw_live_campaign_idx").on(table.campaignId),
]);

export const rawDataSales = pgTable("raw_data_sales", {
  id: uuid("id").primaryKey().defaultRandom(),
  campaignId: uuid("campaign_id").references(() => campaigns.id, { onDelete: "set null" }),
  productId: text("product_id").notNull(), // TikTok Shop Product ID
  skuId: text("sku_id"),
  productName: text("product_name").notNull(),
  creatorUsername: text("creator_username").notNull(), // TikTok handle
  orderId: text("order_id").notNull(),
  subOrderId: text("sub_order_id"),
  contentType: contentTypeEnum("content_type").default("VIDEO").notNull(),
  sourceId: text("source_id"), // video_id or live_room_id
  orderStatus: orderStatusEnum("order_status").default("PAID").notNull(),
  quantity: integer("quantity").default(1).notNull(),
  itemPrice: numeric("item_price", { precision: 15, scale: 2 }).notNull(),
  totalGmv: numeric("total_gmv", { precision: 15, scale: 2 }).notNull(),
  commissionRate: numeric("commission_rate", { precision: 5, scale: 2 }).notNull(),
  commissionAmount: numeric("commission_amount", { precision: 15, scale: 2 }).notNull(),
  settledCommission: numeric("settled_commission", { precision: 15, scale: 2 }).default("0.00"),
  orderCreatedTime: timestamp("order_created_time", { withTimezone: true }).notNull(),
  orderSettledTime: timestamp("order_settled_time", { withTimezone: true }),
  buyerRegion: text("buyer_region"),
  rawPayload: jsonb("raw_payload"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("raw_sales_product_idx").on(table.productId),
  index("raw_sales_creator_idx").on(table.creatorUsername),
  index("raw_sales_campaign_idx").on(table.campaignId),
  index("raw_sales_order_idx").on(table.orderId),
]);

// ==========================================
// RELATIONS
// ==========================================
export const usersRelations = relations(users, ({ one, many }) => ({
  creatorProfile: one(creatorProfiles, {
    fields: [users.id],
    references: [creatorProfiles.userId],
  }),
  auditLogs: many(auditLogs),
}));

export const creatorProfilesRelations = relations(creatorProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [creatorProfiles.userId],
    references: [users.id],
  }),
  tiktokAccounts: many(tiktokAccounts),
  shippingAddresses: many(shippingAddresses),
  applications: many(campaignApplications),
}));

export const tiktokAccountsRelations = relations(tiktokAccounts, ({ one, many }) => ({
  creatorProfile: one(creatorProfiles, {
    fields: [tiktokAccounts.creatorProfileId],
    references: [creatorProfiles.id],
  }),
  applications: many(campaignApplications),
}));

export const campaignsRelations = relations(campaigns, ({ many }) => ({
  applications: many(campaignApplications),
  rawDataVideos: many(rawDataVideos),
  rawDataLives: many(rawDataLives),
  rawDataSales: many(rawDataSales),
}));

export const rawDataVideosRelations = relations(rawDataVideos, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [rawDataVideos.campaignId],
    references: [campaigns.id],
  }),
}));

export const rawDataLivesRelations = relations(rawDataLives, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [rawDataLives.campaignId],
    references: [campaigns.id],
  }),
}));

export const rawDataSalesRelations = relations(rawDataSales, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [rawDataSales.campaignId],
    references: [campaigns.id],
  }),
}));

export const campaignApplicationsRelations = relations(campaignApplications, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [campaignApplications.campaignId],
    references: [campaigns.id],
  }),
  creatorProfile: one(creatorProfiles, {
    fields: [campaignApplications.creatorProfileId],
    references: [creatorProfiles.id],
  }),
  tiktokAccount: one(tiktokAccounts, {
    fields: [campaignApplications.tiktokAccountId],
    references: [tiktokAccounts.id],
  }),
  shipment: one(sampleShipments, {
    fields: [campaignApplications.id],
    references: [sampleShipments.applicationId],
  }),
  task: one(campaignTasks, {
    fields: [campaignApplications.id],
    references: [campaignTasks.applicationId],
  }),
}));

export const sampleShipmentsRelations = relations(sampleShipments, ({ one }) => ({
  application: one(campaignApplications, {
    fields: [sampleShipments.applicationId],
    references: [campaignApplications.id],
  }),
}));

export const campaignTasksRelations = relations(campaignTasks, ({ one }) => ({
  application: one(campaignApplications, {
    fields: [campaignTasks.applicationId],
    references: [campaignApplications.id],
  }),
}));
