"use client";

import React, { useState, useEffect, useRef } from "react";
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
  FileSpreadsheet,
  Upload,
  Check,
  AlertCircle,
  Trash2,
} from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
} from "@heroui/react";
import * as XLSX from "xlsx";
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
  targetAffiliateLink?: string;
  salePrice?: string;
}

interface ParsedExcelProduct {
  selected: boolean;
  campaignId?: string;
  productName: string;
  productId: string;
  shopName: string;
  salePrice: string;
  commissionRate: string;
  productLink: string;
  sampleQuota: number;
}

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignAdminItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Excel Import Modal State
  const {
    isOpen: isImportOpen,
    onOpen: onOpenImport,
    onOpenChange: onImportChange,
  } = useDisclosure();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsedProducts, setParsedProducts] = useState<ParsedExcelProduct[]>([]);
  const [importFileName, setImportFileName] = useState<string>("");
  const [isImporting, setIsImporting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load campaigns from API/DB
  const loadCampaigns = async () => {
    try {
      const res = await fetch("/api/campaigns");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const mapped: CampaignAdminItem[] = data.map((d: any) => ({
            id: d.id,
            title: d.title,
            brandName: d.brandName,
            platformType: d.platformType,
            locationId: d.locationId,
            locationName: d.locationName,
            industryCategory: d.industryCategory,
            benefitType: d.benefitType,
            benefitData: d.benefitData,
            productId: d.productId || d.locationId || "PROD-GENERAL",
            commissionRate: d.commissionRateText || "5.00%",
            sampleQuota: d.sampleQuota || 50,
            approvedCount: 0,
            deadlineDate: d.endDate || "30 Sep 2026",
            status: "ACTIVE",
            hashtags: d.mandatoryHashtags || ["#CreavyCampaign"],
            targetAffiliateLink: d.targetAffiliateLink,
            salePrice: d.salePrice,
          }));
          setCampaigns(mapped);
        }
      }
    } catch (err) {
      console.error("Error loading campaigns:", err);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  // Form State for Manual Campaign Creation
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
    targetAffiliateLink: "",
    salePrice: "",
    commissionRate: "5.00%",
    sampleQuota: 50,
    deadlineDate: "30 Oct 2026",
    hashtags: "#CreavyCampaign, #ReviewJujur",
    mentions: "@creavy_official",
    sow: "Tautkan link keranjang kuning / showcase produk\nDurasi minimal 30 detik\nPencahayaan jelas & review jujur",
  });

  // Handle Excel File Parsing
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawData: any[] = XLSX.utils.sheet_to_json(ws);

        if (!rawData || rawData.length === 0) {
          alert("File Excel kosong atau format tidak dikenali.");
          return;
        }

        // Map columns dynamically
        const extracted: ParsedExcelProduct[] = rawData
          .map((row: any) => {
            const productName =
              row["product name"] ||
              row["Product name"] ||
              row["Product Name"] ||
              row["title"] ||
              row["Title"] ||
              "";
            const productId = String(
              row["Product ID"] || row["Product id"] || row["product_id"] || ""
            );
            const shopName =
              row["Shop name"] ||
              row["Shop Name"] ||
              row["brand"] ||
              row["Brand"] ||
              "Brand";
            const salePrice =
              row["Sale price"] || row["Sale Price"] || row["price"] || "-";
            const commissionRate =
              row["Creator commission rate"] ||
              row["Commission"] ||
              row["commission_rate"] ||
              "5.00%";
            const productLink =
              row["Product link"] ||
              row["Product Link"] ||
              row["link"] ||
              row["target_link"] ||
              "";
            const campaignId = String(row["Campaign ID"] || "");

            if (!productName && !productId) return null;

            return {
              selected: true,
              campaignId,
              productName: String(productName).trim(),
              productId: String(productId).trim(),
              shopName: String(shopName).trim(),
              salePrice: String(salePrice).trim(),
              commissionRate: String(commissionRate).trim(),
              productLink: String(productLink).trim(),
              sampleQuota: 50,
            };
          })
          .filter(Boolean) as ParsedExcelProduct[];

        if (extracted.length === 0) {
          alert("Tidak ditemukan data produk yang valid di dalam file Excel.");
          return;
        }

        setParsedProducts(extracted);
        onOpenImport();
      } catch (err) {
        console.error("Failed to parse Excel:", err);
        alert("Gagal membaca file Excel. Pastikan file berformat .xlsx atau .csv.");
      }
    };

    reader.readAsBinaryString(file);
    // Reset file input so user can re-upload if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Submit Batch Imported Campaigns to Database
  const handleSaveImportedCampaigns = async (onClose: () => void) => {
    const selectedItems = parsedProducts.filter((p) => p.selected);
    if (selectedItems.length === 0) {
      alert("Pilih minimal 1 produk untuk di-import!");
      return;
    }

    setIsImporting(true);
    try {
      const payload = selectedItems.map((p) => ({
        title: p.productName,
        brandName: p.shopName,
        shopName: p.shopName,
        productId: p.productId,
        tiktokCampaignId: p.campaignId,
        salePrice: p.salePrice,
        commissionRateText: p.commissionRate,
        targetAffiliateLink: p.productLink,
        sampleQuota: Number(p.sampleQuota) || 50,
        platformType: "TIKTOK_SHOP",
        mandatoryHashtags: ["#CreavyCampaign", "#ReviewJujur"],
        mandatoryMentions: ["@creavy_official"],
        sowItems: [
          "Tautkan link keranjang kuning / showcase produk resmi",
          "Durasi video minimal 30 detik",
          "Review jelas & pencahayaan bagus",
        ],
      }));

      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok) {
        alert(resData.error || "Gagal meng-import campaign ke database.");
        setIsImporting(false);
        return;
      }

      await loadCampaigns();
      onClose();
      setToastMessage(`Berhasil meng-import ${selectedItems.length} campaign dari TikTok Shop ke database!`);
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err) {
      console.error("Batch import error:", err);
      alert("Terjadi kesalahan saat menyimpan data ke database.");
    } finally {
      setIsImporting(false);
    }
  };

  // Toggle selection in import preview
  const toggleSelectAll = () => {
    const allSelected = parsedProducts.every((p) => p.selected);
    setParsedProducts((prev) => prev.map((p) => ({ ...p, selected: !allSelected })));
  };

  const toggleSelectRow = (index: number) => {
    setParsedProducts((prev) =>
      prev.map((p, i) => (i === index ? { ...p, selected: !p.selected } : p))
    );
  };

  // Single Manual Campaign Creation
  const handleCreateCampaign = async (onClose: () => void) => {
    if (!newCampaign.title || !newCampaign.brandName) {
      alert("Harap lengkapi Judul dan Brand!");
      return;
    }

    const payload = {
      title: newCampaign.title,
      brandName: newCampaign.brandName,
      platformType: newCampaign.platformType,
      locationId: newCampaign.locationId,
      locationName: newCampaign.locationName,
      industryCategory: newCampaign.industryCategory,
      benefitType: newCampaign.benefitType,
      benefitData: newCampaign.benefitData,
      productId: newCampaign.productId || newCampaign.locationId,
      targetAffiliateLink: newCampaign.targetAffiliateLink,
      salePrice: newCampaign.salePrice,
      commissionRateText: newCampaign.commissionRate,
      sampleQuota: Number(newCampaign.sampleQuota),
      mandatoryHashtags: newCampaign.hashtags.split(",").map((h) => h.trim()),
      mandatoryMentions: newCampaign.mentions.split(",").map((m) => m.trim()),
      sowItems: newCampaign.sow.split("\n").filter(Boolean),
    };

    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok) {
        alert(resData.error || "Gagal membuat campaign.");
        return;
      }

      await loadCampaigns();
      onClose();
      setToastMessage(`Campaign "${newCampaign.title}" berhasil dibuat dan tersimpan di database!`);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (e) {
      console.error("Error saving campaign to DB:", e);
      alert("Terjadi kesalahan saat menyimpan campaign.");
    }
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
      {/* Hidden File Input for Excel Import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".xlsx, .xls, .csv"
        className="hidden"
      />

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

      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Manajemen Campaign Brand
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kelola katalog kampanye, import link showcase produk dari TikTok Partner Center, dan kuncian Product ID.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Button Import Excel TikTok Shop */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-xs font-bold text-emerald-800 shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Import Excel TikTok Shop (.xlsx)</span>
          </button>

          {/* Button Manual Create Campaign */}
          <button
            type="button"
            onClick={onOpen}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Campaign Manual</span>
          </button>
        </div>
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
          <span>Total: <strong>{filteredCampaigns.length} Campaign Tersedia</strong></span>
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
                <th className="py-3 px-3">Link Showcase Kreator</th>
                <th className="py-3 px-3 text-center">Komisi</th>
                <th className="py-3 px-3 text-center">Kuota Sampel</th>
                <th className="py-3 px-3">Batas Waktu</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredCampaigns.length > 0 ? (
                filteredCampaigns.map((camp) => (
                  <tr key={camp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-bold text-slate-900 line-clamp-2">{camp.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-slate-500 font-medium">{camp.brandName}</span>
                        {camp.salePrice && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold border border-emerald-200">
                            {camp.salePrice}
                          </span>
                        )}
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
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="inline-flex items-center gap-1 font-mono font-bold text-xs text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                        <Tag className="w-3 h-3 text-indigo-500" />
                        <span>{camp.productId}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 max-w-[200px]">
                      {camp.targetAffiliateLink ? (
                        <a
                          href={camp.targetAffiliateLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:underline truncate max-w-[180px]"
                        >
                          <span className="truncate">{camp.targetAffiliateLink}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Belum diisi</span>
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
                        {camp.sampleQuota - camp.approvedCount} sampel tersisa
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{camp.deadlineDate}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Aktif
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Layers className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-bold text-slate-600">Belum Ada Campaign</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Klik <strong>&quot;Import Excel TikTok Shop&quot;</strong> atau <strong>&quot;Buat Campaign Manual&quot;</strong> untuk menambahkan campaign pertama.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL IMPORT EXCEL TIKTOK SHOP PARTNER CENTER */}
      <Modal
        isOpen={isImportOpen}
        onOpenChange={onImportChange}
        size="4xl"
        placement="center"
        backdrop="blur"
        scrollBehavior="inside"
      >
        <ModalContent className="bg-white text-slate-900 border border-slate-200 shadow-2xl rounded-2xl max-h-[90vh]">
          {(onClose) => {
            const selectedCount = parsedProducts.filter((p) => p.selected).length;

            return (
              <>
                <ModalHeader className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">
                        Preview Import Produk dari TikTok Shop Partner Center
                      </h3>
                      <p className="text-[11px] text-slate-500 font-normal">
                        File: <strong>{importFileName}</strong> ({parsedProducts.length} produk terdeteksi)
                      </p>
                    </div>
                  </div>
                </ModalHeader>

                <ModalBody className="py-4 space-y-4 text-xs">
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-900 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div className="space-y-0.5">
                      <p className="font-bold text-xs">Kuncian Binding &amp; Link Showcase Terdeteksi Otomatis:</p>
                      <p className="text-[11px] text-emerald-800 leading-relaxed">
                        Seluruh <strong>Product ID</strong> dan <strong>Product Showcase Link</strong> dari file Excel akan disimpan ke database agar kreator dapat langsung menambahkan produk ke showcase TikTok mereka hanya dengan 1 klik.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                    >
                      {parsedProducts.every((p) => p.selected) ? "Batal Pilih Semua" : "Pilih Semua Produk"}
                    </button>
                    <span className="text-slate-500 text-xs">
                      Terpilih: <strong>{selectedCount} dari {parsedProducts.length} produk</strong>
                    </span>
                  </div>

                  {/* Preview Table */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold sticky top-0 border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3 text-center w-10">Pilih</th>
                          <th className="py-2.5 px-3">Nama Produk &amp; Toko</th>
                          <th className="py-2.5 px-3">Product ID</th>
                          <th className="py-2.5 px-3">Harga &amp; Komisi</th>
                          <th className="py-2.5 px-3">Link Showcase</th>
                          <th className="py-2.5 px-3 w-24 text-center">Kuota</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {parsedProducts.map((prod, idx) => (
                          <tr
                            key={idx}
                            className={clsx(
                              "transition-colors",
                              prod.selected ? "bg-indigo-50/20 hover:bg-indigo-50/40" : "opacity-50 hover:opacity-80"
                            )}
                          >
                            <td className="py-3 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={prod.selected}
                                onChange={() => toggleSelectRow(idx)}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                              />
                            </td>
                            <td className="py-3 px-3 max-w-xs">
                              <p className="font-bold text-slate-900 line-clamp-2">{prod.productName}</p>
                              <span className="text-[10px] text-slate-500 font-medium">{prod.shopName}</span>
                            </td>
                            <td className="py-3 px-3">
                              <span className="font-mono font-bold text-[11px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                                {prod.productId}
                              </span>
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap">
                              <p className="font-semibold text-slate-800 text-[11px]">{prod.salePrice}</p>
                              <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                Komisi: {prod.commissionRate}
                              </span>
                            </td>
                            <td className="py-3 px-3 max-w-[180px]">
                              {prod.productLink ? (
                                <span className="font-mono text-[10px] text-indigo-600 truncate block">
                                  {prod.productLink}
                                </span>
                              ) : (
                                <span className="text-slate-400 italic text-[10px]">-</span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-center">
                              <input
                                type="number"
                                min={1}
                                value={prod.sampleQuota}
                                onChange={(e) => {
                                  const val = Number(e.target.value) || 1;
                                  setParsedProducts((prev) =>
                                    prev.map((item, i) => (i === idx ? { ...item, sampleQuota: val } : item))
                                  );
                                }}
                                className="w-16 px-2 py-1 border border-slate-200 rounded-lg text-center font-bold text-xs"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </ModalBody>

                <ModalFooter className="border-t border-slate-100 py-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isImporting}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    disabled={isImporting || selectedCount === 0}
                    onClick={() => handleSaveImportedCampaigns(onClose)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isImporting ? (
                      <>
                        <Spinner size="sm" color="white" />
                        <span>Menyimpan ke Database...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Simpan &amp; Import {selectedCount} Campaign</span>
                      </>
                    )}
                  </button>
                </ModalFooter>
              </>
            );
          }}
        </ModalContent>
      </Modal>

      {/* MODAL BUAT CAMPAIGN MANUAL */}
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
                      placeholder={newCampaign.platformType === "TIKTOK_GO" ? "Contoh: [SOLARIA] Weekend Dine-in Feast" : "Contoh: MilkyBoost Susu Penambah Berat Badan"}
                      value={newCampaign.title}
                      onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Nama Brand / Toko</label>
                    <input
                      type="text"
                      placeholder={newCampaign.platformType === "TIKTOK_GO" ? "Contoh: Solaria Indonesia" : "Contoh: MilkyBoost Official"}
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

                {/* 2. TikTok Product ID & Showcase Link */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      TikTok Shop Product ID <span className="text-rose-500">* (Kunci Atribusi)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 1736993709100336445"
                      value={newCampaign.productId}
                      onChange={(e) => setNewCampaign({ ...newCampaign, productId: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      Link Showcase Produk (Affiliate Share Link)
                    </label>
                    <input
                      type="text"
                      placeholder="https://affiliate-id.tokopedia.com/api/v1/share/..."
                      value={newCampaign.targetAffiliateLink}
                      onChange={(e) => setNewCampaign({ ...newCampaign, targetAffiliateLink: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>

                {/* 3. Harga, Komisi & Kuota */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Harga Jual</label>
                    <input
                      type="text"
                      placeholder="Rp259.500"
                      value={newCampaign.salePrice}
                      onChange={(e) => setNewCampaign({ ...newCampaign, salePrice: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Rate Komisi (%)</label>
                    <input
                      type="text"
                      placeholder="5.00%"
                      value={newCampaign.commissionRate}
                      onChange={(e) => setNewCampaign({ ...newCampaign, commissionRate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Kuota Sampel</label>
                    <input
                      type="number"
                      value={newCampaign.sampleQuota}
                      onChange={(e) => setNewCampaign({ ...newCampaign, sampleQuota: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* 4. Hashtag & Mentions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Hashtag Wajib</label>
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
                      placeholder="@creavy_official"
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
                  Simpan Campaign
                </button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
