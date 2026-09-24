"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Wallet,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Info,
  Smartphone,
  Tag,
} from "lucide-react";
import clsx from "clsx";

interface CommissionItem {
  id: string;
  campaignTitle: string;
  brandName: string;
  productId: string;
  commissionRate: string;
  unitsSold: number;
  totalGMV: string;
  commissionAmount: string;
  status: "TERSETTLE_TIKTOK" | "VALIDASI_TIKTOK" | "SELESAI";
  tiktokStatusText: string;
}

const mockCommissions: CommissionItem[] = [
  {
    id: "1",
    campaignTitle: "[MAKE OVER] Velvet Mattifying Cushion Special 9.9",
    brandName: "Make Over Indonesia",
    productId: "172981928391",
    commissionRate: "18%",
    unitsSold: 7,
    totalGMV: "Rp 1.295.000",
    commissionAmount: "Rp 233.100",
    status: "TERSETTLE_TIKTOK",
    tiktokStatusText: "Tersettle di Saldo TikTok",
  },
  {
    id: "2",
    campaignTitle: "[AFFILIATE CIRCLE] SEPTEMBER - [BAU] [SEP-OCT] TWC",
    brandName: "Wardah",
    productId: "172981928395",
    commissionRate: "18%",
    unitsSold: 58,
    totalGMV: "Rp 6.960.000",
    commissionAmount: "Rp 1.252.800",
    status: "TERSETTLE_TIKTOK",
    tiktokStatusText: "Tersettle di Saldo TikTok",
  },
  {
    id: "3",
    campaignTitle: "[AFFILIATE CIRCLE] RTP IG STORY MAKE OVER CHALLENGE! 📱🔥",
    brandName: "Make Over",
    productId: "172981928396",
    commissionRate: "20%",
    unitsSold: 34,
    totalGMV: "Rp 4.760.000",
    commissionAmount: "Rp 952.000",
    status: "VALIDASI_TIKTOK",
    tiktokStatusText: "Menunggu Masa Retur (7 Hari)",
  },
  {
    id: "4",
    campaignTitle: "Aggregator Kahf X Qarrar - Men Care Grooming Series",
    brandName: "Kahf",
    productId: "172981928397",
    commissionRate: "15%",
    unitsSold: 22,
    totalGMV: "Rp 2.420.000",
    commissionAmount: "Rp 363.000",
    status: "SELESAI",
    tiktokStatusText: "Pencairan Sukses via TikTok",
  },
];

export default function EarningsPage() {
  const [filterTab, setFilterTab] = useState("SEMUA");

  const filteredItems = mockCommissions.filter((item) => {
    if (filterTab === "TERSETTLE" && item.status !== "TERSETTLE_TIKTOK") return false;
    if (filterTab === "VALIDASI" && item.status !== "VALIDASI_TIKTOK") return false;
    if (filterTab === "SELESAI" && item.status !== "SELESAI") return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="space-y-1">
        <span className="text-xs text-slate-400 font-medium">Finansial &amp; Transparansi Performa</span>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Perkiraan Komisi &amp; Penjualan
        </h1>
        <p className="text-xs text-slate-500">
          Pantau akumulasi penjualan keranjang kuning dan estimasi komisi per campaign. Komisi riil langsung masuk ke saldo akun TikTok Anda masing-masing.
        </p>
      </div>

      {/* 3 Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Total Perkiraan Komisi */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Perkiraan Komisi Bulan Ini</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Rp 2.800.900</h2>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.5% dari campaign bulan lalu</span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Penjualan GMV */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total GMV Penjualan</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Rp 15.435.000</h2>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              121 produk terjual via keranjang kuning &amp; LIVE
            </p>
          </div>
        </div>

        {/* Card 3: Status Penarikan di TikTok */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pencairan Langsung</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Aplikasi TikTok</h2>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Komisi otomatis masuk ke saldo TikTok Creator / Shop Anda
            </p>
          </div>
        </div>
      </div>

      {/* Banner Penjelasan Alur Komisi TikTok */}
      <div className="bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-white border border-indigo-100 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0 shadow-sm mt-0.5">
            <Info className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-900">Bagaimana Komisi Dicairkan?</span>
              <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-indigo-100 text-indigo-700">
                Sistem Resmi TikTok
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
              Nominal komisi di atas adalah <strong>estimasi resmi</strong> hasil penjualan produk campaign. Seluruh dana riil akan ditransfer langsung oleh TikTok ke <strong>Saldo TikTok Affiliate Anda</strong> setelah masa retur pesanan (biasanya 6–7 hari setelah produk diterima pembeli).
            </p>
          </div>
        </div>

        <a
          href="https://www.tiktok.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white shadow-sm shrink-0 transition-colors"
        >
          <span>Cek Saldo di TikTok</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>
      </div>

      {/* Riwayat Komisi & Penjualan Campaign */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-sm text-slate-900">
            Rincian Estimasi Komisi &amp; GMV per Campaign
          </h3>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { key: "SEMUA", label: "Semua" },
              { key: "TERSETTLE", label: "Tersettle di TikTok" },
              { key: "VALIDASI", label: "Dalam Validasi" },
              { key: "SELESAI", label: "Selesai" },
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setFilterTab(t.key)}
                className={clsx(
                  "px-3 py-1.5 rounded-xl font-semibold transition-colors",
                  filterTab === t.key
                    ? "bg-indigo-50 text-indigo-600 font-bold"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabel Komisi */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-semibold">
                <th className="pb-3 font-semibold">Campaign &amp; Brand</th>
                <th className="pb-3 font-semibold text-center">Product ID</th>
                <th className="pb-3 font-semibold text-center">Komisi Rate</th>
                <th className="pb-3 font-semibold text-center">Terjual</th>
                <th className="pb-3 font-semibold text-right">Total GMV</th>
                <th className="pb-3 font-semibold text-right">Perkiraan Komisi</th>
                <th className="pb-3 font-semibold text-right">Status di TikTok</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 pr-4">
                    <p className="font-bold text-slate-900 line-clamp-1">{c.campaignTitle}</p>
                    <span className="text-[11px] text-slate-400 font-medium">{c.brandName}</span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-semibold">
                      {c.productId}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-indigo-600 border border-purple-200">
                      {c.commissionRate}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center font-semibold text-slate-700">
                    {c.unitsSold} pcs
                  </td>
                  <td className="py-3.5 px-3 text-right font-semibold text-slate-800">
                    {c.totalGMV}
                  </td>
                  <td className="py-3.5 px-3 text-right font-black text-indigo-600 text-sm">
                    {c.commissionAmount}
                  </td>
                  <td className="py-3.5 pl-3 text-right">
                    {c.status === "TERSETTLE_TIKTOK" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Tersettle</span>
                      </span>
                    )}
                    {c.status === "VALIDASI_TIKTOK" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3" />
                        <span>Validasi Pesanan</span>
                      </span>
                    )}
                    {c.status === "SELESAI" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Selesai</span>
                      </span>
                    )}
                    <p className="text-[10px] text-slate-400 mt-0.5">{c.tiktokStatusText}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
