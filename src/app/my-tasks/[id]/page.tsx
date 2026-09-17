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
} from "lucide-react";
import { initialCreatorTasks } from "@/lib/tasks-data";
import clsx from "clsx";

export default function CampaignDetailPage() {
  const params = useParams();
  const taskId = params.id as string;
  const task = initialCreatorTasks.find((t) => t.id === taskId) || initialCreatorTasks[0];

  const [activeTab, setActiveTab] = useState<"INFORMASI" | "TUGAS" | "PANDUAN">("INFORMASI");
  const [copied, setCopied] = useState(false);

  const copyHashtags = () => {
    navigator.clipboard.writeText(task.mandatoryHashtags.join(" "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      <div className="flex items-center gap-2">
        {[
          { key: "INFORMASI", label: "Informasi" },
          { key: "TUGAS", label: "Tugas" },
          { key: "PANDUAN", label: "Panduan" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as any)}
            className={clsx(
              "px-5 py-1.5 rounded-full text-xs font-semibold transition-colors",
              activeTab === tab.key
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-600 hover:bg-slate-100"
            )}
          >
            {tab.label}
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
                <span>banibanzl</span>
              </div>
            </div>

            {/* Status pendaftaran */}
            <div className="space-y-1">
              <span className="text-slate-400 block text-[11px]">Status pendaftaran:</span>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  Ditinjau
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

      {/* TAB 3: PANDUAN */}
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
