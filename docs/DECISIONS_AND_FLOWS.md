# User Flows, Role Permissions, and Business Rules

## 1. Actor Persona & Roles

```mermaid
classDiagram
    class AdminInternal {
        +Create & Edit Campaign
        +Set SOW, Budget & Sample Stock
        +Approve / Reject Creator Application
        +Input Resi & Track Shipment
        +Monitor GMV & Video Performance
    }
    class PICOutreach {
        +Generate Campaign Shortlink
        +Share Link to Creator Groups/DM via WA
        +Follow up Creators
    }
    class ExternalCreator {
        +Register / Login via Web
        +Bind TikTok Account (OAuth)
        +Manage Shipping Address & Bank Account
        +Browse & Apply Campaign
        +Get Free Sample & Target Affiliate Link
        +Post Video (Auto-Detected)
    }
```

---

## 2. End-to-End Workflow Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Internal Admin / PIC
    actor Creator as TikTok Creator
    participant Web as KOL Web Platform
    participant TT_API as TikTok Developer API
    participant TTSP as TikTok Shop Partner Center

    Admin->>Web: 1. Setup Campaign Baru (SOW, Deadline, Link TTAP, Kuota Sampel)
    Admin->>Creator: 2. Broadcast/Chat link campaign via WhatsApp
    Creator->>Web: 3. Buka link web campaign
    Creator->>TT_API: 4. Login & Otorisasi Akun TikTok (OAuth 2.0)
    TT_API-->>Web: 5. Kembalikan open_id, handle, stats (followers, dll)
    Creator->>Web: 6. Lengkapi alamat kirim sampel & klik "Daftar Campaign"
    Web-->>Admin: 7. Masuk daftar "Menunggu Review"
    Admin->>Web: 8. Review profil kreator -> Klik "APPROVE"
    Admin->>Web: 9. Input nomor resi pengiriman sampel gratis
    Web-->>Creator: 10. Status Disetujui + No Resi Muncul + Tautan Target Affiliate TikTok
    Creator->>TTSP: 11. Accept Target Affiliate Link (Keranjang Kuning)
    Creator->>TikTok: 12. Rekam & Upload Video (pakai hashtag campaign & keranjang kuning)
    loop Auto-Detection Worker (Cron Job)
        Web->>TT_API: 13. Query recent videos via Display API / video.list
        TT_API-->>Web: 14. Ditemukan video dengan hashtag/sound campaign
        Web->>Web: 15. Update status tugas kreator jadi "SELESAI / LIVE"
    end
    Web-->>Admin: 16. Dashboard realtime: Video terdeteksi, views, like, status aktif
```

---

## 3. Database Schema Blueprint (Draft)

1. **`users`**: `id`, `email`, `phone_number`, `role` (ADMIN, PIC, CREATOR), `created_at`.
2. **`tiktok_accounts`**: `id`, `user_id`, `open_id`, `union_id`, `tiktok_handle`, `avatar_url`, `follower_count`, `access_token`, `refresh_token`, `token_expires_at`.
3. **`creator_profiles`**: `id`, `user_id`, `full_name`, `whatsapp_number`, `shipping_addresses` (JSON / Relasi), `bank_account_info` (JSON / Relasi).
4. **`campaigns`**: `id`, `title`, `brand_name`, `banner_image_url`, `commission_type` (COMMISSION_ONLY, FIXED_FEE, HYBRID), `commission_rate_text`, `is_free_sample`, `sample_quota`, `sample_stock_remaining`, `sow_brief_text`, `mandatory_hashtags`, `mandatory_mentions`, `sound_url`, `target_affiliate_link`, `start_date`, `end_date`, `status` (DRAFT, ACTIVE, PAUSED, COMPLETED).
5. **`campaign_applications`**: `id`, `campaign_id`, `creator_id`, `tiktok_account_id`, `status` (PENDING_REVIEW, APPROVED, REJECTED, CANCELLED), `rejection_reason`, `shipping_address_snapshot`, `tracking_number`, `courier_name`, `applied_at`, `reviewed_at`, `reviewed_by`.
6. **`campaign_tasks`**: `id`, `application_id`, `detected_video_id`, `video_url`, `video_title`, `caption`, `views_count`, `likes_count`, `comments_count`, `post_time`, `task_status` (WAITING_SAMPLE, WAITING_POST, DETECTED_ACTIVE, REMOVED_OR_PRIVATE), `last_synced_at`.
