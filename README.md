# Creavy - *Let's grow together* 🚀

Platform manajemen kreator dan afiliasi TikTok yang dirancang dengan pendekatan modern, simpel, dan fungsional berbasis prinsip ATM (*Amati, Tiru, Modifikasi*).

---

## 📱 Panduan Review UI (Fitur & Halaman)

Aplikasi saat ini telah disiapkan dengan data interaktif (mock data) sehingga tim dapat langsung meninjau seluruh alur tampilan (UI/UX) tanpa perlu konfigurasi database awal:

### 1. Portal Kreator
- **Beranda & Katalog Campaign (/)**:
  - Filter modal pop-up kategori & kuota sampel (solid white, non-transparent, centered).
  - Kartu campaign interaktif dengan kuota tersisa & batas pendaftaran.
  - Modal Rincian SOW & Modal 3-Langkah Pendaftaran Sampel Gratis.
- **Campaign Saya (/my-tasks) & Detail Campaign (/my-tasks/[id])**:
  - Pelacakan resi ekspedisi kurir (J&T, SiCepat) dengan fitur **1-Klik Salin Resi** dan tombol **Lacak di Web Kurir** langsung ke tracking resmi ekspedisi.
  - Alur auto-detection video live TikTok via hashtag wajib.
- **Komisi Saya (/earnings)**:
  - KPI finansial kreator: Komisi bulan ini, GMV penjualan produk keranjang kuning, dan riwayat payout mingguan agensi.
  - Banner rekening bank penerima transfer.
- **Profil Kreator (/profile)**:
  - Status **Creavy Creator Level & Performa** (Rising -> Pro -> Star).
  - Input alamat baru dengan integrasi dropdown bertingkat **API Wilayah Indonesia** (Provinsi -> Kabupaten/Kota -> Kecamatan -> Kelurahan).
  - Manajemen multi-rekening bank & alamat pengiriman.
  - Modal Pusat Bantuan & kontak WhatsApp tim support agensi.

### 2. Panel Admin Agensi
- **Dashboard Admin (/admin)**: Ringkasan performa kampanye dan metrik kreator.
- **Review Pendaftaran (/admin/applications)**: Modal persetujuan & penolakan pendaftaran sampel kreator.
- **Logistik Sampel (/admin/logistics)**: Modal input nomor resi kurir & monitoring pengiriman sampel.

---

## 🛠️ Cara Menjalankan Secara Lokal

`ash
# 1. Clone repository
git clone https://github.com/novacore25/kol-system-management.git
cd kol-system-management

# 2. Install dependencies
npm install

# 3. Jalankan development server
npm run dev
`

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 💻 Tech Stack
- **Framework**: Next.js 15 (App Router) + React 19
- **UI Components**: HeroUI + Tailwind CSS v3
- **Icons**: Lucide React
- **ORM & Database Prep**: Drizzle ORM + PostgreSQL
