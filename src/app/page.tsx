"use client";

import React, { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  X,
  Sparkles,
} from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { CampaignCard, CampaignData } from "@/components/campaign/CampaignCard";

// Mock data riil campaign seperti di Gro Creator (Putri, Wardah, Make Over, Kahf)
const initialCampaigns: CampaignData[] = [
  {
    id: "1",
    title: "[AFFILIATE CIRCLE] PUTRI 15 DAYS CHALLENGE: ROAD TO PAYDAY!",
    brandName: "putri",
    category: "Hair & Body",
    bannerUrl: "",
    commissionType: "COMMISSION_ONLY",
    commissionRateText: "Komisi 15%",
    isFreeSample: false,
    sampleQuota: 100,
    sampleStockRemaining: 100,
    startDate: "15 Sep 2026",
    endDate: "30 Sep 2026",
    daysRemaining: 13,
    mandatoryHashtags: ["#PutriHairCare", "#RoadToPayday", "#HairRoutine"],
    mandatoryMentions: ["@putri.indonesia"],
    sowItems: [
      "Wajib video durasi minimal 30 detik",
      "Tampilkan produk Putri Hair Care dengan jelas di video",
      "Sertakan link keranjang kuning resmi",
      "Posting video sebelum 30 Sep 2026",
    ],
  },
  {
    id: "2",
    title: "[AFFILIATE CIRCLE] SEPTEMBER - [BAU] [SEP-OCT] TWC",
    brandName: "Wardah",
    category: "Beauty & Skincare",
    bannerUrl: "",
    commissionType: "COMMISSION_ONLY",
    commissionRateText: "Komisi 18%",
    isFreeSample: true,
    sampleQuota: 100,
    sampleStockRemaining: 100,
    startDate: "16 Sep 2026",
    endDate: "11 Nov 2026",
    daysRemaining: 55,
    mandatoryHashtags: ["#WardahBeauty", "#TwoWayCake", "#SkinVerse"],
    mandatoryMentions: ["@wardahbeauty"],
    sowItems: [
      "Review coverage Two Way Cake di kulit",
      "Angle video natural daylight",
      "Wajib menyematkan link keranjang kuning resmi",
    ],
  },
  {
    id: "3",
    title: "[AFFILIATE CIRCLE] RACING CONTENT WARDAH SKINVERSE - SKIN LONGEVITY [NO SEEDING]",
    brandName: "Wardah",
    category: "Beauty & Skincare",
    bannerUrl: "",
    commissionType: "COMMISSION_ONLY",
    commissionRateText: "Komisi 20%",
    isFreeSample: false,
    sampleQuota: 1000,
    sampleStockRemaining: 779,
    startDate: "16 Sep 2026",
    endDate: "06 Oct 2026",
    daysRemaining: 19,
    mandatoryHashtags: ["#WardahSkinverse", "#SkinLongevity", "#GlowSeharian"],
    mandatoryMentions: ["@wardahbeauty"],
    sowItems: [
      "Edukasi konsep Skin Longevity Wardah",
      "Durasi video 45 - 60 detik",
      "Klaim produk teruji klinis",
    ],
  },
  {
    id: "4",
    title: "[AFFILIATE CIRCLE] SEPTEMBER - [THREADS] [NEW LAUNCH] STAYLOCK NEW SHADES PHASE 2",
    brandName: "Wardah",
    category: "Beauty & Makeup",
    bannerUrl: "",
    commissionType: "COMMISSION_ONLY",
    commissionRateText: "Komisi 18%",
    isFreeSample: true,
    sampleQuota: 100,
    sampleStockRemaining: 100,
    startDate: "16 Sep 2026",
    endDate: "10 Oct 2026",
    daysRemaining: 23,
    mandatoryHashtags: ["#StaylockLip", "#NewShades", "#WardahLipCream"],
    mandatoryMentions: ["@wardahbeauty"],
    sowItems: [
      "Swatch seluruh shade baru Staylock",
      "Uji transferproof & ketahanan bibir",
      "Sertakan link keranjang kuning produk",
    ],
  },
  {
    id: "5",
    title: "[AFFILIATE CIRCLE] RTP IG STORY MAKE OVER CHALLENGE! 📱🔥",
    brandName: "Make Over",
    category: "Beauty & Makeup",
    bannerUrl: "",
    commissionType: "COMMISSION_ONLY",
    commissionRateText: "Komisi 20%",
    isFreeSample: true,
    sampleQuota: 200,
    sampleStockRemaining: 45,
    startDate: "10 Sep 2026",
    endDate: "28 Sep 2026",
    daysRemaining: 11,
    mandatoryHashtags: ["#MakeOverID", "#PowerstayComplexion", "#MakeOverChallenge"],
    mandatoryMentions: ["@makeoverid"],
    sowItems: [
      "Unggah transisi make-up look menggunakan produk Make Over",
      "Tampilkan ketahanan shade 12 jam",
      "Sertakan link keranjang kuning resmi",
    ],
  },
  {
    id: "6",
    title: "Aggregator Kahf X Qarrar - Men Care Grooming Series",
    brandName: "Kahf",
    category: "Men Grooming",
    bannerUrl: "",
    commissionType: "COMMISSION_ONLY",
    commissionRateText: "Komisi 15%",
    isFreeSample: true,
    sampleQuota: 150,
    sampleStockRemaining: 150,
    startDate: "01 Sep 2026",
    endDate: "30 Sep 2026",
    daysRemaining: 13,
    mandatoryHashtags: ["#KahfEveryday", "#KahfMenCare", "#JalanYangKupilih"],
    mandatoryMentions: ["@kahfeveryday"],
    sowItems: [
      "Tutorial grooming harian pria menggunakan Kahf Face Wash & Sunscreen",
      "Tone video aktif dan natural",
      "Sematkan link keranjang kuning afiliasi",
    ],
  },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("Semua");
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  // Filter State
  const {
    isOpen: isFilterOpen,
    onOpen: onOpenFilter,
    onOpenChange: onFilterChange,
  } = useDisclosure();

  const [paymentModel, setPaymentModel] = useState("Semua");
  const [freeSampleFilter, setFreeSampleFilter] = useState("Semua");
  const [quotaStatus, setQuotaStatus] = useState("Semua");

  // Filter count indicator
  const activeFilterCount =
    (paymentModel !== "Semua" ? 1 : 0) +
    (freeSampleFilter !== "Semua" ? 1 : 0) +
    (quotaStatus !== "Semua" ? 1 : 0);

  const resetFilters = () => {
    setPaymentModel("Semua");
    setFreeSampleFilter("Semua");
    setQuotaStatus("Semua");
  };

  const filteredCampaigns = initialCampaigns.filter((campaign) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = campaign.title.toLowerCase().includes(q);
      const matchBrand = campaign.brandName.toLowerCase().includes(q);
      const matchCategory = campaign.category.toLowerCase().includes(q);
      if (!matchTitle && !matchBrand && !matchCategory) return false;
    }

    // Free sample
    if (freeSampleFilter === "Ya" && !campaign.isFreeSample) return false;
    if (freeSampleFilter === "Tidak" && campaign.isFreeSample) return false;

    // Quota
    if (quotaStatus === "Available" && campaign.sampleStockRemaining <= 0) return false;
    if (quotaStatus === "Full" && campaign.sampleStockRemaining > 0) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title Header (Gro Creator exact style) */}
      <div className="space-y-0.5">
        <span className="text-xs text-slate-400 font-medium">Beranda</span>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Beranda
        </h1>
      </div>

      {/* Search & Filter Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-xl">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari campaign atau nama brand"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Filter Button with active indicator */}
          <button
            type="button"
            onClick={onOpenFilter}
            className="relative flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
            )}
          </button>

          {/* Date Filter Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDateDropdown(!showDateDropdown)}
              className="flex items-center gap-1 text-xs text-slate-500 cursor-pointer hover:text-slate-800"
            >
              <span>Diposting:</span>
              <span className="font-bold text-indigo-600 flex items-center gap-0.5">
                {dateFilter}
                <ChevronDown className="w-3.5 h-3.5" />
              </span>
            </button>

            {showDateDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 text-xs">
                {["Semua", "7 Hari yang lalu", "30 Hari yang lalu"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setDateFilter(item);
                      setShowDateDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 font-medium"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2-Column Campaign Cards Grid */}
      {filteredCampaigns.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-800">Tidak ada campaign yang sesuai</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Coba sesuaikan kata kunci pencarian atau reset filter untuk melihat seluruh campaign yang tersedia.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 text-xs font-bold hover:bg-indigo-100 transition-colors"
          >
            Reset Semua Filter
          </button>
        </div>
      )}

      {/* Filter Modal (Exact Gro Creator Popup Structure) */}
      <Modal
        isOpen={isFilterOpen}
        onOpenChange={onFilterChange}
        size="md"
        placement="center"
        backdrop="blur"
      >
        <ModalContent className="bg-white text-slate-900 border border-slate-200 shadow-2xl rounded-2xl">
          {(onClose) => (
            <>
              <ModalHeader className="border-b border-slate-100 flex items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-bold text-slate-900">Filter Campaign</span>
                </div>
              </ModalHeader>

              <ModalBody className="py-4 space-y-4 text-xs">
                {/* 1. Model Pembayaran */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 text-xs block">Model Pembayaran</label>
                  <div className="flex flex-wrap gap-1.5">
                    {["Semua", "Commission Only", "Fixed Rate", "Open Rate"].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setPaymentModel(m)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                          paymentModel === m
                            ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Sampel Produk */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 text-xs block">Sampel Produk Gratis</label>
                  <div className="flex gap-2">
                    {["Semua", "Ya", "Tidak"].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFreeSampleFilter(s)}
                        className={`px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                          freeSampleFilter === s
                            ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Status Kuota */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 text-xs block">Status Kuota</label>
                  <div className="flex gap-2">
                    {["Semua", "Available", "Full"].map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setQuotaStatus(q)}
                        className={`px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                          quotaStatus === q
                            ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

              </ModalBody>

              <ModalFooter className="border-t border-slate-100 flex items-center justify-between py-3">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-100"
                >
                  Reset
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Tutup
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-1.5 rounded-xl bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700 shadow-sm"
                  >
                    Terapkan
                  </button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
