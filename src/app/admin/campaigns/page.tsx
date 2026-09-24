"use client";

import React, { useState } from "react";
import {
  Layers,
  Plus,
  Tag,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Search,
  MapPin,
  ShoppingBag,
  Store,
  Ticket,
} from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import clsx from "clsx";

interface CampaignAdminItem {
  id: string;
  title: string;
  brandName: string;
  platformType?: "TIKTOK_SHOP" | "TIKTOK_GO";
  locationId?: string;
  locationName?: string;
  industryCategory?: string;
  benefitType?: "VOUCHER_DIGITAL" | "OUTLET_PASS_LINK";
  benefitData?: string;
  productId: string;
  commissionRate: string;
  sampleQuota: number;
  approvedCount: number;
  deadlineDate: string;
  status: "ACTIVE" | "DRAFT" | "COMPLETED";
  hashtags: string[];
}

const initialCampaigns: CampaignAdminItem[] = [
  {
    id: "1",
    title: "[MAKE OVER] Velvet Mattifying Cushion Special 9.9",
    brandName: "Make Over Indonesia",
    platformType: "TIKTOK_SHOP",
    productId: "172981928391",
    commissionRate: "18%",
    sampleQuota: 100,
    approvedCount: 42,
    deadlineDate: "30 Sep 2026",
    status: "ACTIVE",
    hashtags: ["#MakeOver99", "#VelvetCushion", "#Creavy"],
  },
  {
    id: "2",
    title: "[EMINA] Glossy Tinted Glow Balm x Daily Fresh",
    brandName: "Emina Cosmetics",
    platformType: "TIKTOK_SHOP",
    productId: "172981928392",
    commissionRate: "15%",
    sampleQuota: 50,
    approvedCount: 18,
    deadlineDate: "05 Oct 2026",
    status: "ACTIVE",
    hashtags: ["#EminaGlowBalm", "#DailySchoolLook", "#Creavy"],
  },
  {
    id: "3",
    title: "[KAHF] Oil and Acne Care Face Wash Seeding",
    brandName: "Kahf Men",
    platformType: "TIKTOK_SHOP",
    productId: "172981928393",
    commissionRate: "20%",
    sampleQuota: 80,
    approvedCount: 35,
    deadlineDate: "30 Sep 2026",
    status: "ACTIVE",
    hashtags: ["#KahfMen", "#AcneCareFaceWash", "#Creavy"],
  },
  {
    id: "4",
    title: "[SKINTIFIC] 5X Ceramide Barrier Repair Moisture Gel",
    brandName: "Skintific Indonesia",
    platformType: "TIKTOK_SHOP",
    productId: "172981928394",
    commissionRate: "16%",
    sampleQuota: 60,
    approvedCount: 60,
    deadlineDate: "10 Oct 2026",
    status: "COMPLETED",
    hashtags: ["#SkintificID", "#5XCeramide", "#Creavy"],
  },
  {
    id: "5",
    title: "[SOLARIA] Weekend Dine-in Feast Voucher Promo - Gandaria City",
    brandName: "Solaria Indonesia",
    platformType: "TIKTOK_GO",
    locationId: "loc_solaria_gandaria_6912",
    locationName: "Solaria - Mall Gandaria City, Jakarta Selatan",
    industryCategory: "Dining",
    benefitType: "VOUCHER_DIGITAL",
    benefitData: "SOLARIA-VIP-VOUCHER",
    productId: "172989182390",
    commissionRate: "15%",
    sampleQuota: 100,
    approvedCount: 48,
    deadlineDate: "15 Oct 2026",
    status: "ACTIVE",
    hashtags: ["#SolariaID", "#SolariaGandaria", "#TikTokGoFood", "#Creavy"],
  },
  {
    id: "6",
    title: "[PULLMAN HOTEL] Staycation Deluxe & Weekend Buffet Brunch",
    brandName: "Pullman Hotels & Resorts",
    platformType: "TIKTOK_GO",
    locationId: "loc_pullman_cp_8819",
    locationName: "Pullman Jakarta Central Park",
    industryCategory: "Accommodations",
    benefitType: "OUTLET_PASS_LINK",
    benefitData: "https://docs.google.com/spreadsheets/d/creavy-pullman-pass",
    productId: "172989182399",
    commissionRate: "12%",
    sampleQuota: 50,
    approvedCount: 32,
    deadlineDate: "20 Oct 2026",
    status: "ACTIVE",
    hashtags: ["#PullmanJakarta", "#StaycationJakarta", "#Creavy"],
  },
];

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignAdminItem[]>(initialCampaigns);
  const [searchQuery, setSearchQuery] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Form State
  const [newCampaign, setNewCampaign] = useState({
    title: "",
    brandName: "",
    platformType: "TIKTOK_SHOP" as "TIKTOK_SHOP" | "TIKTOK_GO",
    locationId: "",
    locationName: "",
    industryCategory: "Dining",
    benefitType: "VOUCHER_DIGITAL" as "VOUCHER_DIGITAL" | "OUTLET_PASS_LINK",
    benefitData: "",
    productId: "",
    commissionRate: "15%",
    sampleQuota: 50,
    deadlineDate: "15 Oct 2026",
    hashtags: "#CreavyCampaign, #ReviewJujur",
    mentions: "@brand_official",
    sow: "Durasi minimal 30 detik\nTautkan keranjang kuning / voucher\nPencahayaan jelas",
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleCreateCampaign = (onClose: () => void) => {
    if (!newCampaign.title || !newCampaign.productId || !newCampaign.brandName) {
      alert("Harap lengkapi Judul, Brand, dan TikTok Product ID!");
      return;
    }

    const created: CampaignAdminItem = {
      id: `camp-${Date.now()}`,
      title: newCampaign.title,
      brandName: newCampaign.brandName,
      platformType: newCampaign.platformType,
      locationId: newCampaign.locationId,
      locationName: newCampaign.locationName,
      industryCategory: newCampaign.industryCategory,
      benefitType: newCampaign.benefitType,
      benefitData: newCampaign.benefitData,
      productId: newCampaign.productId,
      commissionRate: newCampaign.commissionRate,
      sampleQuota: Number(newCampaign.sampleQuota),
      approvedCount: 0,
      deadlineDate: newCampaign.deadlineDate,
      status: "ACTIVE",
      hashtags: newCampaign.hashtags.split(",").map((h) => h.trim()),
    };

    setCampaigns([created, ...campaigns]);
    onClose();
    setToastMessage(`Campaign "${created.title}" berhasil dibuat dan Product ID ${created.productId} berhasil dikunci!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredCampaigns = campaigns.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.productId.includes(searchQuery) ||
      c.locationName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-600 hover:text-emerald-800 text-xs font-bold"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Manajemen Campaign Brand
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kelola katalog kampanye agensi, batas sampel gratis, dan kuncian TikTok Shop Product ID.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Campaign Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari campaign, brand, atau Product ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 w-full sm:w-auto justify-end">
          <span>Total: <strong>{filteredCampaigns.length} Campaign</strong></span>
        </div>
      </div>

      {/* Campaign Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                <th className="py-3 px-4">Campaign &amp; Brand</th>
                <th className="py-3 px-3">TikTok Product ID</th>
                <th className="py-3 px-3 text-center">Komisi</th>
                <th className="py-3 px-3 text-center">Kuota Sampel</th>
                <th className="py-3 px-3">Batas Waktu</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredCampaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="font-bold text-slate-900 truncate">{camp.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-slate-500 font-medium">{camp.brandName}</span>
                      {camp.platformType === "TIKTOK_GO" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          <span>TikTok Go</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          <ShoppingBag className="w-3 h-3 text-amber-500" />
                          <span>TikTok Shop</span>
                        </span>
                      )}
                    </div>
                    {camp.locationName && (
                      <p className="text-[10px] text-emerald-800 font-semibold truncate mt-0.5">
                        📍 {camp.locationName}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {camp.hashtags.map((h) => (
                        <span key={h} className="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded font-medium">
                          {h}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="inline-flex items-center gap-1 font-mono font-bold text-xs text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                      <Tag className="w-3 h-3 text-indigo-500" />
                      <span>{camp.productId}</span>
                    </div>
                    {camp.locationId && (
                      <span className="block text-[10px] font-mono text-emerald-700 mt-1">
                        POI: {camp.locationId}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      {camp.commissionRate}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <div className="font-bold text-slate-800">
                      {camp.approvedCount} / {camp.sampleQuota}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {camp.sampleQuota - camp.approvedCount} {camp.platformType === "TIKTOK_GO" ? "voucher tersisa" : "sampel tersisa"}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{camp.deadlineDate}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    {camp.status === "ACTIVE" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        Selesai
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL BUAT CAMPAIGN BARU (Solid white, centered) */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" placement="center" backdrop="blur">
        <ModalContent className="bg-white text-slate-900 border border-slate-200 shadow-2xl rounded-2xl">
          {(onClose) => (
            <>
              <ModalHeader className="border-b border-slate-100 pb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900">Buat Campaign Baru &amp; Kunci ID Binding</h3>
              </ModalHeader>

              <ModalBody className="py-4 space-y-4 text-xs">
                {/* 0. Tipe Platform Switcher */}
                <div>
                  <label className="block text-slate-600 font-semibold mb-1.5">Tipe Platform Campaign</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewCampaign({ ...newCampaign, platformType: "TIKTOK_SHOP" })}
                      className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${
                        newCampaign.platformType === "TIKTOK_SHOP"
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4 text-amber-500" />
                      <span>TikTok Shop (Keranjang Kuning)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewCampaign({ ...newCampaign, platformType: "TIKTOK_GO" })}
                      className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${
                        newCampaign.platformType === "TIKTOK_GO"
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      <span>TikTok Go (Tempat &amp; Kuliner)</span>
                    </button>
                  </div>
                </div>

                {/* 1. Judul & Brand */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Judul Campaign</label>
                    <input
                      type="text"
                      placeholder={newCampaign.platformType === "TIKTOK_GO" ? "Contoh: [SOLARIA] Weekend Dine-in Feast" : "Contoh: [WARDAH] Skinverse Seeding Challenge"}
                      value={newCampaign.title}
                      onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Nama Brand / Merchant</label>
                    <input
                      type="text"
                      placeholder={newCampaign.platformType === "TIKTOK_GO" ? "Contoh: Solaria Indonesia" : "Contoh: Wardah Beauty"}
                      value={newCampaign.brandName}
                      onChange={(e) => setNewCampaign({ ...newCampaign, brandName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Khusus TikTok Go: POI Tag, Location, Category, Benefit */}
                {newCampaign.platformType === "TIKTOK_GO" && (
                  <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
                    <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs border-b border-emerald-200/80 pb-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Pengaturan Lokasi Outlet &amp; Benefit TikTok Go</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-emerald-900 font-semibold mb-1">
                          Tag Lokasi POI ID <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="loc_solaria_gandaria_6912"
                          value={newCampaign.locationId}
                          onChange={(e) => setNewCampaign({ ...newCampaign, locationId: e.target.value })}
                          className="w-full px-3 py-2 border border-emerald-300 rounded-xl focus:outline-none focus:border-emerald-500 font-mono bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-emerald-900 font-semibold mb-1">Nama Tempat / Outlet</label>
                        <input
                          type="text"
                          placeholder="Solaria - Mall Gandaria City, Jakarta"
                          value={newCampaign.locationName}
                          onChange={(e) => setNewCampaign({ ...newCampaign, locationName: e.target.value })}
                          className="w-full px-3 py-2 border border-emerald-300 rounded-xl focus:outline-none focus:border-emerald-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-emerald-900 font-semibold mb-1">Kategori Industri</label>
                        <select
                          value={newCampaign.industryCategory}
                          onChange={(e) => setNewCampaign({ ...newCampaign, industryCategory: e.target.value })}
                          className="w-full px-3 py-2 border border-emerald-300 rounded-xl focus:outline-none focus:border-emerald-500 bg-white"
                        >
                          <option value="Dining">Dining (Restoran / Kafe / Kuliner)</option>
                          <option value="Accommodations">Accommodations (Hotel / Villa / Resort)</option>
                          <option value="Attractions">Attractions (Wisata &amp; Hiburan)</option>
                          <option value="Beauty & Wellness">Beauty &amp; Wellness (Salon / Spa)</option>
                          <option value="Retail & Other">Retail &amp; Toko Offline</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-emerald-900 font-semibold mb-1">Jenis Benefit Kunjungan</label>
                        <select
                          value={newCampaign.benefitType}
                          onChange={(e) => setNewCampaign({ ...newCampaign, benefitType: e.target.value as any })}
                          className="w-full px-3 py-2 border border-emerald-300 rounded-xl focus:outline-none focus:border-emerald-500 bg-white"
                        >
                          <option value="VOUCHER_DIGITAL">Voucher Digital (Dine-in / Belanja di Kasir)</option>
                          <option value="OUTLET_PASS_LINK">Pass Kunjungan Resmi / Reservasi VIP Creavy</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-emerald-900 font-semibold mb-1">
                          {newCampaign.benefitType === "VOUCHER_DIGITAL" ? "Kode Voucher Digital Kasir" : "Link Spreadsheet Pass Kunjungan Kreator"}
                        </label>
                        <input
                          type="text"
                          placeholder={newCampaign.benefitType === "VOUCHER_DIGITAL" ? "Contoh: SOLARIA-VIP-VOUCHER" : "Contoh: https://docs.google.com/spreadsheets/..."}
                          value={newCampaign.benefitData}
                          onChange={(e) => setNewCampaign({ ...newCampaign, benefitData: e.target.value })}
                          className="w-full px-3 py-2 border border-emerald-300 rounded-xl focus:outline-none focus:border-emerald-500 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. TikTok Product ID (Wajib) & Komisi */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 font-semibold mb-1">
                      {newCampaign.platformType === "TIKTOK_GO" ? "TikTok Go Voucher Product ID" : "TikTok Shop Product ID"} <span className="text-rose-500">* (Kunci Atribusi)</span>
                    </label>
                    <input
                      type="text"
                      placeholder={newCampaign.platformType === "TIKTOK_GO" ? "Contoh: 172989182390" : "Contoh: 172981928399"}
                      value={newCampaign.productId}
                      onChange={(e) => setNewCampaign({ ...newCampaign, productId: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-mono"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      ID produk/voucher resmi dari TikTok Partner Center untuk atribusi penjualan otomatis.
                    </span>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Rate Komisi (%)</label>
                    <input
                      type="text"
                      placeholder="15%"
                      value={newCampaign.commissionRate}
                      onChange={(e) => setNewCampaign({ ...newCampaign, commissionRate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* 3. Kuota & Deadline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      {newCampaign.platformType === "TIKTOK_GO" ? "Kuota Voucher / Kunjungan" : "Kuota Sampel Gratis"}
                    </label>
                    <input
                      type="number"
                      value={newCampaign.sampleQuota}
                      onChange={(e) => setNewCampaign({ ...newCampaign, sampleQuota: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Batas Waktu (Deadline)</label>
                    <input
                      type="text"
                      placeholder="30 Oct 2026"
                      value={newCampaign.deadlineDate}
                      onChange={(e) => setNewCampaign({ ...newCampaign, deadlineDate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* 4. Hashtag & Mentions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Hashtag Wajib (Pisahkan Koma)</label>
                    <input
                      type="text"
                      placeholder="#CreavyCampaign, #ReviewJujur"
                      value={newCampaign.hashtags}
                      onChange={(e) => setNewCampaign({ ...newCampaign, hashtags: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Mention Wajib</label>
                    <input
                      type="text"
                      placeholder="@brand_official"
                      value={newCampaign.mentions}
                      onChange={(e) => setNewCampaign({ ...newCampaign, mentions: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </ModalBody>

              <ModalFooter className="border-t border-slate-100 py-3 flex justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => handleCreateCampaign(onClose)}
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Simpan &amp; Kunci Binding
                </button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
