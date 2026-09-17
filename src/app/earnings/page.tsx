"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Wallet,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Download,
  Building,
  CreditCard,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import clsx from "clsx";

interface CommissionItem {
  id: string;
  campaignTitle: string;
  brandName: string;
  commissionRate: string;
  unitsSold: number;
  totalGMV: string;
  commissionAmount: string;
  status: "SIAP_DICAIRKAN" | "DIPROSES" | "DITRANSFER";
  payoutDate: string;
}

const mockCommissions: CommissionItem[] = [
  {
    id: "1",
    campaignTitle: "[AFFILIATE CIRCLE] SEPTEMBER - [BAU] [SEP-OCT] TWC",
    brandName: "Wardah",
    commissionRate: "18%",
    unitsSold: 58,
    totalGMV: "Rp 6.960.000",
    commissionAmount: "Rp 1.252.800",
    status: "SIAP_DICAIRKAN",
    payoutDate: "Jumat, 19 Sep 2026",
  },
  {
    id: "2",
    campaignTitle: "[AFFILIATE CIRCLE] RTP IG STORY MAKE OVER CHALLENGE! 📱🔥",
    brandName: "Make Over",
    commissionRate: "20%",
    unitsSold: 34,
    totalGMV: "Rp 4.760.000",
    commissionAmount: "Rp 952.000",
    status: "DIPROSES",
    payoutDate: "Estimasi 26 Sep 2026",
  },
  {
    id: "3",
    campaignTitle: "Aggregator Kahf X Qarrar - Men Care Grooming Series",
    brandName: "Kahf",
    commissionRate: "15%",
    unitsSold: 22,
    totalGMV: "Rp 2.420.000",
    commissionAmount: "Rp 363.000",
    status: "DITRANSFER",
    payoutDate: "12 Sep 2026 (Sukses)",
  },
  {
    id: "4",
    campaignTitle: "[AFFILIATE CIRCLE] PUTRI 15 DAYS CHALLENGE: ROAD TO PAYDAY!",
    brandName: "putri",
    commissionRate: "15%",
    unitsSold: 28,
    totalGMV: "Rp 1.680.000",
    commissionAmount: "Rp 252.000",
    status: "DITRANSFER",
    payoutDate: "05 Sep 2026 (Sukses)",
  },
];

export default function EarningsPage() {
  const [filterTab, setFilterTab] = useState("SEMUA");

  const filteredItems = mockCommissions.filter((item) => {
    if (filterTab === "SIAP" && item.status !== "SIAP_DICAIRKAN") return false;
    if (filterTab === "DIPROSES" && item.status !== "DIPROSES") return false;
    if (filterTab === "DITRANSFER" && item.status !== "DITRANSFER") return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="space-y-1">
        <span className="text-xs text-slate-400 font-medium">Finansial &amp; Royalti</span>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Komisi Saya
        </h1>
        <p className="text-xs text-slate-500">
          Pantau akumulasi komisi penjualan keranjang kuning TikTok Shop kamu dan riwayat pencairan ke rekening bank.
        </p>
      </div>

      {/* 3 Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Total Komisi Bulan Ini */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Komisi Bulan Ini</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Rp 2.819.800</h2>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.5% dari bulan lalu</span>
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
            <h2 className="text-2xl font-black text-slate-900">Rp 15.820.000</h2>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              142 produk terjual lewat keranjang kuning
            </p>
          </div>
        </div>

        {/* Card 3: Komisi Telah Dicairkan */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Telah Dicairkan</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Rp 615.000</h2>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              Ditransfer sukses ke BCA 8832216606
            </p>
          </div>
        </div>
      </div>

      {/* Box Rekening Tujuan Payout */}
      <div className="bg-gradient-to-r from-indigo-50/60 via-purple-50/40 to-white border border-indigo-100 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white border border-indigo-200 flex items-center justify-center text-indigo-700 font-black text-xs shadow-sm shrink-0">
            BCA
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-900">Rekening Pencairan Utama</span>
              <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-700">
                Terverifikasi
              </span>
            </div>
            <p className="text-xs text-slate-700 font-medium">
              BANK CENTRAL ASIA • 8832216606 a/n Hibban Nazala
            </p>
            <p className="text-[11px] text-slate-400">
              Pencairan otomatis diproses agensi setiap hari Jumat langsung ke rekening ini tanpa potongan admin.
            </p>
          </div>
        </div>

        <Link
          href="/profile"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm shrink-0"
        >
          <span>Kelola Rekening</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </Link>
      </div>

      {/* Riwayat Komisi & Penjualan Campaign */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-sm text-slate-900">
            Rincian Komisi per Campaign
          </h3>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { key: "SEMUA", label: "Semua" },
              { key: "SIAP", label: "Siap Ditransfer" },
              { key: "DIPROSES", label: "Dalam Validasi" },
              { key: "DITRANSFER", label: "Berhasil Ditransfer" },
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
                <th className="pb-3 font-semibold text-center">Komisi Rate</th>
                <th className="pb-3 font-semibold text-center">Produk Terjual</th>
                <th className="pb-3 font-semibold text-right">Total GMV</th>
                <th className="pb-3 font-semibold text-right">Pendapatan Komisi</th>
                <th className="pb-3 font-semibold text-right">Status Payout</th>
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
                    {c.status === "SIAP_DICAIRKAN" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3" />
                        <span>Siap Ditransfer</span>
                      </span>
                    )}
                    {c.status === "DIPROSES" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        <Clock className="w-3 h-3" />
                        <span>Validasi TikTok</span>
                      </span>
                    )}
                    {c.status === "DITRANSFER" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Berhasil Ditransfer</span>
                      </span>
                    )}
                    <p className="text-[10px] text-slate-400 mt-0.5">{c.payoutDate}</p>
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
