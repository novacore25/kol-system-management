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
    productId: "172981928394",
    commissionRate: "16%",
    sampleQuota: 60,
    approvedCount: 60,
    deadlineDate: "10 Oct 2026",
    status: "COMPLETED",
    hashtags: ["#SkintificID", "#5XCeramide", "#Creavy"],
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
    productId: "",
    commissionRate: "15%",
    sampleQuota: 50,
    deadlineDate: "15 Oct 2026",
    hashtags: "#CreavyCampaign, #ReviewJujur",
    mentions: "@brand_official",
    sow: "Durasi minimal 30 detik\nTautkan keranjang kuning\nPencahayaan jelas",
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
      c.productId.includes(searchQuery)
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
                    <span className="text-[11px] text-slate-400">{camp.brandName}</span>
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
                      {camp.sampleQuota - camp.approvedCount} tersisa
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
                <h3 className="font-bold text-sm text-slate-900">Buat Campaign Baru &amp; Kunci Product ID</h3>
              </ModalHeader>

              <ModalBody className="py-4 space-y-4 text-xs">
                {/* 1. Judul & Brand */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Judul Campaign</label>
                    <input
                      type="text"
                      placeholder="Contoh: [WARDAH] Skinverse Seeding Challenge"
                      value={newCampaign.title}
                      onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Nama Brand / Klien</label>
                    <input
                      type="text"
                      placeholder="Contoh: Wardah Beauty"
                      value={newCampaign.brandName}
                      onChange={(e) => setNewCampaign({ ...newCampaign, brandName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* 2. TikTok Product ID (Wajib) & Komisi */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 font-semibold mb-1">
                      TikTok Shop Product ID <span className="text-rose-500">* (Kunci Atribusi)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 172981928399"
                      value={newCampaign.productId}
                      onChange={(e) => setNewCampaign({ ...newCampaign, productId: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-mono"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      ID produk resmi dari TikTok Shop Partner Center untuk atribusi penjualan otomatis.
                    </span>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Rate Komisi (%)</label>
                    <input
                      type="text"
                      placeholder="18%"
                      value={newCampaign.commissionRate}
                      onChange={(e) => setNewCampaign({ ...newCampaign, commissionRate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* 3. Kuota & Deadline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Kuota Sampel Gratis</label>
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
                      placeholder="#WardahSkinverse, #Creavy"
                      value={newCampaign.hashtags}
                      onChange={(e) => setNewCampaign({ ...newCampaign, hashtags: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Mention Wajib</label>
                    <input
                      type="text"
                      placeholder="@wardahbeauty"
                      value={newCampaign.mentions}
                      onChange={(e) => setNewCampaign({ ...newCampaign, mentions: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </ModalBody>

              <ModalFooter className="border-t border-slate-100 py-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batalkan
                </button>
                <button
                  type="button"
                  onClick={() => handleCreateCampaign(onClose)}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white shadow-sm"
                >
                  Terbitkan Campaign
                </button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
