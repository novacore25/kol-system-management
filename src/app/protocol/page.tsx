import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, FileText, ArrowLeft } from "lucide-react";

export default function ProtocolPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>
        <span className="text-[11px] text-slate-400">Terakhir diperbarui: 15 September 2026</span>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl p-8 shadow-sm space-y-8">
        <div className="border-b border-slate-100 pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold border border-indigo-200">
            <ShieldCheck className="w-4 h-4" />
            <span>Transparansi & Keamanan Data</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Kebijakan Privasi & Ketentuan Layanan
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Dokumen ini menjelaskan bagaimana platform mengumpulkan, menggunakan, menyimpan, dan melindungi data pribadi Anda saat menggunakan layanan agensi afiliasi TikTok Shop.
          </p>
        </div>

        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            1. Informasi yang Kami Kumpulkan
          </h2>
          <div className="text-xs text-slate-600 space-y-2 leading-relaxed pl-6">
            <p>Untuk memfasilitasi program afiliasi brand, pengiriman sampel gratis, dan pencairan komisi, kami mengumpulkan data berikut:</p>
            <ul className="list-disc space-y-1 pl-4">
              <li><strong>Informasi Identitas:</strong> Nama lengkap, tanggal lahir (verifikasi usia 18+), dan alamat email.</li>
              <li><strong>Kontak & Koordinasi:</strong> Nomor WhatsApp aktif untuk komunikasi timbal-balik, konfirmasi resi kurir, dan briefing campaign.</li>
              <li><strong>Alamat Pengiriman Sampel:</strong> Nama penerima, nomor telepon, provinsi, kota/kabupaten, kecamatan, kelurahan, kode pos, dan alamat jalan lengkap.</li>
              <li><strong>Informasi Rekening Bank:</strong> Nama bank, nomor rekening, dan nama pemilik rekening untuk distribusi pembayaran komisi dan fee kerja sama.</li>
              <li><strong>Data Akun Media Sosial:</strong> Akun TikTok yang Anda tautkan (username, ID kreator, foto profil, metrik follower, dan data publikasi video terkait campaign).</li>
            </ul>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-600" />
            2. Penggunaan API TikTok & Kepatuhan Pengembang
          </h2>
          <div className="text-xs text-slate-600 space-y-2 leading-relaxed pl-6">
            <p>Aplikasi ini beroperasi mematuhi TikTok Developer Terms of Service & Privacy Policy:</p>
            <ul className="list-disc space-y-1 pl-4">
              <li>Kami hanya mengakses data yang telah Anda setujui secara eksplisit melalui layar otorisasi TikTok OAuth resmi.</li>
              <li>Kami tidak pernah meminta atau menyimpan kata sandi (password) akun TikTok Anda.</li>
              <li>Data postingan video dan hashtag diakses secara aman untuk memverifikasi pemenuhan Scope of Work (SOW) campaign secara otomatis tanpa memerlukan pengiriman tautan manual.</li>
              <li>Anda berhak mencabut akses tautan TikTok kapan saja melalui menu Profil akun Anda atau melalui pengaturan keamanan TikTok Anda.</li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            3. Pengiriman Sampel & Kewajiban Kreator (MOU SOW)
          </h2>
          <div className="text-xs text-slate-600 space-y-2 leading-relaxed pl-6">
            <p>Dengan mendaftar pada campaign berstatus &quot;Sampel Gratis&quot;:</p>
            <ul className="list-disc space-y-1 pl-4">
              <li>Kreator berkewajiban mengunggah konten video sesuai instruksi SOW, hashtag wajib, dan menyematkan link keranjang kuning resmi dalam tenggat waktu yang ditentukan setelah paket sampel diterima.</li>
              <li>Sampel produk yang dikirimkan tidak diperbolehkan untuk diperjualbelikan kembali secara langsung.</li>
              <li>Nomor resi pengiriman kurir (J&amp;T, SiCepat, JNE, SPX) akan disediakan transparan pada halaman detail tugas kreator.</li>
            </ul>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            4. Keamanan & Penghapusan Data
          </h2>
          <div className="text-xs text-slate-600 space-y-2 leading-relaxed pl-6">
            <p>
              Data pribadi dan rekening perbankan Anda dienkripsi dengan standar industri. Kami tidak menjual data pengguna kepada pihak ketiga yang tidak berwenang. Jika Anda ingin meminta penghapusan permanen atas seluruh akun dan data Anda, Anda dapat menghubungi tim operasional agensi melalui tombol &quot;Butuh Bantuan&quot; di profil Anda.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
