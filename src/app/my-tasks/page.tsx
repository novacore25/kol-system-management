"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Package,
  ShoppingBag,
  MapPin,
  Loader2,
  AlertCircle,
  Star,
  CalendarDays,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

interface ApplicationItem {
  applicationId: string;
  applicationStatus: "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "WAITLISTED";
  appliedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
  campaign: {
    id: string;
    title: string;
    slug: string;
    brandName: string;
    bannerUrl: string;
    platformType: "TIKTOK_SHOP" | "TIKTOK_GO";
    commissionRateText: string;
    sampleQuota: number;
    endDate: string;
    status: string;
    productSkus: any[];
    mandatoryHashtags: string[];
    sowChecklist: any[];
  };
}

const STATUS_CONFIG = {
  PENDING_REVIEW: {
    label: "Sedang Ditinjau",
    labelShort: "Ditinjau",
    icon: Clock,
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    badgeBg: "bg-amber-100 text-amber-700",
    dot: "bg-amber-400",
  },
  APPROVED: {
    label: "Disetujui ✓",
    labelShort: "Disetujui",
    icon: CheckCircle2,
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    badgeBg: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
  },
  REJECTED: {
    label: "Tidak Disetujui",
    labelShort: "Ditolak",
    icon: XCircle,
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-700",
    badgeBg: "bg-rose-100 text-rose-700",
    dot: "bg-rose-400",
  },
  WAITLISTED: {
    label: "Waitlist",
    labelShort: "Waitlist",
    icon: Clock,
    bg: "bg-slate-50",
    border: "border-slate-200",
    text: "text-slate-600",
    badgeBg: "bg-slate-100 text-slate-600",
    dot: "bg-slate-400",
  },
};

