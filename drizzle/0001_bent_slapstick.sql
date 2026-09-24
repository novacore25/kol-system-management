CREATE TYPE "public"."campaign_platform_type" AS ENUM('TIKTOK_SHOP', 'TIKTOK_GO');--> statement-breakpoint
CREATE TYPE "public"."content_type" AS ENUM('VIDEO', 'LIVE', 'SHOWCASE');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('AWAITING_PAYMENT', 'PAID', 'IN_TRANSIT', 'DELIVERED', 'SETTLED', 'CANCELLED', 'REFUNDED');--> statement-breakpoint
CREATE TYPE "public"."tiktok_go_benefit_type" AS ENUM('VOUCHER_DIGITAL', 'OUTLET_PASS_LINK');--> statement-breakpoint
CREATE TABLE "raw_data_lives" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid,
	"product_id" text NOT NULL,
	"creator_username" text NOT NULL,
	"live_room_id" text NOT NULL,
	"live_title" text,
	"start_time" timestamp with time zone NOT NULL,
	"end_time" timestamp with time zone,
	"duration_minutes" integer DEFAULT 0 NOT NULL,
	"total_live_views" bigint DEFAULT 0 NOT NULL,
	"peak_viewers_pcu" integer DEFAULT 0 NOT NULL,
	"avg_viewers_acu" integer DEFAULT 0 NOT NULL,
	"total_comments" integer DEFAULT 0 NOT NULL,
	"total_shares" integer DEFAULT 0 NOT NULL,
	"total_product_clicks" integer DEFAULT 0 NOT NULL,
	"raw_payload" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "raw_data_lives_live_room_id_unique" UNIQUE("live_room_id")
);
--> statement-breakpoint
CREATE TABLE "raw_data_sales" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid,
	"product_id" text NOT NULL,
	"sku_id" text,
	"product_name" text NOT NULL,
	"creator_username" text NOT NULL,
	"order_id" text NOT NULL,
	"sub_order_id" text,
	"content_type" "content_type" DEFAULT 'VIDEO' NOT NULL,
	"source_id" text,
	"order_status" "order_status" DEFAULT 'PAID' NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"item_price" numeric(15, 2) NOT NULL,
	"total_gmv" numeric(15, 2) NOT NULL,
	"commission_rate" numeric(5, 2) NOT NULL,
	"commission_amount" numeric(15, 2) NOT NULL,
	"settled_commission" numeric(15, 2) DEFAULT '0.00',
	"order_created_time" timestamp with time zone NOT NULL,
	"order_settled_time" timestamp with time zone,
	"buyer_region" text,
	"raw_payload" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "raw_data_videos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid,
	"product_id" text NOT NULL,
	"creator_username" text NOT NULL,
	"creator_open_id" text,
	"video_id" text NOT NULL,
	"video_url" text NOT NULL,
	"caption" text,
	"post_time" timestamp with time zone,
	"duration_seconds" integer DEFAULT 0,
	"views_count" bigint DEFAULT 0 NOT NULL,
	"likes_count" integer DEFAULT 0 NOT NULL,
	"comments_count" integer DEFAULT 0 NOT NULL,
	"shares_count" integer DEFAULT 0 NOT NULL,
	"retention_rate" numeric(5, 2) DEFAULT '0.00',
	"raw_payload" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "raw_data_videos_video_id_unique" UNIQUE("video_id")
);
--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "platform_type" "campaign_platform_type" DEFAULT 'TIKTOK_SHOP' NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "location_id" text;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "location_name" text;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "merchant_name" text;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "industry_category" text;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "benefit_type" "tiktok_go_benefit_type";--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "benefit_data" text;--> statement-breakpoint
ALTER TABLE "raw_data_lives" ADD CONSTRAINT "raw_data_lives_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "raw_data_sales" ADD CONSTRAINT "raw_data_sales_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "raw_data_videos" ADD CONSTRAINT "raw_data_videos_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "raw_live_product_idx" ON "raw_data_lives" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "raw_live_creator_idx" ON "raw_data_lives" USING btree ("creator_username");--> statement-breakpoint
CREATE INDEX "raw_live_campaign_idx" ON "raw_data_lives" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX "raw_sales_product_idx" ON "raw_data_sales" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "raw_sales_creator_idx" ON "raw_data_sales" USING btree ("creator_username");--> statement-breakpoint
CREATE INDEX "raw_sales_campaign_idx" ON "raw_data_sales" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX "raw_sales_order_idx" ON "raw_data_sales" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "raw_video_product_idx" ON "raw_data_videos" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "raw_video_creator_idx" ON "raw_data_videos" USING btree ("creator_username");--> statement-breakpoint
CREATE INDEX "raw_video_campaign_idx" ON "raw_data_videos" USING btree ("campaign_id");