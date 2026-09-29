"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronRight,
  Copy,
  ExternalLink,
  ShoppingBag,
  Sparkles,
  Music,
  CheckCircle2,
  Clock,
  Truck,
  BarChart2,
  Video,
  Radio,
  DollarSign,
  Eye,
  TrendingUp,
  Tag,
  MapPin,
  Gift,
  Ticket,
  Store,
  Loader2,
  AlertCircle,
  Hash,
  AtSign,
  FileText,
  XCircle,
  Package,
} from "lucide-react";
import clsx from "clsx";

interface ApplicationDetailData {
  id: string;
  applicationId: string;
  applicationStatus: "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "WAITLISTED";
  appliedAt: string;
  reviewedAt?: string | null;
  rejectionReason?: string | null;
  selectedVariant?: string | null;
  shippingAddressSnapshot?: {
    recipientName?: string;
    phoneNumber?: string;
    streetAddress?: string;
    district?: string;
    city?: string;
    province?: string;
    postalCode?: string;
  } | null;
  creatorUsername: string;
  courierName?: string | null;
  trackingNumber?: string | null;
  trackingStatus?: string;
  dispatchedAt?: string | null;
  deliveredAt?: string | null;
  campaign: {
    id: string;
    title: string;
    slug: string;
    brandName: string;
    bannerUrl: string;
    description: string;
    brief?: string | null;
    platformType: "TIKTOK_SHOP" | "TIKTOK_GO";
    productId?: string;
    salePrice?: string;
    shopName?: string;
    locationId?: string;
    locationName?: string;
    merchantName?: string;
    industryCategory?: string;
    benefitType?: "VOUCHER_DIGITAL" | "OUTLET_PASS_LINK";
    benefitData?: string;
    commissionRateText: string;
    startDate: string;
    endDate: string;
    daysRemaining: number;
    targetAffiliateLink?: string;
    productSkus: Array<{
      productId: string;
      productName: string;
      salePrice?: string;
      productLink?: string;
      commissionRate?: string;
    }>;
    mandatoryHashtags: string[];
    mandatoryMentions: string[];
    sowItems: string[];
    dosAndDonts: Array<{ type: "DO" | "DONT"; text: string }>;
    campaignVariants: string[];
    status: string;
  };
  task?: {
    id: string;
    taskStatus: string;
    detectedVideo?: {
      videoId: string;
      videoUrl: string;
      title: string;
      coverUrl: string;
      viewsCount: string;
      likesCount: string;
      commentsCount: string;
      postDate: string;
      isBasketVerified: boolean;
    } | null;
  } | null;
}

const STATUS_BADGE = {
  PENDING_REVIEW: {
    label: "Sedang Ditinjau",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
  },
  APPROVED: {
    label: "Disetujui & Aktif",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Tidak Disetujui",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    icon: XCircle,
  },
  WAITLISTED: {
    label: "Waitlist",
    badgeClass: "bg-slate-50 text-slate-700 border-slate-200",
    icon: Clock,
  },
};

