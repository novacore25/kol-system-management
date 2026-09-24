"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import {
  Copy,
  Gift,
  ExternalLink,
  ShoppingBag,
  Clock,
  Sparkles,
  CheckCircle2,
  User,
  MapPin,
  FileCheck,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

export interface CampaignData {
  id: string;
  title: string;
  brandName: string;
  category: string;
  bannerUrl: string;
  platformType?: "TIKTOK_SHOP" | "TIKTOK_GO";
  locationName?: string;
  locationId?: string;
  industryCategory?: string;
  benefitType?: "VOUCHER_DIGITAL" | "OUTLET_PASS_LINK";
  benefitData?: string;
  outletAddress?: string;
  commissionType: "COMMISSION_ONLY" | "FIXED_FEE" | "HYBRID";
  commissionRateText: string;
  isFreeSample: boolean;
  sampleQuota: number;
  sampleStockRemaining: number;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  mandatoryHashtags: string[];
  mandatoryMentions: string[];
  sowItems: string[];
  targetAffiliateLink?: string;
}

export function CampaignCard({ campaign }: { campaign: CampaignData }) {
  // SOW Detail Modal
  const {
    isOpen: isDetailOpen,
    onOpen: onOpenDetail,
    onOpenChange: onDetailChange,
  } = useDisclosure();

  // Multi-step Registration Modal (Gro Creator 3-Step Flow)
  const {
    isOpen: isApplyOpen,
    onOpen: onOpenApply,
    onOpenChange: onApplyChange,
  } = useDisclosure();

  const [applyStep, setApplyStep] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState("banibanzl");
  const [selectedVariant, setSelectedVariant] = useState("01 Light Natural");
  const [agreedToMOU, setAgreedToMOU] = useState(false);
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isTikTokGo = campaign.platformType === "TIKTOK_GO";
  const filledQuota = campaign.sampleQuota - campaign.sampleStockRemaining;

  const copyHashtags = () => {
    navigator.clipboard.writeText(campaign.mandatoryHashtags.join(" "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenApply = () => {
    setApplyStep(1);
    setSubmitted(false);
    setAgreedToMOU(false);
    onOpenApply();
  };

  const handleSubmitApplication = (onClose: () => void) => {
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <>
      {/* Gro Creator Clean White Card Layout */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow transition-shadow flex flex-col justify-between gap-4">
        {/* Top Section */}
        <div className="flex items-start gap-4">
          {/* Brand Square Box */}
          <div className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0 p-2 text-center shadow-inner">
            <span className="font-extrabold text-sm text-slate-800 uppercase tracking-tight line-clamp-2">
              {campaign.brandName}
            </span>
          </div>

          {/* Right Campaign Info */}
          <div className="flex-1 space-y-2">
            <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2">
              {campaign.title}
            </h3>

            <p className="text-[11px] text-slate-400 font-medium">
              Periode Campaign: {campaign.startDate} - {campaign.endDate}
            </p>

            {/* Badges Row (Soft Pastel Colors like Gro Creator) */}
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              {isTikTokGo ? (
                <>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    Tag Lokasi Hijau
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-indigo-600 border border-purple-200/80">
                    Commission Only
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                    <Gift className="w-3 h-3" />
                    {campaign.benefitType === "VOUCHER_DIGITAL" ? "Voucher Dine-in" : "Pass Outlet VIP"}
                  </span>
                </>
              ) : (
                <>
                  {campaign.isFreeSample && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-50 text-sky-600 border border-sky-200/80">
                      <Gift className="w-3 h-3" />
                      Sample Gratis
                    </span>
                  )}
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-indigo-600 border border-purple-200/80">
                    Commission Only
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
                    <ShoppingBag className="w-3 h-3" />
                    Link Keranjang Kuning
                  </span>
                </>
              )}
            </div>

            {/* Location or Category Tags */}
            <div className="flex items-center gap-1.5 pt-1 flex-wrap">
              {isTikTokGo && campaign.locationName && (
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold max-w-[260px] truncate bg-emerald-50/60 px-2 py-0.5 rounded-md border border-emerald-100">
                  <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span className="truncate">{campaign.locationName}</span>
                </div>
              )}
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                {campaign.category}
              </span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                {isTikTokGo ? "TikTok Go" : "TikTok"}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Section (Quota & Actions) */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">
            Kuota: <strong className="text-slate-900">{filledQuota}/{campaign.sampleQuota}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenDetail}
              className="px-4 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Detail
            </button>
            <button
              type="button"
              onClick={handleOpenApply}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Daftar Campaign
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 1: SOW DETAIL MODAL */}
      <Modal
        isOpen={isDetailOpen}
        onOpenChange={onDetailChange}
        size="2xl"
        scrollBehavior="inside"
        placement="center"
        backdrop="blur"
      >
        <ModalContent className="bg-white text-slate-900 border border-slate-200 shadow-2xl rounded-2xl">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-50 text-indigo-600 border border-purple-200">
                    {campaign.brandName}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    {campaign.commissionRateText}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 pt-1">
                  {campaign.title}
                </h2>
              </ModalHeader>

              <ModalBody className="py-4 space-y-4 text-xs text-slate-700">
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Periode Campaign</span>
                    <span className="font-bold text-slate-800">{campaign.startDate} - {campaign.endDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Sisa Kuota Sampel</span>
                    <span className="font-bold text-slate-800">{campaign.sampleStockRemaining} dari {campaign.sampleQuota} tersedia</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    Ketentuan Scope of Work (SOW)
                  </h4>
                  <ul className="space-y-1.5 pl-1">
                    {campaign.sowItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="text-slate-700 font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">Hashtag Wajib (Auto-Detection)</span>
                    <button
                      type="button"
                      onClick={copyHashtags}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
                    >
                      <Copy className="w-3 h-3" />
                      {copied ? "Tersalin!" : "Salin Hashtag"}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {campaign.mandatoryHashtags.map((tag) => (
                      <span key={tag} className="px-2 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {isTikTokGo ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 space-y-1">
                    <p className="font-bold text-emerald-800 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      Otomatis Terdeteksi (TikTok Go):
                    </p>
                    <p className="text-[11px] leading-relaxed text-emerald-800">
                      Sistem melacak konten otomatis via akun TikTok, hashtag wajib, dan <strong>Pin Tag Lokasi Hijau (POI)</strong>: {campaign.locationName || "Outlet Resmi"}. Tidak ada pengiriman ekspedisi kurir.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-slate-600 space-y-1">
                    <p className="font-bold text-indigo-700">Otomatis Terdeteksi:</p>
                    <p className="text-[11px] leading-relaxed">
                      Sistem mendeteksi live video kamu otomatis melalui akun TikTok terhubung &amp; hashtag wajib.
                    </p>
                  </div>
                )}
              </ModalBody>

              <ModalFooter className="border-t border-slate-100 py-3 flex justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    handleOpenApply();
                  }}
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Daftar Sekarang
                </button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* MODAL 2: 3-STEP DAFTAR CAMPAIGN (Gro Creator Exact Flow) */}
      <Modal
        isOpen={isApplyOpen}
        onOpenChange={onApplyChange}
        size="lg"
        placement="center"
        backdrop="blur"
      >
        <ModalContent className="bg-white text-slate-900 border border-slate-200 shadow-2xl rounded-2xl">
          {(onClose) => (
            <>
              <ModalHeader className="border-b border-slate-100 pb-3">
                <div className="space-y-2 w-full">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-slate-900">
                      Daftar Campaign
                    </h2>
                    <span className="text-[11px] font-semibold text-slate-400">
                      Langkah {applyStep} dari 3
                    </span>
                  </div>

                  {/* 3 Steps Indicator Bar */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <div className={`h-1.5 rounded-full ${applyStep >= 1 ? "bg-indigo-600" : "bg-slate-200"}`} />
                    <div className={`h-1.5 rounded-full ${applyStep >= 2 ? "bg-indigo-600" : "bg-slate-200"}`} />
                    <div className={`h-1.5 rounded-full ${applyStep >= 3 ? "bg-indigo-600" : "bg-slate-200"}`} />
                  </div>
                </div>
              </ModalHeader>

              <ModalBody className="py-4 space-y-4 text-xs">
                {submitted ? (
                  <div className="text-center py-8 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">Pendaftaran Berhasil Dikirim!</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Pengajuan kamu untuk <strong>{campaign.title}</strong> telah diterima. Admin TAP agency akan memverifikasi akun kamu dan memproses pengiriman sampel.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* STEP 1: Pilih Akun Media Sosial */}
                    {applyStep === 1 && (
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">1. Pilih Akun Media Sosial</h3>
                          <p className="text-slate-500 text-xs">
                            Pilih satu akun yang akan kamu gunakan untuk campaign ini.
                          </p>
                        </div>

                        {/* Account Cards */}
                        <div className="space-y-2">
                          <label
                            onClick={() => setSelectedAccount("banibanzl")}
                            className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                              selectedAccount === "banibanzl"
                                ? "border-indigo-600 bg-indigo-50/40 shadow-sm"
                                : "border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                                TT
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-slate-900 text-xs">banibanzl</span>
                                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                                    Memenuhi syarat
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400">Flw: 1.1K | GMV: -</p>
                              </div>
                            </div>
                            <input
                              type="radio"
                              name="media_account"
                              checked={selectedAccount === "banibanzl"}
                              onChange={() => setSelectedAccount("banibanzl")}
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
                          </label>

                          <label
                            onClick={() => setSelectedAccount("hibban_nzl")}
                            className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                              selectedAccount === "hibban_nzl"
                                ? "border-indigo-600 bg-indigo-50/40 shadow-sm"
                                : "border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs">
                                IG
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-slate-900 text-xs">hibban_nzl</span>
                                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                                    Instagram
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400">Flw: 1.2K | GMV: -</p>
                              </div>
                            </div>
                            <input
                              type="radio"
                              name="media_account"
                              checked={selectedAccount === "hibban_nzl"}
                              onChange={() => setSelectedAccount("hibban_nzl")}
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
                          </label>
                        </div>

                        <div className="pt-1 text-center">
                          <Link
                            href="/profile"
                            className="text-xs text-indigo-600 font-semibold hover:underline"
                          >
                            + Tambah akun baru di Profil
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* STEP 2: Sampel / Benefit Outlet */}
                    {applyStep === 2 && (
                      <div className="space-y-4">
                        {isTikTokGo ? (
                          <div className="space-y-4">
                            <div>
                              <h3 className="font-bold text-slate-900 text-sm">2. Benefit &amp; Akses Kunjungan Outlet</h3>
                              <p className="text-slate-500 text-xs">
                                Campaign TikTok Go berbasis kunjungan langsung ke tempat/outlet (tanpa kurir fisik).
                              </p>
                            </div>

                            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
                              <div className="flex items-start gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                                  <MapPin className="w-4 h-4" />
                                </div>
                                <div className="space-y-0.5">
                                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                                    Lokasi &amp; Tempat Kunjungan
                                  </span>
                                  <h4 className="font-bold text-slate-900 text-xs">{campaign.locationName || "Kunjungan Outlet Offline"}</h4>
                                  <p className="text-[11px] text-slate-600">
                                    {campaign.outletAddress || "Alamat lengkap dan kode voucher digital akan diterbitkan di dashboard tugas setelah pengajuan disetujui."}
                                  </p>
                                </div>
                              </div>

                              <div className="p-3 bg-white border border-emerald-100 rounded-xl space-y-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                  Bentuk Benefit Kreator
                                </span>
                                <p className="text-xs font-bold text-emerald-800">
                                  {campaign.benefitType === "VOUCHER_DIGITAL"
                                    ? "🎟️ Voucher Digital Resmi (Dine-in / Belanja di Kasir)"
                                    : "📋 Pass / Surat Tugas Resmi Creavy (Akses Kamar / Fasilitas)"}
                                </p>
                                <p className="text-[11px] text-slate-500">
                                  Tunjukkan kode barcode/pass dari aplikasi Creavy kepada kasir/staf saat tiba di outlet.
                                </p>
                              </div>
                            </div>

                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <p className="text-[11px] text-slate-600">
                                Anda menyanggupi untuk berkunjung langsung ke outlet dan menyematkan <strong>Pin Tag Lokasi Hijau</strong> resmi serta keranjang voucher TikTok Go di video/live.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div>
                              <h3 className="font-bold text-slate-900 text-sm">2. Sampel &amp; Pengiriman</h3>
                              <p className="text-slate-500 text-xs">
                                Pilih varian sampel produk dan konfirmasi alamat pengiriman.
                              </p>
                            </div>

                            {campaign.isFreeSample ? (
                              <div className="space-y-3">
                                <label className="font-bold text-slate-800 text-xs block">
                                  Varian Produk yang Diinginkan
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                  {["01 Light Natural", "02 Golden Beige", "03 Warm Sand"].map((v) => (
                                    <button
                                      key={v}
                                      type="button"
                                      onClick={() => setSelectedVariant(v)}
                                      className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                                        selectedVariant === v
                                          ? "border-indigo-600 bg-indigo-50/50 text-indigo-600"
                                          : "border-slate-200 text-slate-700 hover:bg-slate-50"
                                      }`}
                                    >
                                      {v}
                                    </button>
                                  ))}
                                </div>

                                <div className="space-y-2 pt-2">
                                  <label className="font-bold text-slate-800 text-xs block">
                                    Alamat Pengiriman Utama
                                  </label>
                                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                                    <div className="flex items-center justify-between">
                                      <span className="font-bold text-slate-900">Hibban Nazala</span>
                                      <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-slate-200 text-slate-700">
                                        Alamat utama
                                      </span>
                                    </div>
                                    <p className="text-slate-500 text-[11px]">+62 896-2427-2784</p>
                                    <p className="text-slate-700 font-medium">
                                      DKI JAKARTA, KOTA JAKARTA PUSAT, KEMAYORAN, 10650
                                    </p>
                                    <p className="text-slate-500 text-[11px]">
                                      Jl. Taruna Jaya No.42, RT.011, RW.002, Serdang
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1 text-slate-600">
                                <p className="font-semibold text-slate-800">Campaign Tanpa Pengiriman Sampel Fisik</p>
                                <p className="text-xs text-slate-500">
                                  Campaign ini berbasis komisi afiliasi murni. Anda dapat langsung menyematkan link keranjang kuning pada video TikTok Anda.
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* STEP 3: Informasi SoW & Pembayaran */}
                    {applyStep === 3 && (
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">3. Informasi SoW &amp; Pembayaran</h3>
                          <p className="text-slate-500 text-xs">
                            Tinjau ringkasan komisi dan setujui perjanjian MOU kerja sama.
                          </p>
                        </div>

                        {/* Payment Model Summary */}
                        <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-indigo-900">Model Pembayaran</span>
                            <span className="font-bold text-indigo-700">{campaign.commissionRateText}</span>
                          </div>
                          <p className="text-[11px] text-slate-600">
                            Rate diberikan dalam bentuk komisi penjualan afiliasi resmi via TikTok Shop.
                          </p>
                        </div>

                        {/* SOW Checklist Preview */}
                        <div className="space-y-2">
                          <span className="font-bold text-slate-800 block">Scope of Work:</span>
                          <ul className="space-y-1 text-[11px] text-slate-600">
                            {campaign.sowItems.slice(0, 3).map((item, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Agreement Checkbox */}
                        <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={agreedToMOU}
                            onChange={(e) => setAgreedToMOU(e.target.checked)}
                            className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-[11px] text-slate-700 leading-snug">
                            Saya telah membaca dengan teliti, memahami, dan setuju dengan semua ketentuan <strong>Perjanjian MOU &amp; Ketentuan Afiliasi</strong>.
                          </span>
                        </label>
                      </div>
                    )}
                  </>
                )}
              </ModalBody>

              <ModalFooter className="border-t border-slate-100 py-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batalkan
                </button>

                {!submitted && (
                  <div className="flex items-center gap-2">
                    {applyStep > 1 && (
                      <button
                        type="button"
                        onClick={() => setApplyStep((prev) => prev - 1)}
                        className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Sebelumnya</span>
                      </button>
                    )}

                    {applyStep < 3 ? (
                      <button
                        type="button"
                        onClick={() => setApplyStep((prev) => prev + 1)}
                        className="inline-flex items-center gap-1 px-5 py-2 rounded-xl bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700 shadow-sm"
                      >
                        <span>Selanjutnya</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={!agreedToMOU}
                        onClick={() => handleSubmitApplication(onClose)}
                        className={`px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-sm transition-colors ${
                          agreedToMOU
                            ? "bg-indigo-600 hover:bg-indigo-700"
                            : "bg-slate-300 cursor-not-allowed"
                        }`}
                      >
                        Simpan &amp; Ajukan
                      </button>
                    )}
                  </div>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
