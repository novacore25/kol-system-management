"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { initialCreatorTasks } from "@/lib/tasks-data";
import clsx from "clsx";

export default function CampaignDetailPage() {
  const params = useParams();
  const taskId = params.id as string;
  const task = initialCreatorTasks.find((t) => t.id === taskId) || initialCreatorTasks[0];

  const [activeTab, setActiveTab] = useState<"INFORMASI" | "TUGAS" | "ANALITIK" | "PANDUAN">("INFORMASI");
  const [copied, setCopied] = useState(false);

  const copyHashtags = () => {
    navigator.clipboard.writeText(task.mandatoryHashtags.join(" "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const salesSummary = task.salesSummary || {
    productId: task.productId || "172981928391",
    creatorUsername: task.creatorUsername || "@banibanzl",
    totalViews: 53420,
    totalLikes: 4290,
    totalLiveDurationMinutes: 150,
    totalLivePeakViewers: 485,
    totalItemsSold: 7,
    totalGmv: 1295000,
    estimatedCommission: 233100,
    settledCommission: 99900,
    videoCount: 2,
    liveCount: 1,
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb (Gro Creator exact style) */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/my-tasks" className="hover:text-indigo-600 transition-colors">
          Campaign Saya
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-600 font-medium">Detail Campaign</span>
      </div>

      {/* Main Campaign Title */}
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        {task.campaignTitle}
      </h1>

      {/* Rounded Pill Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { key: "INFORMASI", label: "Informasi" },
          { key: "TUGAS", label: "Tugas" },
          { key: "ANALITIK", label: "Analitik & Penjualan" },
          { key: "PANDUAN", label: "Panduan" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as any)}
            className={clsx(
              "px-5 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5",
              activeTab === tab.key
                ? "bg-indigo-50 text-indigo-600 shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            )}
          >
            {tab.key === "ANALITIK" && <BarChart2 className="w-3.5 h-3.5" />}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: INFORMASI */}
      {activeTab === "INFORMASI" && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="font-bold text-sm text-slate-900">
            {task.campaignTitle}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            {/* Periode */}
            <div className="space-y-1">
              <span className="text-slate-400 block text-[11px]">Periode Campaign:</span>
              <p className="font-semibold text-slate-800">
                01 Sep 2026 00:00:00 - {task.deadlineDate} 23:59:59
              </p>
            </div>

            {/* Akun terdaftar */}
            <div className="space-y-1">
              <span className="text-slate-400 block text-[11px]">Akun terdaftar:</span>
              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                <span className="w-2 h-2 rounded-full bg-slate-900" />
                <span>{task.creatorUsername || "banibanzl"}</span>
              </div>
            </div>

            {/* Status pendaftaran */}
            <div className="space-y-1">
              <span className="text-slate-400 block text-[11px]">Status pendaftaran:</span>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  {task.status === "VIDEO_DETECTED" ? "Disetujui & Aktif" : "Ditinjau"}
                </span>
              </div>
            </div>
          </div>

          {/* Detail Kurir & Resi Sampel (Tanpa API berbayar) */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-600" />
                <h4 className="font-bold text-slate-900 text-sm">Status Pengiriman Sampel Produk</h4>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200 self-start sm:self-auto">
                {task.trackingNumber ? "Dalam Perjalanan Kurir" : "Menunggu Pengiriman"}
              </span>
            </div>

            {task.trackingNumber ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                      Ekspedisi &amp; Nomor Resi
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{task.courierName || "J&T Express"}</span>
                      <span className="font-mono font-bold text-indigo-600 text-sm bg-indigo-50 px-2 py-0.5 rounded-md">
                        {task.trackingNumber}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(task.trackingNumber || "");
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copied ? "Tersalin!" : "Salin Resi"}</span>
                    </button>

                    <a
                      href="https://www.jet.co.id/track"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                      <span>Lacak di Web Kurir</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* 3-Step Simple Shipment Flow */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-800 block">1. Gudang Agensi</span>
                      <span className="text-slate-400 text-[10px]">Paket selesai dipacking</span>
                    </div>
                  </div>
                  <div className="p-2.5 bg-indigo-50/60 rounded-xl border border-indigo-200 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <span className="font-bold text-indigo-900 block">2. Kurir Ekspedisi</span>
                      <span className="text-indigo-600 text-[10px]">Paket sedang dibawa kurir</span>
                    </div>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center gap-2 text-slate-400">
                    <Clock className="w-4 h-4 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-500 block">3. Alamat Kreator</span>
                      <span className="text-slate-400 text-[10px]">Estimasi tiba 1–2 hari</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-xs">
                Admin sedang memproses verifikasi dan penyiapan sampel di gudang agensi. Nomor resi pengiriman akan muncul otomatis di sini segera setelah kurir melakukan pick-up.
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: TUGAS */}
      {activeTab === "TUGAS" && (
        <div className="space-y-4">
          {/* Target Link TikTok Shop */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-indigo-600" />
                <h4 className="font-bold text-sm text-slate-900">Tautan Target TikTok Shop Resmi</h4>
              </div>
              <p className="text-xs text-slate-500 max-w-lg">
                Klik tombol untuk langsung menambahkan produk ini ke keranjang kuning videomu dengan komisi affiliate resmi.
              </p>
            </div>

            <a
              href={task.targetAffiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm self-start sm:self-auto"
            >
              <span>Buka di TikTok Shop</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Auto-Detection Status */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h4 className="font-bold text-sm text-slate-900">Status Deteksi Video TikTok</h4>
              </div>

              {task.detectedVideo ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Video Terdeteksi Live
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  Menunggu Video Live
                </span>
              )}
            </div>

            {task.detectedVideo ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <p className="font-bold text-slate-900">{task.detectedVideo.title}</p>
                  <p className="text-slate-500">
                    Diposting pada {task.detectedVideo.postDate} • {task.detectedVideo.viewsCount} Views • {task.detectedVideo.likesCount} Likes
                  </p>
                </div>

                <a
                  href={task.detectedVideo.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 rounded-xl border border-indigo-500 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors self-start sm:self-auto"
                >
                  Tonton di TikTok
                </a>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-1">
                <p className="font-bold text-slate-800">Video belum terdeteksi</p>
                <p className="text-slate-500">
                  Setelah upload video ke akun TikTok @banibanzl dengan hashtag wajib, sistem akan mendeteksinya secara otomatis dalam waktu 15–30 menit.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ANALITIK & PENJUALAN (AWARENESS & SALES TRACKING) */}
      {activeTab === "ANALITIK" && (
        <div className="space-y-6">
          {/* Header Bar: Target Product ID & Creator Username Binding */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold text-slate-300">Target Product Binding:</span>
                <span className="font-mono font-bold text-indigo-300 text-xs bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/60">
                  ID {task.productId || "172981928391"}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Semua performa views video, sesi LIVE, dan penjualan keranjang kuning diatribusikan ke akun <strong className="text-white">{task.creatorUsername || "@banibanzl"}</strong>.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Auto-Sync TikTok API
              </span>
            </div>
          </div>

          {/* 4 Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* 1. Total GMV */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="font-semibold">Total GMV Penjualan</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">
                  Rp {salesSummary.totalGmv.toLocaleString("id-ID")}
                </p>
                <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                  <TrendingUp className="w-3 h-3" />
                  <span>{salesSummary.totalItemsSold} Produk Terjual</span>
                </p>
              </div>
            </div>

            {/* 2. Estimasi Komisi */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="font-semibold">Estimasi Komisi ({task.commissionRateText})</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-xl font-bold text-indigo-600">
                  Rp {salesSummary.estimatedCommission.toLocaleString("id-ID")}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Telah Settled: <strong className="text-slate-800 font-bold">Rp {salesSummary.settledCommission.toLocaleString("id-ID")}</strong>
                </p>
              </div>
            </div>

            {/* 3. Awareness Video */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="font-semibold">Awareness Video</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Video className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">
                  {salesSummary.totalViews.toLocaleString("id-ID")} Views
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {salesSummary.totalLikes.toLocaleString("id-ID")} Likes • {salesSummary.videoCount} Video Live
                </p>
              </div>
            </div>

            {/* 4. Awareness Live */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="font-semibold">Awareness LIVE Streaming</span>
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Radio className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">
                  {Math.floor(salesSummary.totalLiveDurationMinutes / 60)}j {salesSummary.totalLiveDurationMinutes % 60}m
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Peak: <strong className="text-slate-800 font-bold">{salesSummary.totalLivePeakViewers}</strong> Penonton • 1 Sesi
                </p>
              </div>
            </div>
          </div>

          {/* Section 1: Raw Data Video (raw_data_video) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-purple-600" />
                <h4 className="font-bold text-sm text-slate-900">
                  1. Deteksi Raw Data Video ({task.rawVideos?.length || 0} Postingan)
                </h4>
              </div>
              <span className="text-[11px] font-mono text-slate-400">table: raw_data_videos</span>
            </div>

            {task.rawVideos && task.rawVideos.length > 0 ? (
              <div className="space-y-3">
                {task.rawVideos.map((rv) => (
                  <div
                    key={rv.id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
                          VIDEO ID: {rv.videoId}
                        </span>
                        <span className="text-slate-400 text-[11px]">• {rv.postTime}</span>
                      </div>
                      <p className="font-semibold text-slate-800 text-xs">{rv.caption}</p>
                      <div className="flex flex-wrap items-center gap-4 text-slate-500 text-[11px] pt-1">
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <Eye className="w-3 h-3 text-slate-400" /> {rv.viewsCount.toLocaleString("id-ID")} Views
                        </span>
                        <span>• {rv.likesCount.toLocaleString("id-ID")} Likes</span>
                        <span>• {rv.commentsCount} Komentar</span>
                        <span>• {rv.sharesCount} Shares</span>
                        <span className="text-indigo-600 font-semibold">• Retention: {rv.retentionRate}%</span>
                      </div>
                    </div>

                    <a
                      href={rv.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl border border-purple-300 text-purple-700 bg-white hover:bg-purple-50 font-semibold text-xs transition-colors self-start md:self-auto shrink-0 inline-flex items-center gap-1"
                    >
                      <span>Tonton Video</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 py-3">Belum ada data video yang terdeteksi untuk campaign ini.</p>
            )}
          </div>

          {/* Section 2: Raw Data Live (raw_data_live) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-rose-600" />
                <h4 className="font-bold text-sm text-slate-900">
                  2. Deteksi Raw Data LIVE Streaming ({task.rawLives?.length || 0} Sesi)
                </h4>
              </div>
              <span className="text-[11px] font-mono text-slate-400">table: raw_data_lives</span>
            </div>

            {task.rawLives && task.rawLives.length > 0 ? (
              <div className="space-y-3">
                {task.rawLives.map((rl) => (
                  <div
                    key={rl.id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                          ROOM: {rl.liveRoomId}
                        </span>
                        <span className="text-slate-500 font-semibold">{rl.startTime}</span>
                      </div>
                      <span className="text-slate-600 font-bold">Durasi: {rl.durationMinutes} Menit</span>
                    </div>

                    <p className="font-semibold text-slate-800">{rl.liveTitle}</p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                        <span className="text-slate-400 block text-[10px]">Total Penonton Live</span>
                        <span className="font-bold text-slate-800">{rl.totalLiveViews.toLocaleString("id-ID")}</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                        <span className="text-slate-400 block text-[10px]">Peak Viewers (PCU)</span>
                        <span className="font-bold text-rose-600">{rl.peakViewersPcu} Penonton</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                        <span className="text-slate-400 block text-[10px]">Interaksi Chat</span>
                        <span className="font-bold text-slate-800">{rl.totalComments.toLocaleString("id-ID")}</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                        <span className="text-slate-400 block text-[10px]">Klik Keranjang Produk</span>
                        <span className="font-bold text-emerald-600">{rl.totalProductClicks} Klik</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 py-3">Belum ada sesi live streaming dengan produk disematkan.</p>
            )}
          </div>

          {/* Section 3: Raw Data Sales Orders (raw_data_sales) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <h4 className="font-bold text-sm text-slate-900">
                  3. Raw Data Transaksi Penjualan ({task.rawSales?.length || 0} Order)
                </h4>
              </div>
              <span className="text-[11px] font-mono text-slate-400">table: raw_data_sales</span>
            </div>

            {task.rawSales && task.rawSales.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                      <th className="py-2.5 px-3">Order ID</th>
                      <th className="py-2.5 px-3">Sumber</th>
                      <th className="py-2.5 px-3">Varian Produk</th>
                      <th className="py-2.5 px-3">Qty</th>
                      <th className="py-2.5 px-3">Total GMV</th>
                      <th className="py-2.5 px-3">Komisi</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {task.rawSales.map((rs) => (
                      <tr key={rs.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 font-mono font-semibold text-slate-800">
                          {rs.orderId}
                          <span className="block text-[10px] text-slate-400 font-sans">{rs.orderCreatedTime}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={clsx(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold",
                              rs.contentType === "VIDEO"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-rose-100 text-rose-700"
                            )}
                          >
                            {rs.contentType}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-900">{rs.productName}</td>
                        <td className="py-3 px-3 font-semibold">{rs.quantity}x</td>
                        <td className="py-3 px-3 font-bold text-slate-900">
                          Rp {rs.totalGmv.toLocaleString("id-ID")}
                        </td>
                        <td className="py-3 px-3 font-bold text-emerald-600">
                          Rp {rs.commissionAmount.toLocaleString("id-ID")}
                          <span className="block text-[10px] text-slate-400">({rs.commissionRate}%)</span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={clsx(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold",
                              rs.orderStatus === "SETTLED"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : rs.orderStatus === "DELIVERED"
                                ? "bg-sky-50 text-sky-700 border border-sky-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            )}
                          >
                            {rs.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-slate-400 py-3">Belum ada transaksi penjualan yang teratribusi.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: PANDUAN */}
      {activeTab === "PANDUAN" && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-6 text-xs text-slate-700">
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-slate-900">Ketentuan Scope of Work (SOW)</h4>
            <ul className="space-y-1.5">
              {task.sowChecklist.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-slate-800">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900">Hashtag Wajib (Auto-Detection)</h4>
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
              {task.mandatoryHashtags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {task.soundUrl && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="font-medium text-slate-700 flex items-center gap-1.5">
                <Music className="w-4 h-4 text-purple-600" />
                Sound Resmi TikTok Campaign
              </span>
              <a
                href={task.soundUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
              >
                Buka Sound
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
