import { pool } from "./index";

let hasMigrated = false;

export async function ensureDbColumns() {
  if (hasMigrated) return;

  try {
    const client = await pool.connect();
    try {
      // 1. campaigns columns
      await client.query(`ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "product_id" text;`).catch(() => null);
      await client.query(`ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "tiktok_campaign_id" text;`).catch(() => null);
      await client.query(`ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "sale_price" text;`).catch(() => null);
      await client.query(`ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "shop_name" text;`).catch(() => null);
      await client.query(`ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "product_skus" jsonb DEFAULT '[]'::jsonb;`).catch(() => null);
      await client.query(`ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "brief" text;`).catch(() => null);
      await client.query(`ALTER TABLE "campaigns" ADD COLUMN IF NOT EXISTS "campaign_variants" jsonb DEFAULT '[]'::jsonb;`).catch(() => null);

      // 2. campaign_applications columns
      await client.query(`ALTER TABLE "campaign_applications" ADD COLUMN IF NOT EXISTS "applicant_name" text;`).catch(() => null);
      await client.query(`ALTER TABLE "campaign_applications" ADD COLUMN IF NOT EXISTS "applicant_whatsapp" text;`).catch(() => null);
      await client.query(`ALTER TABLE "campaign_applications" ADD COLUMN IF NOT EXISTS "applicant_tiktok_handle" text;`).catch(() => null);
      await client.query(`ALTER TABLE "campaign_applications" ADD COLUMN IF NOT EXISTS "applicant_follower_count" text;`).catch(() => null);
      await client.query(`ALTER TABLE "campaign_applications" ADD COLUMN IF NOT EXISTS "is_guest_apply" boolean DEFAULT false;`).catch(() => null);

      // 3. Nullable constraints
      await client.query(`ALTER TABLE "campaign_applications" ALTER COLUMN "creator_profile_id" DROP NOT NULL;`).catch(() => null);
      await client.query(`ALTER TABLE "campaign_applications" ALTER COLUMN "tiktok_account_id" DROP NOT NULL;`).catch(() => null);
      await client.query(`ALTER TABLE "campaign_applications" ALTER COLUMN "shipping_address_snapshot" DROP NOT NULL;`).catch(() => null);

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
