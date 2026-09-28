import { pool } from "./index";

let hasMigrated = false;

export async function ensureDbColumns() {
  if (hasMigrated) return;

  try {
    const client = await pool.connect();
    try {
      // Safe non-blocking column additions
      await client.query(`
        ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "product_id" text;
        ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "tiktok_campaign_id" text;
        ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "sale_price" text;
        ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "shop_name" text;
        ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "product_skus" jsonb DEFAULT '[]'::jsonb;
        ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "brief" text;
        ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "campaign_variants" jsonb DEFAULT '[]'::jsonb;
        
        ALTER TABLE "campaign_applications" ADD COLUMN IF NOT EXISTS "applicant_name" text;
        ALTER TABLE "campaign_applications" ADD COLUMN IF NOT EXISTS "applicant_whatsapp" text;
        ALTER TABLE "campaign_applications" ADD COLUMN IF NOT EXISTS "applicant_tiktok_handle" text;
        ALTER TABLE "campaign_applications" ADD COLUMN IF NOT EXISTS "applicant_follower_count" text;
        ALTER TABLE "campaign_applications" ADD COLUMN IF NOT EXISTS "is_guest_apply" boolean DEFAULT false;
        
        ALTER TABLE "campaign_applications" ALTER COLUMN "creator_profile_id" DROP NOT NULL;
        ALTER TABLE "campaign_applications" ALTER COLUMN "tiktok_account_id" DROP NOT NULL;
        ALTER TABLE "campaign_applications" ALTER COLUMN "shipping_address_snapshot" DROP NOT NULL;
      `);
      hasMigrated = true;
    } catch (e) {
      console.warn("ensureDbColumns notice:", e);
    } finally {
      client.release();
    }
  } catch (err) {
    console.warn("Could not connect to pool for ensureDbColumns:", err);
  }
}
