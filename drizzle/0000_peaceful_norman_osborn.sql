CREATE TYPE "public"."application_status" AS ENUM('PENDING_REVIEW', 'APPROVED', 'REJECTED', 'WAITLISTED');--> statement-breakpoint
CREATE TYPE "public"."campaign_status" AS ENUM('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."commission_type" AS ENUM('COMMISSION_ONLY', 'FIXED_FEE', 'HYBRID');--> statement-breakpoint
CREATE TYPE "public"."creator_tier" AS ENUM('TIER_1', 'TIER_2', 'TIER_3', 'TIER_4', 'TIER_5');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('ADMIN', 'PIC', 'CREATOR', 'BRAND');--> statement-breakpoint
CREATE TYPE "public"."shipment_status" AS ENUM('LABEL_CREATED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'RETURNED');--> statement-breakpoint
CREATE TYPE "public"."task_status" AS ENUM('WAITING_SAMPLE', 'SAMPLE_DELIVERED', 'WAITING_POST', 'DETECTED_ACTIVE', 'VERIFIED_COMPLETE', 'FLAGGED_OR_REMOVED');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"action" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaign_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid NOT NULL,
	"creator_profile_id" uuid NOT NULL,
	"tiktok_account_id" uuid NOT NULL,
	"status" "application_status" DEFAULT 'PENDING_REVIEW' NOT NULL,
	"rejection_reason" text,
	"internal_notes" text,
	"shipping_address_snapshot" jsonb NOT NULL,
	"applied_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reviewed_at" timestamp with time zone,
	"reviewed_by" uuid
);
--> statement-breakpoint
CREATE TABLE "campaign_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
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
--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"brand_name" text NOT NULL,
	"brand_logo_url" text,
	"banner_url" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
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
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone NOT NULL,
	"deadline_days_after_sample" integer DEFAULT 7 NOT NULL,
	"status" "campaign_status" DEFAULT 'ACTIVE' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "campaigns_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "creator_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
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
--> statement-breakpoint
CREATE TABLE "sample_shipments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"courier_name" text NOT NULL,
	"tracking_number" text NOT NULL,
	"tracking_status" "shipment_status" DEFAULT 'LABEL_CREATED' NOT NULL,
	"tracking_history" jsonb DEFAULT '[]'::jsonb,
	"dispatched_at" timestamp with time zone,
	"delivered_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shipping_addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creator_profile_id" uuid NOT NULL,
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
--> statement-breakpoint
CREATE TABLE "tiktok_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creator_profile_id" uuid NOT NULL,
	"open_id" text NOT NULL,
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
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tiktok_accounts_open_id_unique" UNIQUE("open_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"phone_number" text,
	"role" "user_role" DEFAULT 'CREATOR' NOT NULL,
	"password_hash" text,
	"avatar_url" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_applications" ADD CONSTRAINT "campaign_applications_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_applications" ADD CONSTRAINT "campaign_applications_creator_profile_id_creator_profiles_id_fk" FOREIGN KEY ("creator_profile_id") REFERENCES "public"."creator_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_applications" ADD CONSTRAINT "campaign_applications_tiktok_account_id_tiktok_accounts_id_fk" FOREIGN KEY ("tiktok_account_id") REFERENCES "public"."tiktok_accounts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_applications" ADD CONSTRAINT "campaign_applications_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_tasks" ADD CONSTRAINT "campaign_tasks_application_id_campaign_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."campaign_applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creator_profiles" ADD CONSTRAINT "creator_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sample_shipments" ADD CONSTRAINT "sample_shipments_application_id_campaign_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."campaign_applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipping_addresses" ADD CONSTRAINT "shipping_addresses_creator_profile_id_creator_profiles_id_fk" FOREIGN KEY ("creator_profile_id") REFERENCES "public"."creator_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tiktok_accounts" ADD CONSTRAINT "tiktok_accounts_creator_profile_id_creator_profiles_id_fk" FOREIGN KEY ("creator_profile_id") REFERENCES "public"."creator_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "app_campaign_status_idx" ON "campaign_applications" USING btree ("campaign_id","status");--> statement-breakpoint
CREATE INDEX "app_creator_idx" ON "campaign_applications" USING btree ("creator_profile_id");--> statement-breakpoint
CREATE INDEX "task_status_idx" ON "campaign_tasks" USING btree ("task_status");--> statement-breakpoint
CREATE INDEX "task_video_idx" ON "campaign_tasks" USING btree ("detected_video_id");--> statement-breakpoint
CREATE INDEX "campaign_status_idx" ON "campaigns" USING btree ("status");--> statement-breakpoint
CREATE INDEX "campaign_category_idx" ON "campaigns" USING btree ("category");