# Tech Stack, Database, UI Engine, and SEO Architecture

## 1. Core Stack Overview

| Layer | Technology | Alasan & Keunggulan |
| :--- | :--- | :--- |
| **Framework** | **Next.js 15+ (App Router)** | Full-stack TypeScript, SSR/SSG untuk SEO maksimal, Dynamic OpenGraph image preview di WhatsApp. |
| **Database** | **PostgreSQL 16** | ACID transaksional untuk kuota sampel & pendaftaran, native `JSONB` untuk data TikTok API. |
| **ORM** | **Drizzle ORM** | Zero Rust overhead, hemat RAM di VPS Coolify, eksekusi query super cepat, native JSONB support. |
| **UI Engine** | **HeroUI (NextUI) + Shadcn/ui + Tremor** | Desain modern out-of-the-box, mobile-friendly untuk kreator, dan data-rich untuk dashboard admin. |
| **Queue / Worker** | **Redis + BullMQ** | Background cron worker untuk auto-detection video postingan TikTok tanpa lag di server web. |
| **Deployment** | **Coolify on VPS** | 1-Click deploy, auto SSL Let's Encrypt, auto-backup database ke cloud storage. |

---

## 2. Pilihan UI Engine: Perbandingan & Kombinasi Terbaik

| UI Engine | Keunggulan Utama | Bagian Paling Cocok |
| :--- | :--- | :--- |
| **HeroUI (NextUI)** 🌟 | Desain modern berkelas, animasi *smooth* bawaan (ripple, hover, modal slide), komponen siap pakai tanpa setup rumit. | **Portal Kreator (Mobile & Web)**: Katalog campaign, tab SOW, form apply sampel. |
| **Shadcn/ui** | Fleksibilitas 100% tanpa vendor lock-in, komponen headless berbasis Radix UI, sangat ringan. | **Custom Layout & Form**: Input alamat berjenjang (Provinsi $\rightarrow$ Kota $\rightarrow$ Kecamatan), filter drawer. |
| **Tremor (Tailwind)** 📊 | Komponen chart & metrik siap pakai (GMV bar, line chart views, stat cards, progress bar kuota). | **Dashboard Internal Admin**: Analitik performa campaign, GMV penjualan TikTok Shop, ranking kreator. |
| **Framer Motion / Motion** | Animasi micro-interactions (buka card campaign, status chip berganti). | Meningkatkan UX interaktif seperti aplikasi native mobile. |

---

## 3. SEO & Link Sharing Architecture

- **Dynamic OpenGraph (`@vercel/og`)**: Link WhatsApp campaign otomatis menampilkan banner produk, status sampel gratis, dan badge komisi.
- **Server-Side Rendering (SSR)**: Googlebot menerima HTML lengkap berisi katalog campaign dan brand partner.
- **Dynamic XML Sitemap (`app/sitemap.ts`)**: Auto-update saat ada campaign baru dibuka.