export default function MyCampaignsPage() {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("SEMUA");
  const [searchQuery, setSearchQuery] = useState("");

  const loadApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/my-applications");
      if (res.status === 401) {
        setError("Kamu belum login. Silakan login untuk melihat campaign kamu.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setApplications(data.applications || []);
    } catch {
      setError("Gagal memuat data. Coba refresh halaman.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const counts = {
    SEMUA: applications.length,
    PENDING_REVIEW: applications.filter((a) => a.applicationStatus === "PENDING_REVIEW").length,
    APPROVED: applications.filter((a) => a.applicationStatus === "APPROVED").length,
    REJECTED: applications.filter((a) => a.applicationStatus === "REJECTED").length,
    WAITLISTED: applications.filter((a) => a.applicationStatus === "WAITLISTED").length,
  };

  const filtered = applications.filter((a) => {
    if (activeTab !== "SEMUA" && a.applicationStatus !== activeTab) return false;
    if (searchQuery && !a.campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !a.campaign.brandName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const tabs = [
    { key: "SEMUA", label: "Semua", count: counts.SEMUA },
    { key: "PENDING_REVIEW", label: "Ditinjau", count: counts.PENDING_REVIEW },
    { key: "APPROVED", label: "Disetujui", count: counts.APPROVED },
    { key: "REJECTED", label: "Ditolak", count: counts.REJECTED },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-xs text-slate-400 font-medium">Campaign Saya</span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Campaign Saya</h1>
          <p className="text-xs text-slate-400">
            Pantau status pendaftaran campaign, pengiriman sampel, dan performa kontenmu.
          </p>
        </div>
        <button
          onClick={loadApplications}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-xl">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Cari campaign atau brand..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all shadow-sm"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === tab.key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center space-y-3">
            <Loader2 className="w-7 h-7 text-indigo-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Memuat data campaign kamu...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center space-y-3 max-w-xs">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">{error}</p>
            {error.includes("login") && (
              <a href="/login" className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl">
                Login Sekarang
              </a>
            )}
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
            <Package className="w-8 h-8 text-slate-300" />
          </div>
          <div className="text-center space-y-1">
            <p className="font-semibold text-slate-700">
              {activeTab === "SEMUA" ? "Belum ada campaign" : `Tidak ada campaign dengan status "${tabs.find(t => t.key === activeTab)?.label}"`}
            </p>
            <p className="text-xs text-slate-400">
              {activeTab === "SEMUA"
                ? "Daftar ke campaign pertamamu lewat link yang dibagikan oleh brand atau agen."
                : "Coba lihat semua campaign kamu di tab Semua."}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => {
            const st = STATUS_CONFIG[app.applicationStatus] || STATUS_CONFIG.PENDING_REVIEW;
            const StatusIcon = st.icon;
            const daysLeft = Math.max(
              0,
              Math.ceil((new Date(app.campaign.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            );

            return (
              <div
                key={app.applicationId}
                className={`bg-white rounded-2xl border ${st.border} shadow-sm overflow-hidden`}
              >
                {/* Card header with banner/info */}
                <div className="flex items-start gap-3 p-4">
                  {/* Mini banner thumbnail */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    {app.campaign.bannerUrl ? (
                      <img
                        src={app.campaign.bannerUrl}
                        alt={app.campaign.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-slate-300" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-slate-900 truncate">{app.campaign.title}</p>
                        <p className="text-xs text-slate-500">{app.campaign.brandName}</p>
                      </div>
                      {/* Status badge */}
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${st.badgeBg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                        {st.labelShort}
                      </span>
                    </div>

                    {/* Meta info */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1 text-[11px] text-slate-500">
                        {app.campaign.platformType === "TIKTOK_GO" ? (
                          <MapPin className="w-3 h-3" />
                        ) : (
                          <ShoppingBag className="w-3 h-3" />
                        )}
                        {app.campaign.platformType === "TIKTOK_GO" ? "TikTok Go" : "TikTok Shop"}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Star className="w-3 h-3 text-amber-400" />
                        {app.campaign.commissionRateText}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-500">
                        <CalendarDays className="w-3 h-3" />
                        {daysLeft > 0 ? `${daysLeft} hari tersisa` : "Berakhir"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status detail section */}
                <div className={`px-4 py-3 border-t ${st.border} ${st.bg}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`w-3.5 h-3.5 ${st.text}`} />
                      <div>
                        <p className={`text-xs font-semibold ${st.text}`}>{st.label}</p>
                        <p className="text-[10px] text-slate-500">
                          Didaftarkan {new Date(app.appliedAt).toLocaleDateString("id-ID", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Action based on status */}
                    {app.applicationStatus === "APPROVED" && (
                      <a
                        href={`/my-tasks/${app.applicationId}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 transition-colors"
                      >
                        Lihat Detail
                        <ChevronRight className="w-3 h-3" />
                      </a>
                    )}
                    {app.applicationStatus === "PENDING_REVIEW" && (
                      <span className="text-[10px] text-amber-600 font-medium">Menunggu review admin</span>
                    )}
                    {app.applicationStatus === "REJECTED" && (
                      <a
                        href={`/campaign/${app.campaign.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-[11px] hover:bg-slate-50"
                      >
                        Lihat Campaign
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* Rejection reason if rejected */}
                  {app.applicationStatus === "REJECTED" && app.rejectionReason && (
                    <div className="mt-2 p-2 bg-white rounded-lg border border-rose-200">
                      <p className="text-[10px] text-rose-600 font-semibold">Alasan:</p>
                      <p className="text-[11px] text-rose-700">{app.rejectionReason}</p>
                    </div>
                  )}

                  {/* Approved — show product links */}
                  {app.applicationStatus === "APPROVED" && app.campaign.productSkus.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <p className="text-[10px] font-semibold text-emerald-700">Produk untuk di-showcase:</p>
                      {app.campaign.productSkus.slice(0, 3).map((sku: any, i: number) => (
                        <div key={i} className="flex items-center justify-between gap-2">
                          <p className="text-[10px] text-slate-600 truncate">{sku.productName || `Produk ${i + 1}`}</p>
                          {sku.productLink && (
                            <a
                              href={sku.productLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0 text-[10px] text-indigo-600 font-semibold hover:underline flex items-center gap-0.5"
                            >
                              Tambah ke Showcase <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      ))}
                      {app.campaign.productSkus.length > 3 && (
                        <p className="text-[10px] text-slate-400">+{app.campaign.productSkus.length - 3} produk lainnya di detail</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