export default function CampaignDetailPage() {
  const params = useParams();
  const taskId = params?.id as string;

  const [data, setData] = useState<ApplicationDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"INFORMASI" | "TUGAS" | "ANALITIK" | "PANDUAN">("INFORMASI");
  const [copied, setCopied] = useState(false);
  const [copiedResi, setCopiedResi] = useState(false);

  useEffect(() => {
    if (!taskId) return;
    setLoading(true);
    setError(null);

    fetch(`/api/my-applications/${taskId}`)
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Gagal memuat detail campaign");
        }
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading application detail:", err);
        setError(err.message || "Terjadi kesalahan.");
        setLoading(false);
      });
  }, [taskId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-slate-500 text-xs font-medium">Memuat detail campaign...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center max-w-md space-y-4">
          <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Campaign Tidak Ditemukan</h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {error || "Data pendaftaran atau campaign ini tidak tersedia atau kamu tidak memiliki akses."}
            </p>
          </div>
          <Link
            href="/my-tasks"
            className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors shadow-md shadow-indigo-600/20"
          >
            Kembali ke Campaign Saya
          </Link>
        </div>
      </div>
    );
  }

  const campaign = data.campaign;
  const isTikTokGo = campaign.platformType === "TIKTOK_GO";
  const statusInfo = STATUS_BADGE[data.applicationStatus] || STATUS_BADGE.PENDING_REVIEW;

  const copyHashtags = () => {
    if (campaign.mandatoryHashtags?.length) {
      navigator.clipboard.writeText(campaign.mandatoryHashtags.join(" "));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyResi = () => {
    if (data.trackingNumber) {
      navigator.clipboard.writeText(data.trackingNumber);
      setCopiedResi(true);
      setTimeout(() => setCopiedResi(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/my-tasks" className="hover:text-indigo-600 transition-colors">
          Campaign Saya
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-600 font-medium truncate max-w-xs">{campaign.title}</span>
      </div>

      {/* Campaign Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
            {campaign.bannerUrl ? (
              <img
                src={campaign.bannerUrl}
                alt={campaign.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-6 h-6 text-slate-300" />
              </div>
            )}
          </div>
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusInfo.badgeClass}`}>
                {statusInfo.label}
              </span>
              <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                {isTikTokGo ? <MapPin className="w-3 h-3 text-emerald-600" /> : <ShoppingBag className="w-3 h-3 text-indigo-600" />}
                {isTikTokGo ? "TikTok Go" : "TikTok Shop"}
              </span>
            </div>
            <h1 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight line-clamp-1">
              {campaign.title}
            </h1>
            <p className="text-xs text-slate-500">{campaign.brandName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          <Link
            href={`/campaign/${campaign.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <span>Halaman Publik</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* Rounded Pill Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { key: "INFORMASI", label: "Informasi Pendaftaran" },
          { key: "TUGAS", label: "Tugas & Deteksi Video" },
          { key: "ANALITIK", label: "Analitik & Penjualan" },
          { key: "PANDUAN", label: "Panduan & SOW" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as any)}
            className={clsx(
              "px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5",
              activeTab === tab.key
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300"
            )}
          >
            {tab.key === "ANALITIK" && <BarChart2 className="w-3.5 h-3.5" />}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: INFORMASI */}
      {activeTab === "INFORMASI" && (
        <div className="space-y-5">
          {/* Main Info Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
              Detail Registrasi Campaign
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 block text-[11px] font-medium">Periode Campaign:</span>
                <p className="font-semibold text-slate-800">
                  {campaign.startDate} s/d {campaign.endDate}
                </p>
                <span className="text-[10px] text-indigo-600 font-bold">
                  {campaign.daysRemaining > 0 ? `${campaign.daysRemaining} hari tersisa` : "Telah berakhir"}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 block text-[11px] font-medium">Akun Terdaftar:</span>
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <span className="w-2 h-2 rounded-full bg-slate-900 shrink-0" />
                  <span className="truncate">{data.creatorUsername}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 block text-[11px] font-medium">Model Komisi:</span>
                <p className="font-bold text-emerald-700 text-sm">{campaign.commissionRateText}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 block text-[11px] font-medium">Status Pendaftaran:</span>
                <div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border inline-block ${statusInfo.badgeClass}`}>
                    {statusInfo.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Varian & Alamat */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              {data.selectedVariant && (
                <div className="p-3.5 bg-violet-50/70 border border-violet-200 rounded-xl space-y-1">
                  <span className="text-[10px] text-violet-600 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Varian Sampel Dipilih
                  </span>
                  <p className="text-xs font-bold text-slate-900">{data.selectedVariant}</p>
                </div>
              )}

              {data.shippingAddressSnapshot && (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Truck className="w-3 h-3" /> Alamat Pengiriman
                  </span>
                  <p className="text-xs font-semibold text-slate-800">
                    {data.shippingAddressSnapshot.recipientName} · {data.shippingAddressSnapshot.phoneNumber}
                  </p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {[
                      data.shippingAddressSnapshot.streetAddress,
                      data.shippingAddressSnapshot.district,
                      data.shippingAddressSnapshot.city,
                      data.shippingAddressSnapshot.province,
                      data.shippingAddressSnapshot.postalCode,
                    ].filter(Boolean).join(", ")}
                  </p>
                </div>
              )}
            </div>

            {/* Rejection notice if any */}
            {data.applicationStatus === "REJECTED" && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-1">
                <p className="font-bold">Pendaftaran Tidak Disetujui</p>
                <p className="text-rose-700 leading-relaxed">
                  {data.rejectionReason || "Mohon maaf, kuota atau kriteria akunmu belum sesuai untuk campaign ini."}
                </p>
              </div>
            )}
          </div>

          {/* Logistics / Sample Section */}
          {isTikTokGo ? (
            <div className="p-5 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/80 pb-3">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-bold text-slate-900 text-sm">Benefit &amp; Akses Outlet TikTok Go</h4>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Akses Tersedia (Tanpa Pengiriman Fisik)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 bg-white rounded-xl border border-emerald-100 space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-bold text-slate-900 text-xs">{campaign.locationName || "Outlet Resmi"}</span>
                  </div>
                  <div className="space-y-1 text-[11px] text-slate-600">
                    <p><strong className="text-slate-700">POI Tag ID:</strong> <span className="font-mono bg-emerald-50 px-1.5 py-0.5 rounded text-emerald-800 font-semibold">{campaign.locationId || "N/A"}</span></p>
                    <p><strong className="text-slate-700">Merchant:</strong> {campaign.merchantName || campaign.brandName}</p>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-emerald-100 flex flex-col justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      {campaign.benefitType === "VOUCHER_DIGITAL" ? "Kode Voucher Digital Kasir" : "Pass Kunjungan Resmi Creavy"}
                    </span>
                    {campaign.benefitType === "VOUCHER_DIGITAL" ? (
                      <div className="flex items-center justify-between gap-2 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                        <span className="font-mono font-extrabold text-sm text-emerald-800 tracking-wider">
                          {campaign.benefitData || "VOUCHER-OFFICIAL"}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(campaign.benefitData || "");
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                          className="px-2.5 py-1 bg-white border border-emerald-300 rounded-md text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
                        >
                          {copied ? "Tersalin!" : "Salin Kode"}
                        </button>
                      </div>
                    ) : (
                      <div className="pt-1">
                        <a
                          href={campaign.benefitData || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-sm"
                        >
                          <Ticket className="w-3.5 h-3.5" />
                          <span>Buka Pass Kunjungan VIP</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 italic">
                    *Tunjukkan voucher/pass ini langsung kepada kasir / staf saat berkunjung ke outlet.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-indigo-600" />
                  <h4 className="font-bold text-slate-900 text-sm">Status Pengiriman Sampel Produk</h4>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                  data.trackingNumber
                    ? "bg-sky-50 text-sky-700 border-sky-200"
                    : "bg-slate-100 text-slate-600 border-slate-200"
                }`}>
                  {data.trackingNumber ? "Dalam Pengiriman Kurir" : "Menunggu Pengiriman"}
                </span>
              </div>

              {data.trackingNumber ? (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                        Ekspedisi &amp; Nomor Resi Pengiriman
                      </span>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm">{data.courierName || "Kurir Resmi"}</span>
                        <span className="font-mono font-bold text-indigo-600 text-sm bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                          {data.trackingNumber}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={copyResi}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedResi ? "Tersalin!" : "Salin Resi"}</span>
                      </button>

                      <a
                        href={`https://www.google.com/search?q=cek+resi+${encodeURIComponent(data.courierName || '')}+${encodeURIComponent(data.trackingNumber || '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm"
                      >
                        <span>Lacak Resi</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* 3-Step Simple Shipment Flow */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-800 block">1. Gudang Agensi</span>
                        <span className="text-slate-400 text-[10px]">Paket selesai dipacking</span>
                      </div>
                    </div>
                    <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
                      <div>
                        <span className="font-bold text-indigo-900 block">2. Kurir Ekspedisi</span>
                        <span className="text-indigo-600 text-[10px]">Paket dalam perjalanan</span>
                      </div>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-2 text-slate-400">
                      <Clock className="w-4 h-4 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-500 block">3. Alamat Kreator</span>
                        <span className="text-slate-400 text-[10px]">Estimasi tiba 1–3 hari</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-white rounded-xl border border-slate-200 text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-800">Sampel sedang disiapkan</p>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Admin sedang memproses penyiapan sampel produk di gudang agensi. Nomor resi pengiriman kurir akan muncul otomatis di sini setelah paket di-pick up.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TUGAS */}
      {activeTab === "TUGAS" && (
        <div className="space-y-4">
          {/* Target Link & Showcase Products */}
          {campaign.productSkus && campaign.productSkus.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <ShoppingBag className="w-4 h-4 text-indigo-600" />
                <h4 className="font-bold text-sm text-slate-900">Produk Keranjang Kuning / Showcase</h4>
              </div>
              <div className="space-y-2">
                {campaign.productSkus.map((sku, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs text-slate-900 truncate">{sku.productName || `Produk ${i + 1}`}</p>
                      {sku.salePrice && <p className="text-[11px] text-emerald-700 font-bold">{sku.salePrice}</p>}
                    </div>
                    {sku.productLink && (
                      <a
                        href={sku.productLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-[11px] font-bold hover:bg-indigo-700 shrink-0"
                      >
                        <span>Tambah ke Showcase</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Affiliate Target Link (Single) */}
          {campaign.targetAffiliateLink && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-indigo-600" />
                  <h4 className="font-bold text-sm text-slate-900">Tautan Target Afiliasi Resmi</h4>
                </div>
                <p className="text-xs text-slate-500">
                  Klik tombol berikut untuk membuka tautan target affiliate resmi campaign ini di TikTok.
                </p>
              </div>
              <a
                href={campaign.targetAffiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white transition-colors shadow-sm shrink-0"
              >
                <span>Buka Target Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Auto-Detection Status */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h4 className="font-bold text-sm text-slate-900">
                  {isTikTokGo ? "Status Deteksi Video & Tag Lokasi POI" : "Status Deteksi Video TikTok"}
                </h4>
              </div>

              {data.task?.detectedVideo ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Video Terdeteksi Live ✓
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  Menunggu Video Live
                </span>
              )}
            </div>

            {data.task?.detectedVideo ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1.5">
                  <p className="font-bold text-slate-900">{data.task.detectedVideo.title}</p>
                  <p className="text-slate-500">
                    Diposting pada {data.task.detectedVideo.postDate} • {data.task.detectedVideo.viewsCount} Views • {data.task.detectedVideo.likesCount} Likes
                  </p>
                </div>

                {data.task.detectedVideo.videoUrl && (
                  <a
                    href={data.task.detectedVideo.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-1.5 rounded-xl border border-indigo-500 text-indigo-600 hover:bg-indigo-50 text-xs font-semibold transition-colors shrink-0"
                  >
                    Tonton di TikTok
                  </a>
                )}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
                <p className="font-bold text-slate-800">Video belum terdeteksi</p>
                <p className="text-slate-500 leading-relaxed">
                  Setelah upload video ke akun TikTok <strong>{data.creatorUsername}</strong> dengan hashtag wajib{" "}
                  {campaign.mandatoryHashtags?.map((h) => <code key={h} className="bg-white px-1 py-0.5 rounded border border-slate-200 text-indigo-600 font-bold mr-1">{h}</code>)}{" "}
                  {isTikTokGo ? "dan menyematkan Tag Lokasi POI resmi, " : ""}
                  sistem akan mendeteksi videomu secara otomatis dalam kurun waktu 15–30 menit.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ANALITIK & PENJUALAN */}
      {activeTab === "ANALITIK" && (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold text-slate-300">Target Binding:</span>
                <span className="font-mono font-bold text-indigo-300 text-xs bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/60">
                  {campaign.productId || campaign.slug}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Semua performa views video, interaksi, dan transaksi diatribusikan ke akun <strong className="text-white">{data.creatorUsername}</strong>.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs shrink-0">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Auto-Sync TikTok
              </span>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="font-semibold">Performa Views</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">
                  {data.task?.detectedVideo ? data.task.detectedVideo.viewsCount : "0"} Views
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {data.task?.detectedVideo ? `${data.task.detectedVideo.likesCount} Likes` : "Menunggu video live"}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="font-semibold">Komisi Rate</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-xl font-bold text-emerald-700">
                  {campaign.commissionRateText}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Komisi resmi via TikTok Affiliate</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="font-semibold">Status Konten</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Video className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">
                  {data.task?.detectedVideo ? "1 Video Aktif" : "0 Video"}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {data.task?.detectedVideo ? "Terverifikasi" : "Belum terdeteksi"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PANDUAN */}
      {activeTab === "PANDUAN" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 text-xs text-slate-700">
          {/* SOW Checklist */}
          {campaign.sowItems && campaign.sowItems.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-slate-900">📋 Ketentuan Scope of Work (SOW)</h4>
              <ul className="space-y-1.5">
                {campaign.sowItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-slate-800">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Brief */}
          {campaign.brief && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-600" /> Brief Campaign
              </h4>
              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed whitespace-pre-wrap">
                {campaign.brief}
              </div>
            </div>
          )}

          {/* Mandatory Hashtags & Mentions */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            {campaign.mandatoryHashtags && campaign.mandatoryHashtags.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <Hash className="w-4 h-4 text-indigo-600" /> Hashtag Wajib (Auto-Detection)
                  </h4>
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
                    <span key={tag} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {campaign.mandatoryMentions && campaign.mandatoryMentions.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <AtSign className="w-4 h-4 text-purple-600" /> Mention Akun Wajib
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {campaign.mandatoryMentions.map((mention) => (
                    <span key={mention} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                      {mention}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
