import { NextResponse } from "next/server";
import { Pool } from "pg";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/kol_system";

export async function GET() {
  const pool = new Pool({ connectionString });
  const client = await pool.connect();

  try {
    // 1. Create Enums if not exist
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "public"."application_status" AS ENUM('PENDING_REVIEW', 'APPROVED', 'REJECTED', 'WAITLISTED');
      EXCEPTION WHEN duplicate_object THEN null; END $$;

      DO $$ BEGIN
        CREATE TYPE "public"."campaign_status" AS ENUM('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED');
      EXCEPTION WHEN duplicate_object THEN null; END $$;

      DO $$ BEGIN
        CREATE TYPE "public"."commission_type" AS ENUM('COMMISSION_ONLY', 'FIXED_FEE', 'HYBRID');
      EXCEPTION WHEN duplicate_object THEN null; END $$;

      DO $$ BEGIN
        CREATE TYPE "public"."creator_tier" AS ENUM('TIER_1', 'TIER_2', 'TIER_3', 'TIER_4', 'TIER_5');
      EXCEPTION WHEN duplicate_object THEN null; END $$;

      DO $$ BEGIN
        CREATE TYPE "public"."user_role" AS ENUM('ADMIN', 'PIC', 'CREATOR', 'BRAND');
      EXCEPTION WHEN duplicate_object THEN null; END $$;

      DO $$ BEGIN
        CREATE TYPE "public"."shipment_status" AS ENUM('LABEL_CREATED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'RETURNED');
      EXCEPTION WHEN duplicate_object THEN null; END $$;

      DO $$ BEGIN
        CREATE TYPE "public"."task_status" AS ENUM('WAITING_SAMPLE', 'SAMPLE_DELIVERED', 'WAITING_POST', 'DETECTED_ACTIVE', 'VERIFIED_COMPLETE', 'FLAGGED_OR_REMOVED');
      EXCEPTION WHEN duplicate_object THEN null; END $$;

      DO $$ BEGIN
        CREATE TYPE "public"."campaign_platform_type" AS ENUM('TIKTOK_SHOP', 'TIKTOK_GO');
      EXCEPTION WHEN duplicate_object THEN null; END $$;

      DO $$ BEGIN
        CREATE TYPE "public"."content_type" AS ENUM('VIDEO', 'LIVE', 'SHOWCASE');
      EXCEPTION WHEN duplicate_object THEN null; END $$;

      DO $$ BEGIN
        CREATE TYPE "public"."order_status" AS ENUM('AWAITING_PAYMENT', 'PAID', 'IN_TRANSIT', 'DELIVERED', 'SETTLED', 'CANCELLED', 'REFUNDED');
      EXCEPTION WHEN duplicate_object THEN null; END $$;

      DO $$ BEGIN
        CREATE TYPE "public"."tiktok_go_benefit_type" AS ENUM('VOUCHER_DIGITAL', 'OUTLET_PASS_LINK');
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);

    // 2. Create Tables if not exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "email" text NOT NULL UNIQUE,
        "phone_number" text UNIQUE,
        "role" "user_role" DEFAULT 'CREATOR' NOT NULL,
        "password_hash" text,
        "avatar_url" text,
        "is_active" boolean DEFAULT true NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS "creator_profiles" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
        "full_name" text NOT NULL,
        "whatsapp_number" text NOT NULL,
        "bio" text,
        "tier" "creator_tier" DEFAULT 'TIER_1' NOT NULL,
        "niche" text,
        "completion_rate" numeric(5, 2) DEFAULT '100.00',
        "bank_name" text,
        "bank_account_number" text,
        "bank_account_holder" text,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS "shipping_addresses" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "creator_profile_id" uuid NOT NULL REFERENCES "creator_profiles"("id") ON DELETE cascade,
        "recipient_name" text NOT NULL,
        "phone_number" text NOT NULL,
        "province" text NOT NULL,
        "city" text NOT NULL,
        "district" text NOT NULL,
        "postal_code" text NOT NULL,
        "street_address" text NOT NULL,
        "is_default" boolean DEFAULT false NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS "tiktok_accounts" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "creator_profile_id" uuid NOT NULL REFERENCES "creator_profiles"("id") ON DELETE cascade,
        "open_id" text NOT NULL UNIQUE,
        "union_id" text,
        "handle" text NOT NULL,
        "display_name" text NOT NULL,
        "avatar_url" text,
        "follower_count" integer DEFAULT 0 NOT NULL,
        "likes_count" integer DEFAULT 0 NOT NULL,
        "video_count" integer DEFAULT 0 NOT NULL,
        "engagement_rate" numeric(5, 2) DEFAULT '0.00',
        "access_token" text,
        "refresh_token" text,
        "token_expires_at" timestamp with time zone,
        "is_verified" boolean DEFAULT false,
        "last_synced_at" timestamp with time zone,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS "campaigns" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "title" text NOT NULL,
        "slug" text NOT NULL UNIQUE,
        "brand_name" text NOT NULL,
        "brand_logo_url" text,
        "banner_url" text NOT NULL,
        "description" text NOT NULL,
        "category" text NOT NULL,
        "platform_type" "campaign_platform_type" DEFAULT 'TIKTOK_SHOP' NOT NULL,
        "location_id" text,
        "location_name" text,
        "merchant_name" text,
        "industry_category" text,
        "benefit_type" "tiktok_go_benefit_type",
        "benefit_data" text,
        "commission_type" "commission_type" DEFAULT 'COMMISSION_ONLY' NOT NULL,
        "commission_rate_text" text NOT NULL,
        "fixed_fee_amount" numeric(12, 2) DEFAULT '0.00',
        "is_free_sample" boolean DEFAULT true NOT NULL,
        "sample_quota" integer DEFAULT 100 NOT NULL,
        "sample_stock_remaining" integer DEFAULT 100 NOT NULL,
        "target_affiliate_link" text,
        "sound_url" text,
        "mandatory_hashtags" jsonb DEFAULT '[]'::jsonb NOT NULL,
        "mandatory_mentions" jsonb DEFAULT '[]'::jsonb NOT NULL,
        "sow_checklist" jsonb DEFAULT '[]'::jsonb NOT NULL,
        "dos_and_donts" jsonb DEFAULT '[]'::jsonb NOT NULL,
        "start_date" timestamp with time zone DEFAULT now() NOT NULL,
        "end_date" timestamp with time zone DEFAULT (now() + interval '30 days') NOT NULL,
        "deadline_days_after_sample" integer DEFAULT 7 NOT NULL,
        "status" "campaign_status" DEFAULT 'ACTIVE' NOT NULL,
        "created_by" uuid REFERENCES "users"("id") ON DELETE no action,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS "campaign_applications" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "campaign_id" uuid NOT NULL REFERENCES "campaigns"("id") ON DELETE cascade,
        "creator_profile_id" uuid NOT NULL REFERENCES "creator_profiles"("id") ON DELETE cascade,
        "tiktok_account_id" uuid NOT NULL REFERENCES "tiktok_accounts"("id") ON DELETE restrict,
        "status" "application_status" DEFAULT 'PENDING_REVIEW' NOT NULL,
        "rejection_reason" text,
        "internal_notes" text,
        "shipping_address_snapshot" jsonb NOT NULL,
        "applied_at" timestamp with time zone DEFAULT now() NOT NULL,
        "reviewed_at" timestamp with time zone,
        "reviewed_by" uuid REFERENCES "users"("id") ON DELETE no action
      );

      CREATE TABLE IF NOT EXISTS "campaign_tasks" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "application_id" uuid NOT NULL REFERENCES "campaign_applications"("id") ON DELETE cascade,
        "task_status" "task_status" DEFAULT 'WAITING_SAMPLE' NOT NULL,
        "detected_video_id" text,
        "video_url" text,
        "video_title" text,
        "video_cover_url" text,
        "caption" text,
        "detected_hashtags" jsonb DEFAULT '[]'::jsonb,
        "views_count" integer DEFAULT 0 NOT NULL,
        "likes_count" integer DEFAULT 0 NOT NULL,
        "comments_count" integer DEFAULT 0 NOT NULL,
        "shares_count" integer DEFAULT 0 NOT NULL,
        "post_time" timestamp with time zone,
        "is_basket_verified" boolean DEFAULT false,
        "verification_notes" text,
        "last_checked_at" timestamp with time zone,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS "sample_shipments" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "application_id" uuid NOT NULL REFERENCES "campaign_applications"("id") ON DELETE cascade,
        "courier_name" text NOT NULL,
        "tracking_number" text NOT NULL,
        "tracking_status" "shipment_status" DEFAULT 'LABEL_CREATED' NOT NULL,
        "tracking_history" jsonb DEFAULT '[]'::jsonb,
        "dispatched_at" timestamp with time zone,
        "delivered_at" timestamp with time zone,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS "audit_logs" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid REFERENCES "users"("id"),
        "entity_type" text NOT NULL,
        "entity_id" uuid NOT NULL,
        "action" text NOT NULL,
        "metadata" jsonb,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS "raw_data_videos" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "campaign_id" uuid REFERENCES "campaigns"("id") ON DELETE set null,
        "product_id" text NOT NULL,
        "creator_username" text NOT NULL,
        "creator_open_id" text,
        "video_id" text NOT NULL UNIQUE,
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
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS "raw_data_lives" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "campaign_id" uuid REFERENCES "campaigns"("id") ON DELETE set null,
        "product_id" text NOT NULL,
        "creator_username" text NOT NULL,
        "live_room_id" text NOT NULL UNIQUE,
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
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS "raw_data_sales" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "campaign_id" uuid REFERENCES "campaigns"("id") ON DELETE set null,
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

      -- Safe column additions for campaigns table
      ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "product_id" text;
      ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "tiktok_campaign_id" text;
      ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "sale_price" text;
      ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "shop_name" text;
      ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "product_skus" jsonb DEFAULT '[]'::jsonb;

      -- Safe column additions for campaign_applications (simple apply by non-registered creators)
      ALTER TABLE "campaign_applications" ADD COLUMN IF NOT EXISTS "applicant_name" text;
      ALTER TABLE "campaign_applications" ADD COLUMN IF NOT EXISTS "applicant_whatsapp" text;
      ALTER TABLE "campaign_applications" ADD COLUMN IF NOT EXISTS "applicant_tiktok_handle" text;
      ALTER TABLE "campaign_applications" ADD COLUMN IF NOT EXISTS "applicant_follower_count" text;
      ALTER TABLE "campaign_applications" ADD COLUMN IF NOT EXISTS "is_guest_apply" boolean DEFAULT false;

      -- Make creator_profile_id and tiktok_account_id nullable for guest applications
      ALTER TABLE "campaign_applications" ALTER COLUMN "creator_profile_id" DROP NOT NULL;
      ALTER TABLE "campaign_applications" ALTER COLUMN "tiktok_account_id" DROP NOT NULL;
      ALTER TABLE "campaign_applications" ALTER COLUMN "shipping_address_snapshot" DROP NOT NULL;
    `);

    // 3. Query all table names in public schema to confirm
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    return NextResponse.json({
      status: "success",
      message: "Database tables and enums initialized successfully!",
      tables: tablesRes.rows.map((r) => r.table_name),
    });
  } catch (error: any) {
    console.error("Database initialization error:", error);
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
