"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Wallet,
  TrendingUp,
  CheckCircle2,
  Clock,
  ShoppingBag,
  Info,
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

const mockCommissions: CommissionItem[] = [];

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
            <h2 className="text-2xl font-black text-slate-900">Rp 0</h2>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium mt-1">
              <Info className="w-3.5 h-3.5" />
              <span>Belum ada estimasi komisi baru</span>
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
            <h2 className="text-2xl font-black text-slate-900">Rp 0</h2>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              Akumulasi penjualan keranjang kuning &amp; voucher
            </p>
          </div>
        </div>

        {/* Card 3: Total Terjual */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Produk Terjual</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">0 Unit</h2>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              Dari seluruh tugas campaign yang aktif
            </p>
          </div>
        </div>
      </div>

      {/* Info Banner TikTok Direct Settlement */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
              Settlement Resmi TikTok Shop &amp; TikTok Go
            </span>
          </div>
          <h3 className="text-lg font-bold">
            Komisi Langsung Diterima di Saldo Akun TikTok Kamu
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Data di atas adalah perkiraan omset dan komisi berdasarkan penayangan konten tugas. Saldo dan penarikan tunai (withdraw) riil langsung dikelola dan dicairkan oleh sistem resmi TikTok ke rekening kamu.
          </p>
        </div>
      </div>

      {/* History Breakdown Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Rincian Komisi per Campaign</h3>
            <p className="text-xs text-slate-400">Daftar produk, persentase rate, dan status pencairan saldo</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs">
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
        {filteredItems.length > 0 ? (
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
        ) : (
          <div className="py-12 text-center space-y-2">
            <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">Belum Ada Riwayat Penjualan</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Posting konten keranjang kuning atau review voucher TikTok Go untuk mulai melihat data performa dan estimasi komisi di sini.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
