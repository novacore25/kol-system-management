"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  Truck,
  Copy,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";
import clsx from "clsx";

export default function MyCampaignsPage() {
  const [activeTab, setActiveTab] = useState("SEMUA");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedResi, setCopiedResi] = useState<string | null>(null);

  const handleCopyResi = (resi: string) => {
    navigator.clipboard.writeText(resi);
    setCopiedResi(resi);
    setTimeout(() => setCopiedResi(null), 2000);
  };

  const myCampaigns = [
    {
      id: "1",
      title: "[AFFILIATE CIRCLE] SEPTEMBER - [BAU] [SEP-OCT] TWC",
      brandName: "Wardah",
      startDate: "16 Sep 2026",
      endDate: "11 Nov 2026",
      tiktokHandle: "banibanzl",
      status: "DISETUJUI",
      sampleStatus: "SEDANG_DIKIRIM",
      courierName: "J&T Express",
      trackingNumber: "JT88291048201",
      courierUrl: "https://www.jet.co.id/track",
      taskStatusText: "Sampel dalam perjalanan kurir",
    },
    {
      id: "2",
      title: "[AFFILIATE CIRCLE] EARTH Reactivate & Hunting Creator L1-L3 Sep 2026",
      brandName: "Earth Love Life",
      startDate: "01 Sep 2026",
      endDate: "30 Sep 2026",
      tiktokHandle: "banibanzl",
      status: "DITINJAU",
      sampleStatus: "MENUNGGU_REVIEW",
      taskStatusText: "Menunggu kurasi admin",
    },
    {
      id: "3",
      title: "Aggregator Kahf X Qarrar - Men Care Grooming Series",
      brandName: "Kahf",
      startDate: "01 Aug 2026",
      endDate: "30 Sep 2026",
      tiktokHandle: "hibban_nzl",
      status: "SELESAI",
      sampleStatus: "DITERIMA",
      courierName: "SiCepat",
      trackingNumber: "004128919201",
      courierUrl: "https://sicepat.com/checkAwb",
      taskStatusText: "Video TikTok terdeteksi live",
    },
  ];

  const counts = {
    SEMUA: myCampaigns.length,
    DISETUJUI: myCampaigns.filter((c) => c.status === "DISETUJUI").length,
    DITINJAU: myCampaigns.filter((c) => c.status === "DITINJAU").length,
    DITOLAK: 0,
    SELESAI: myCampaigns.filter((c) => c.status === "SELESAI").length,
  };

  const filtered = myCampaigns.filter((c) => {
    if (activeTab === "DITINJAU" && c.status !== "DITINJAU") return false;
    if (activeTab === "DISETUJUI" && c.status !== "DISETUJUI") return false;
    if (activeTab === "DITOLAK" && c.status !== "DITOLAK") return false;
    if (activeTab === "SELESAI" && c.status !== "SELESAI") return false;
    if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="space-y-1">
        <span className="text-xs text-slate-400 font-medium">Campaign Saya</span>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Campaign Saya
        </h1>
        <p className="text-xs text-slate-400">
          Pantau status pendaftaran, pelacakan nomor resi sampel produk, dan status posting video keranjang kuning.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3 max-w-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari campaign yang kamu ikuti"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Status Tabs Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: "SEMUA", label: "Semua", count: counts.SEMUA },
          { key: "DISETUJUI", label: "Disetujui", count: counts.DISETUJUI },
          { key: "DITINJAU", label: "Ditinjau", count: counts.DITINJAU },
          { key: "DITOLAK", label: "Ditolak", count: counts.DITOLAK },
          { key: "SELESAI", label: "Selesai", count: counts.SELESAI },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={clsx(
              "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors",
              activeTab === tab.key
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white border border-slate-200/90 text-slate-600 hover:bg-slate-50"
            )}
          >
            <span>{tab.label}</span>
            <span
              className={clsx(
                "px-1.5 py-0.2 rounded-full text-[10px] font-bold",
                activeTab === tab.key
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-500"
              )}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* 3-Column Clean Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm flex flex-col justify-between gap-4 hover:shadow transition-shadow"
          >
            <div className="space-y-3">
              {/* Brand Mini & Status */}
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  {campaign.brandName}
                </span>

                {campaign.status === "DISETUJUI" && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Disetujui</span>
                  </span>
                )}
                {campaign.status === "DITINJAU" && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Ditinjau</span>
                  </span>
                )}
                {campaign.status === "SELESAI" && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Selesai</span>
                  </span>
                )}
              </div>

              {/* Title & Periode */}
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug">
                  {campaign.title}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {campaign.startDate} - {campaign.endDate}
                </p>
              </div>

              {/* TikTok Account */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="w-2 h-2 rounded-full bg-slate-900" />
                <span className="font-medium">@{campaign.tiktokHandle}</span>
              </div>

              {/* Simple Resi Box if shipped */}
              {campaign.trackingNumber && (
                <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-700 font-bold text-[11px]">
                      <Truck className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{campaign.courierName}</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-semibold">
                      {campaign.sampleStatus === "SEDANG_DIKIRIM" ? "Dalam Pengiriman" : "Sampel Diterima"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-white px-2 py-1 rounded-lg border border-slate-200 text-[11px]">
                    <span className="font-mono font-semibold text-slate-800">
                      {campaign.trackingNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyResi(campaign.trackingNumber!)}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-800"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedResi === campaign.trackingNumber ? "Tersalin!" : "Salin"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Row */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">
                {campaign.taskStatusText}
              </span>

              <Link
                href={`/my-tasks/${campaign.id}`}
                className="px-5 py-1.5 rounded-xl border border-indigo-500 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors shadow-sm"
              >
                Detail
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
