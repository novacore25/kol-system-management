"use client";

import React, { useState } from "react";
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Video,
  Radio,
  DollarSign,
  Download,
  Database,
  ArrowRight,
  Eye,
  Tag,
  MapPin,
  ShoppingBag,
  Store,
  Ticket,
} from "lucide-react";
import clsx from "clsx";

export default function AdminImportPage() {
  const [importSource, setImportSource] = useState<"TIKTOK_SHOP" | "TIKTOK_GO">("TIKTOK_GO");
  const [activeDataset, setActiveDataset] = useState<"VIDEO" | "LIVE" | "SALES">("SALES");
  const [activeGoDataset, setActiveGoDataset] = useState<"GO_VIDEO" | "GO_LIVE_PRODUCTS" | "GO_LIVE_ROOMS">("GO_VIDEO");
  const [isProcessing, setIsProcessing] = useState(false);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  // 1. TikTok Shop Preloaded Rows
  const [videoRows, setVideoRows] = useState([
    {
      videoId: "7281920192831",
      productId: "172981928391",
      creatorUsername: "@banibanzl",
      caption: "Review Jujur Make Over Velvet Cushion! #MakeOver99 #Creavy",
      views: 34520,
      likes: 2840,
      retention: "71.4%",
      postTime: "2026-09-16 19:45",
    },
    {
      videoId: "7282049182734",
      productId: "172981928391",
      creatorUsername: "@banibanzl",
      caption: "GRWM Kondangan Pakai Make Over Velvet Cushion 💖 #MakeOver99",
      views: 18900,
      likes: 1450,
      retention: "64.8%",
      postTime: "2026-09-19 11:20",
    },
  ]);

  const [liveRows, setLiveRows] = useState([
    {
      liveRoomId: "live_9928174619",
      productId: "172981928391",
      creatorUsername: "@banibanzl",
      liveTitle: "Flash Sale & Beauty Spills Malam Minggu! Diskon Make Over Cushion 💄",
      durationMinutes: 150,
      totalViews: 12450,
      peakViewers: 485,
      productClicks: 640,
      startTime: "2026-09-20 20:00",
    },
  ]);

  const [salesRows, setSalesRows] = useState([
    {
      orderId: "TTSP-99281746201",
      productId: "172981928391",
      productName: "Make Over Velvet Cushion - 01 Light",
      creatorUsername: "@banibanzl",
      contentType: "VIDEO",
      sourceId: "7281920192831",
      quantity: 2,
      totalGmv: "Rp 370.000",
      commission: "Rp 66.600",
      status: "SETTLED",
      createdTime: "2026-09-17 10:14",
    },
    {
      orderId: "TTSP-99281746202",
      productId: "172981928391",
      productName: "Make Over Velvet Cushion - 02 Natural",
      creatorUsername: "@banibanzl",
      contentType: "VIDEO",
      sourceId: "7281920192831",
      quantity: 1,
      totalGmv: "Rp 185.000",
      commission: "Rp 33.300",
      status: "SETTLED",
      createdTime: "2026-09-17 14:32",
    },
    {
      orderId: "TTSP-99281746305",
      productId: "172981928391",
      productName: "Make Over Velvet Cushion - 01 Light",
      creatorUsername: "@banibanzl",
      contentType: "LIVE",
      sourceId: "live_9928174619",
      quantity: 3,
      totalGmv: "Rp 555.000",
      commission: "Rp 99.900",
      status: "DELIVERED",
      createdTime: "2026-09-20 21:15",
    },
  ]);

  // 2. TikTok Go Preloaded Rows (Extracted from real Partner Center exports in Downloads)
  const [videoGoRows, setVideoGoRows] = useState([
    {
      postId: "7283918291048",
      postTitle: "Makan Kenyang Berdua di Solaria Gandaria City Cuma 100rb Pake Voucher TikTok Go! 🍛✨",
      industry: "Dining",
      locationName: "Solaria - Mall Gandaria City",
      locationId: "loc_solaria_gandaria_6912",
      locationCity: "Jakarta Selatan",
      merchant: "PT Solaria Boga Utama",
      productName: "Voucher Dine In Solaria Rp 100.000 (All Menu)",
      productId: "172989182390",
      creatorName: "@banibanzl",
      salesValue: "Rp 4.850.000",
      orders: 38,
      redemptionAmount: "Rp 3.200.000",
      redeemedOrders: 25,
      videoViews: 42100,
      ctr: "4.82%",
      cvr: "3.24%",
      postDate: "2026-09-21 13:10",
    },
    {
      postId: "7283940192841",
      postTitle: "Room Tour Deluxe Room Pullman Central Park! Staycation Mewah Weekend Ini ✨",
      industry: "Accommodations",
      locationName: "Pullman Jakarta Central Park",
      locationId: "loc_pullman_cp_8819",
      locationCity: "Jakarta Barat",
      merchant: "Accor Hotels Indonesia",
      productName: "Voucher Staycation Deluxe Room + Breakfast",
      productId: "172989182399",
      creatorName: "@banibanzl",
      salesValue: "Rp 8.400.000",
      orders: 6,
      redemptionAmount: "Rp 5.600.000",
      redeemedOrders: 4,
      videoViews: 68900,
      ctr: "5.10%",
      cvr: "2.80%",
      postDate: "2026-09-18 16:30",
    },
  ]);

  const [liveProductGoRows, setLiveProductGoRows] = useState([
    {
      roomId: "live_room_go_88192",
      liveTitle: "Makan Siang Bareng di Solaria Gandaria! Review Menu Favorit & Spill Voucher Diskon 🍗",
      creatorName: "@banibanzl",
      productName: "Voucher Paket Nasi Goreng Solaria Rp 50.000",
      productId: "172989182390",
      merchant: "PT Solaria Boga Utama",
      salesValue: "Rp 1.650.000",
      orders: 33,
      aov: "Rp 50.000",
    },
    {
      roomId: "live_room_go_88192",
      liveTitle: "Makan Siang Bareng di Solaria Gandaria! Review Menu Favorit & Spill Voucher Diskon 🍗",
      creatorName: "@banibanzl",
      productName: "Voucher Minuman Avocado Coffee Rp 25.000",
      productId: "172989182395",
      merchant: "PT Solaria Boga Utama",
      salesValue: "Rp 600.000",
      orders: 24,
      aov: "Rp 25.000",
    },
  ]);

  const [liveRoomGoRows, setLiveRoomGoRows] = useState([
    {
      roomId: "live_room_go_88192",
      liveTitle: "Makan Siang Bareng di Solaria Gandaria! Review Menu Favorit & Spill Voucher Diskon 🍗",
      startTime: "2026-09-21 12:00:00",
      duration: "120 min",
      creatorName: "@banibanzl",
      salesValue: "Rp 2.250.000",
      orders: 57,
      redemptionAmount: "Rp 1.600.000",
      redeemedOrders: 42,
      viewers: 8940,
      cvr: "4.1%",
    },
  ]);

  const handleExecuteImport = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      let rowCount = 0;
      let targetTable = "";

      if (importSource === "TIKTOK_GO") {
        if (activeGoDataset === "GO_VIDEO") {
          rowCount = videoGoRows.length;
          targetTable = "raw_tiktok_go_videos (ContentAnalysis_VideoList.xlsx)";
        } else if (activeGoDataset === "GO_LIVE_PRODUCTS") {
          rowCount = liveProductGoRows.length;
          targetTable = "raw_tiktok_go_live_products (ContentAnalysis_LIVEProducts.xlsx)";
        } else {
          rowCount = liveRoomGoRows.length;
          targetTable = "raw_tiktok_go_live_rooms (ContentAnalysis_LIVERooms.xlsx)";
        }
      } else {
        if (activeDataset === "VIDEO") {
          rowCount = videoRows.length;
          targetTable = "raw_data_videos";
        } else if (activeDataset === "LIVE") {
          rowCount = liveRows.length;
          targetTable = "raw_data_lives";
        } else {
          rowCount = salesRows.length;
          targetTable = "raw_data_sales";
        }
      }

      setImportSuccess(
        `Sukses! ${rowCount} baris data berhasil diimpor dan teratribusi ke tabel ${targetTable}.`
      );
      setTimeout(() => setImportSuccess(null), 5000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {importSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{importSuccess}</span>
          </div>
          <button
            type="button"
            onClick={() => setImportSuccess(null)}
            className="text-emerald-600 hover:text-emerald-800 text-xs font-bold"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-600" />
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Import Raw Data Ingestion (TikTok Shop &amp; TikTok Go)
          </h1>
        </div>
        <p className="text-xs text-slate-500">
          Unggah file Excel ekspor resmi Partner Center untuk otomatis mengisi data atribusi omzet, voucher, dan awareness kreator.
        </p>
      </div>

      {/* Platform Source Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setImportSource("TIKTOK_GO")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
            importSource === "TIKTOK_GO"
              ? "bg-emerald-600 text-white"
              : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/90"
          }`}
        >
          <MapPin className="w-4 h-4 text-emerald-300" />
          <span>TikTok Go Partner Center (ContentAnalysis Exports)</span>
        </button>

        <button
          type="button"
          onClick={() => setImportSource("TIKTOK_SHOP")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
            importSource === "TIKTOK_SHOP"
              ? "bg-indigo-600 text-white"
              : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/90"
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-amber-500" />
          <span>TikTok Shop Affiliate (Keranjang Kuning)</span>
        </button>
      </div>

      {/* 3 Dataset Selectors */}
      {importSource === "TIKTOK_GO" ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              key: "GO_VIDEO",
              title: "1. Video List & POI Performance",
              file: "ContentAnalysis_VideoList_*.xlsx",
              table: "raw_tiktok_go_videos",
              icon: Video,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
              count: `${videoGoRows.length} Video`,
            },
            {
              key: "GO_LIVE_PRODUCTS",
              title: "2. LIVE Products Sales Value",
              file: "ContentAnalysis_LIVEProducts_*.xlsx",
              table: "raw_tiktok_go_live_products",
              icon: Store,
              color: "text-teal-600",
              bg: "bg-teal-50",
              count: `${liveProductGoRows.length} Produk Voucher`,
            },
            {
              key: "GO_LIVE_ROOMS",
              title: "3. LIVE Rooms & Redemptions",
              file: "ContentAnalysis_LIVERooms_*.xlsx",
              table: "raw_tiktok_go_live_rooms",
              icon: Radio,
              color: "text-amber-600",
              bg: "bg-amber-50",
              count: `${liveRoomGoRows.length} Sesi Live`,
            },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = activeGoDataset === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveGoDataset(item.key as any)}
                className={clsx(
                  "p-4 rounded-2xl border text-left transition-all relative overflow-hidden",
                  isSelected
                    ? "bg-white border-emerald-600 shadow-md ring-2 ring-emerald-500/10"
                    : "bg-white border-slate-200/90 hover:border-slate-300 shadow-sm"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={clsx("w-8 h-8 rounded-xl flex items-center justify-center", item.bg, item.color)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {item.count}
                  </span>
                </div>
                <h3 className="font-bold text-xs text-slate-900">{item.title}</h3>
                <p className="text-[10px] font-mono text-emerald-700 mt-0.5">{item.file}</p>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              key: "SALES",
              title: "1. Raw Data Sales (GMV & Orders)",
              table: "raw_data_sales",
              icon: DollarSign,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
              count: `${salesRows.length} Order`,
            },
            {
              key: "VIDEO",
              title: "2. Raw Data Video Awareness",
              table: "raw_data_videos",
              icon: Video,
              color: "text-purple-600",
              bg: "bg-purple-50",
              count: `${videoRows.length} Video`,
            },
            {
              key: "LIVE",
              title: "3. Raw Data LIVE Streaming",
              table: "raw_data_lives",
              icon: Radio,
              color: "text-rose-600",
              bg: "bg-rose-50",
              count: `${liveRows.length} Sesi`,
            },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = activeDataset === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveDataset(item.key as any)}
                className={clsx(
                  "p-4 rounded-2xl border text-left transition-all relative overflow-hidden",
                  isSelected
                    ? "bg-white border-indigo-600 shadow-md ring-2 ring-indigo-500/10"
                    : "bg-white border-slate-200/90 hover:border-slate-300 shadow-sm"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={clsx("w-8 h-8 rounded-xl flex items-center justify-center", item.bg, item.color)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {item.count}
                  </span>
                </div>
                <h3 className="font-bold text-xs text-slate-900">{item.title}</h3>
                <p className="text-[10px] font-mono text-slate-400 mt-0.5">{item.table}</p>
              </button>
            );
          })}
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div className="bg-white border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-8 text-center transition-colors shadow-sm space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
          <UploadCloud className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-sm text-slate-900">
            Tarik &amp; Letakkan File Excel Laporan TikTok di Sini
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {importSource === "TIKTOK_GO"
              ? "Format file: ContentAnalysis_VideoList_*.xlsx, ContentAnalysis_LIVEProducts_*.xlsx, atau ContentAnalysis_LIVERooms_*.xlsx."
              : "Format file: Laporan Penjualan, Video, atau Live TikTok Shop Affiliate (.xlsx, .csv)."}
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <label className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white cursor-pointer shadow-sm">
            <span>Pilih File dari Komputer</span>
            <input type="file" accept=".csv, .xlsx, .xls" className="hidden" />
          </label>
          <button
            type="button"
            onClick={handleExecuteImport}
            disabled={isProcessing}
            className={clsx(
              "px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-colors disabled:bg-slate-300",
              importSource === "TIKTOK_GO" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-indigo-600 hover:bg-indigo-700"
            )}
          >
            {isProcessing ? "Memproses Ingestion..." : "Eksekusi Import ke DB"}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Preview Table Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className={clsx("w-4 h-4", importSource === "TIKTOK_GO" ? "text-emerald-600" : "text-indigo-600")} />
            <h4 className="font-bold text-sm text-slate-900">
              Pratinjau Data Ingestion:{" "}
              {importSource === "TIKTOK_GO"
                ? activeGoDataset === "GO_VIDEO"
                  ? "ContentAnalysis_VideoList (raw_tiktok_go_videos)"
                  : activeGoDataset === "GO_LIVE_PRODUCTS"
                  ? "ContentAnalysis_LIVEProducts (raw_tiktok_go_live_products)"
                  : "ContentAnalysis_LIVERooms (raw_tiktok_go_live_rooms)"
                : activeDataset === "VIDEO"
                ? "raw_data_videos"
                : activeDataset === "LIVE"
                ? "raw_data_lives"
                : "raw_data_sales"}
            </h4>
          </div>
          <span className="text-[11px] text-slate-500">
            {importSource === "TIKTOK_GO" ? (
              <>Kunci Atribusi: <strong>location_id (POI)</strong> + <strong>creator_name</strong></>
            ) : (
              <>Kunci Atribusi: <strong>product_id</strong> + <strong>creator_username</strong></>
            )}
          </span>
        </div>

        {/* TIKTOK GO PREVIEW TABLES */}
        {importSource === "TIKTOK_GO" ? (
          <>
            {/* 1. GO_VIDEO PREVIEW */}
            {activeGoDataset === "GO_VIDEO" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                      <th className="py-2.5 px-3">Post ID &amp; Judul</th>
                      <th className="py-2.5 px-3">Industri</th>
                      <th className="py-2.5 px-3">Tag Lokasi (POI)</th>
                      <th className="py-2.5 px-3">Voucher Produk</th>
                      <th className="py-2.5 px-3">Kreator</th>
                      <th className="py-2.5 px-3">Sales Value</th>
                      <th className="py-2.5 px-3">Orders</th>
                      <th className="py-2.5 px-3">Redeemed Value</th>
                      <th className="py-2.5 px-3">Redeemed Qty</th>
                      <th className="py-2.5 px-3">Views</th>
                      <th className="py-2.5 px-3">CVR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {videoGoRows.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 max-w-[200px]">
                          <p className="font-semibold text-slate-900 truncate">{r.postTitle}</p>
                          <span className="font-mono text-[10px] text-slate-400">{r.postId}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                            {r.industry}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                            <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>{r.locationName}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{r.locationId}</span>
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-800">{r.productName}</td>
                        <td className="py-3 px-3 font-semibold text-slate-900">{r.creatorName}</td>
                        <td className="py-3 px-3 font-bold text-emerald-600">{r.salesValue}</td>
                        <td className="py-3 px-3 font-semibold">{r.orders} voucher</td>
                        <td className="py-3 px-3 font-bold text-teal-700">{r.redemptionAmount}</td>
                        <td className="py-3 px-3 font-semibold text-teal-800">{r.redeemedOrders} redeem</td>
                        <td className="py-3 px-3">{r.videoViews.toLocaleString("id-ID")}</td>
                        <td className="py-3 px-3 font-bold text-indigo-600">{r.cvr}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 2. GO_LIVE_PRODUCTS PREVIEW */}
            {activeGoDataset === "GO_LIVE_PRODUCTS" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                      <th className="py-2.5 px-3">Room ID &amp; Sesi Live</th>
                      <th className="py-2.5 px-3">Kreator</th>
                      <th className="py-2.5 px-3">Produk Voucher</th>
                      <th className="py-2.5 px-3">Merchant</th>
                      <th className="py-2.5 px-3">Sales Value</th>
                      <th className="py-2.5 px-3">Orders</th>
                      <th className="py-2.5 px-3">AOV</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {liveProductGoRows.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 max-w-[220px]">
                          <p className="font-semibold text-slate-900 truncate">{r.liveTitle}</p>
                          <span className="font-mono text-[10px] text-slate-400">{r.roomId}</span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-800">{r.creatorName}</td>
                        <td className="py-3 px-3 font-medium text-slate-900">{r.productName}</td>
                        <td className="py-3 px-3 text-slate-600">{r.merchant}</td>
                        <td className="py-3 px-3 font-bold text-emerald-600">{r.salesValue}</td>
                        <td className="py-3 px-3 font-bold text-slate-800">{r.orders} voucher</td>
                        <td className="py-3 px-3 text-slate-600">{r.aov}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 3. GO_LIVE_ROOMS PREVIEW */}
            {activeGoDataset === "GO_LIVE_ROOMS" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                      <th className="py-2.5 px-3">Room ID &amp; Judul Live</th>
                      <th className="py-2.5 px-3">Kreator</th>
                      <th className="py-2.5 px-3">Waktu Mulai</th>
                      <th className="py-2.5 px-3">Durasi</th>
                      <th className="py-2.5 px-3">Sales Value</th>
                      <th className="py-2.5 px-3">Orders</th>
                      <th className="py-2.5 px-3">Redemption Amount</th>
                      <th className="py-2.5 px-3">Redeemed Orders</th>
                      <th className="py-2.5 px-3">Viewers</th>
                      <th className="py-2.5 px-3">CVR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {liveRoomGoRows.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 max-w-[200px]">
                          <p className="font-semibold text-slate-900 truncate">{r.liveTitle}</p>
                          <span className="font-mono text-[10px] text-slate-400">{r.roomId}</span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-800">{r.creatorName}</td>
                        <td className="py-3 px-3 text-slate-500">{r.startTime}</td>
                        <td className="py-3 px-3 font-bold text-slate-700">{r.duration}</td>
                        <td className="py-3 px-3 font-bold text-emerald-600">{r.salesValue}</td>
                        <td className="py-3 px-3 font-bold text-slate-800">{r.orders} voucher</td>
                        <td className="py-3 px-3 font-bold text-teal-700">{r.redemptionAmount}</td>
                        <td className="py-3 px-3 font-bold text-teal-800">{r.redeemedOrders} redeem</td>
                        <td className="py-3 px-3 font-bold text-rose-600">{r.viewers.toLocaleString("id-ID")}</td>
                        <td className="py-3 px-3 font-bold text-indigo-600">{r.cvr}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          /* TIKTOK SHOP PREVIEW TABLES */
          <>
            {/* 1. SALES PREVIEW */}
            {activeDataset === "SALES" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                      <th className="py-2.5 px-3">Order ID</th>
                      <th className="py-2.5 px-3">Product ID</th>
                      <th className="py-2.5 px-3">Kreator</th>
                      <th className="py-2.5 px-3">Sumber</th>
                      <th className="py-2.5 px-3">Qty</th>
                      <th className="py-2.5 px-3">Total GMV</th>
                      <th className="py-2.5 px-3">Estimasi Komisi</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {salesRows.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">{r.orderId}</td>
                        <td className="py-3 px-3 font-mono text-indigo-600">{r.productId}</td>
                        <td className="py-3 px-3 font-semibold text-slate-800">{r.creatorUsername}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                            {r.contentType}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold">{r.quantity}x</td>
                        <td className="py-3 px-3 font-bold text-slate-900">{r.totalGmv}</td>
                        <td className="py-3 px-3 font-bold text-emerald-600">{r.commission}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 2. VIDEO PREVIEW */}
            {activeDataset === "VIDEO" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                      <th className="py-2.5 px-3">Video ID</th>
                      <th className="py-2.5 px-3">Product ID</th>
                      <th className="py-2.5 px-3">Kreator</th>
                      <th className="py-2.5 px-3">Caption</th>
                      <th className="py-2.5 px-3">Views</th>
                      <th className="py-2.5 px-3">Likes</th>
                      <th className="py-2.5 px-3">Retention</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {videoRows.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">{r.videoId}</td>
                        <td className="py-3 px-3 font-mono text-indigo-600">{r.productId}</td>
                        <td className="py-3 px-3 font-semibold text-slate-800">{r.creatorUsername}</td>
                        <td className="py-3 px-3 max-w-xs truncate">{r.caption}</td>
                        <td className="py-3 px-3 font-bold text-slate-900">{r.views.toLocaleString("id-ID")}</td>
                        <td className="py-3 px-3">{r.likes.toLocaleString("id-ID")}</td>
                        <td className="py-3 px-3 font-bold text-indigo-600">{r.retention}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 3. LIVE PREVIEW */}
            {activeDataset === "LIVE" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                      <th className="py-2.5 px-3">Live Room ID</th>
                      <th className="py-2.5 px-3">Product ID</th>
                      <th className="py-2.5 px-3">Kreator</th>
                      <th className="py-2.5 px-3">Judul Sesi Live</th>
                      <th className="py-2.5 px-3">Durasi</th>
                      <th className="py-2.5 px-3">Total Views</th>
                      <th className="py-2.5 px-3">Peak (PCU)</th>
                      <th className="py-2.5 px-3">Klik Keranjang</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {liveRows.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">{r.liveRoomId}</td>
                        <td className="py-3 px-3 font-mono text-indigo-600">{r.productId}</td>
                        <td className="py-3 px-3 font-semibold text-slate-800">{r.creatorUsername}</td>
                        <td className="py-3 px-3 max-w-xs truncate">{r.liveTitle}</td>
                        <td className="py-3 px-3 font-semibold">{r.durationMinutes} Menit</td>
                        <td className="py-3 px-3 font-bold text-slate-900">{r.totalViews.toLocaleString("id-ID")}</td>
                        <td className="py-3 px-3 font-bold text-rose-600">{r.peakViewers}</td>
                        <td className="py-3 px-3 font-bold text-emerald-600">{r.productClicks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
