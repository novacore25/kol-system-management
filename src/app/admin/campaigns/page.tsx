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
  ListPlus,
  Link as LinkIcon,
  Copy,
  Pencil,
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

export interface SkuProductItem {
  id: string;
  productId: string;
  productName: string;
  salePrice: string;
  productLink: string;
  commissionRate: string;
  isSelected: boolean;
}

interface CampaignAdminItem {
  id: string;
  title: string;
  slug: string;
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
  productSkus?: SkuProductItem[];
}

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignAdminItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState(false);

  // Slug state
  const [campaignSlug, setCampaignSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false); // if user manually edited slug, don't auto-update

  // Helper: generate slug from title
  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 60);

  const BASE_URL =
    typeof window !== "undefined" ? window.location.origin : "https://creator.novacorex.tech";

  // Form State inside Modal
  const [newCampaign, setNewCampaign] = useState({
    title: "",
    brandName: "",
    platformType: "TIKTOK_SHOP" as "TIKTOK_SHOP" | "TIKTOK_GO",
    locationId: "",
    locationName: "",
    industryCategory: "Dining",
    benefitType: "VOUCHER_DIGITAL" as "VOUCHER_DIGITAL" | "OUTLET_PASS_LINK",
    benefitData: "",
    commissionRate: "5.00%",
    sampleQuota: 50,
    deadlineDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // date string YYYY-MM-DD
    hashtags: "#CreavyCampaign, #ReviewJujur",
    mentions: "@creavy_official",
    sow: "Tautkan link keranjang kuning / showcase produk resmi\nDurasi video minimal 30 detik\nReview jelas & pencahayaan bagus",
  });


  // SKU Products List inside Modal
  const [skuList, setSkuList] = useState<SkuProductItem[]>([]);

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
            slug: d.slug || "",
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
            productSkus: d.productSkus || [],
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

  // Auto-generate slug from title (unless user manually edited it)
  useEffect(() => {
    if (!slugEdited && newCampaign.title) {
      setCampaignSlug(generateSlug(newCampaign.title));
    }
  }, [newCampaign.title, slugEdited]);

  // Reset form when modal is closed (X button or click outside)
  useEffect(() => {
    if (!isOpen) {
      setSkuList([]);
      setCampaignSlug("");
      setSlugEdited(false);
      const defaultDeadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      setNewCampaign({
        title: "",
        brandName: "",
        platformType: "TIKTOK_SHOP",
        locationId: "",
        locationName: "",
        industryCategory: "Dining",
        benefitType: "VOUCHER_DIGITAL",
        benefitData: "",
        commissionRate: "5.00%",
        sampleQuota: 50,
        deadlineDate: defaultDeadline,
        hashtags: "#CreavyCampaign, #ReviewJujur",
        mentions: "@creavy_official",
        sow: "Tautkan link keranjang kuning / showcase produk resmi\nDurasi video minimal 30 detik\nReview jelas & pencahayaan bagus",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Handle Excel Import inside Modal
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

        let detectedBrand = "";
        let detectedCommission = "";

        const extractedSkus: SkuProductItem[] = rawData
          .map((row: any, idx: number) => {
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
              "";
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

            if (shopName && !detectedBrand) detectedBrand = String(shopName).trim();
            if (commissionRate && !detectedCommission) detectedCommission = String(commissionRate).trim();

            if (!productName && !productId) return null;

            return {
              id: `sku-${Date.now()}-${idx}`,
              productId: String(productId).trim(),
              productName: String(productName).trim(),
              salePrice: String(salePrice).trim(),
              commissionRate: String(commissionRate).trim(),
              productLink: String(productLink).trim(),
              isSelected: true,
            };
          })
          .filter(Boolean) as SkuProductItem[];

        if (extractedSkus.length === 0) {
          alert("Tidak ditemukan data produk/SKU yang valid di dalam file Excel.");
          return;
        }

        // Auto-fill header data from file if empty or detected
        setNewCampaign((prev) => ({
          ...prev,
          title: prev.title || (detectedBrand ? `[${detectedBrand}] Campaign Seeding Kreator` : extractedSkus[0]?.productName || ""),
          brandName: prev.brandName || detectedBrand || "Brand",
          commissionRate: detectedCommission || prev.commissionRate,
        }));

        // Merge or replace SKU list
        setSkuList(extractedSkus);
      } catch (err) {
        console.error("Failed to parse Excel:", err);
        alert("Gagal membaca file Excel. Pastikan file berformat .xlsx atau .csv.");
      }
    };

    reader.readAsBinaryString(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Add Manual SKU Item
  const handleAddManualSku = () => {
    const newSku: SkuProductItem = {
      id: `sku-${Date.now()}`,
      productId: "",
      productName: "",
      salePrice: "Rp0",
      commissionRate: newCampaign.commissionRate || "5.00%",
      productLink: "",
      isSelected: true,
    };
    setSkuList((prev) => [...prev, newSku]);
  };

  // Remove SKU Item
  const handleRemoveSku = (id: string) => {
    setSkuList((prev) => prev.filter((item) => item.id !== id));
  };

  // Update SKU Item
  const handleUpdateSku = (id: string, field: keyof SkuProductItem, value: any) => {
    setSkuList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Toggle All SKUs Selection
  const handleToggleSelectAll = () => {
    const allSelected = skuList.every((s) => s.isSelected);
    setSkuList((prev) => prev.map((s) => ({ ...s, isSelected: !allSelected })));
  };

  // Submit and Save Campaign
  const handleSaveCampaign = async (onClose: () => void) => {
    if (!newCampaign.title || !newCampaign.brandName) {
      alert("Harap lengkapi Judul Campaign dan Nama Brand/Toko!");
      return;
    }
    if (!campaignSlug) {
      alert("Slug campaign tidak boleh kosong.");
      return;
    }

    const selectedSkus = skuList.filter((s) => s.isSelected);
    const primarySku = selectedSkus[0] || skuList[0];

    setIsSaving(true);
    try {
      const payload = {
        title: newCampaign.title,
        slug: campaignSlug,
        brandName: newCampaign.brandName,
        shopName: newCampaign.brandName,
        platformType: newCampaign.platformType,
        locationId: newCampaign.locationId,
        locationName: newCampaign.locationName,
        industryCategory: newCampaign.industryCategory,
        benefitType: newCampaign.benefitType,
        benefitData: newCampaign.benefitData,
        // Primary binding fallback
        productId: primarySku?.productId || newCampaign.locationId || "",
        targetAffiliateLink: primarySku?.productLink || "",
        salePrice: primarySku?.salePrice || "",
        commissionRateText: newCampaign.commissionRate,
        sampleQuota: Number(newCampaign.sampleQuota) || 50,
        productSkus: selectedSkus,
        mandatoryHashtags: newCampaign.hashtags.split(",").map((h) => h.trim()),
        mandatoryMentions: newCampaign.mentions.split(",").map((m) => m.trim()),
        sowItems: newCampaign.sow.split("\n").filter(Boolean),
        endDate: newCampaign.deadlineDate
          ? new Date(newCampaign.deadlineDate).toISOString()
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };

      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok) {
        alert(resData.error || "Gagal membuat campaign.");
        setIsSaving(false);
        return;
      }

      // Use the actual slug returned from DB (matches exactly what's stored)
      const actualSlug = resData.slug || campaignSlug;
      const campaignLink = `${BASE_URL}/campaign/${actualSlug}`;
      await loadCampaigns();
      onClose();
      // Reset form
      setSkuList([]);
      setCampaignSlug("");
      setSlugEdited(false);
      const defaultDeadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      setNewCampaign({
        title: "",
        brandName: "",
        platformType: "TIKTOK_SHOP",
        locationId: "",
        locationName: "",
        industryCategory: "Dining",
        benefitType: "VOUCHER_DIGITAL",
        benefitData: "",
        commissionRate: "5.00%",
        sampleQuota: 50,
        deadlineDate: defaultDeadline,
        hashtags: "#CreavyCampaign, #ReviewJujur",
        mentions: "@creavy_official",
        sow: "Tautkan link keranjang kuning / showcase produk resmi\nDurasi video minimal 30 detik\nReview jelas & pencahayaan bagus",
      });

      setToastMessage(`✅ Campaign "${newCampaign.title}" berhasil dibuat! Link: ${campaignLink}`);
      setTimeout(() => setToastMessage(null), 8000);
    } catch (e) {
      console.error("Error saving campaign to DB:", e);
      alert("Terjadi kesalahan saat menyimpan campaign.");
    } finally {
      setIsSaving(false);
    }
  };

  // Reset all modal form state to defaults
  const resetForm = () => {
    setSkuList([]);
    setCampaignSlug("");
    setSlugEdited(false);
    const defaultDeadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    setNewCampaign({
      title: "",
      brandName: "",
      platformType: "TIKTOK_SHOP",
      locationId: "",
      locationName: "",
      industryCategory: "Dining",
      benefitType: "VOUCHER_DIGITAL",
      benefitData: "",
      commissionRate: "5.00%",
      sampleQuota: 50,
      deadlineDate: defaultDeadline,
      hashtags: "#CreavyCampaign, #ReviewJujur",
      mentions: "@creavy_official",
      sow: "Tautkan link keranjang kuning / showcase produk resmi\nDurasi video minimal 30 detik\nReview jelas & pencahayaan bagus",
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const filteredCampaigns = campaigns.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.productId.includes(searchQuery) ||
      c.locationName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedSkuCount = skuList.filter((s) => s.isSelected).length;

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
            Kelola katalog kampanye, import link showcase produk dari TikTok Partner Center, dan kuncian Product ID.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition-all"
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
          <span>Total: <strong>{filteredCampaigns.length} Campaign Aktif</strong></span>
        </div>
      </div>

      {/* Campaign Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                <th className="py-3 px-4">Campaign &amp; Brand</th>
                <th className="py-3 px-3">Produk / Link SKU</th>
                <th className="py-3 px-3 text-center">Komisi</th>
                <th className="py-3 px-3 text-center">Kuota Sampel</th>
                <th className="py-3 px-3">Batas Waktu</th>
                <th className="py-3 px-3">Link Daftar Kreator</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredCampaigns.length > 0 ? (
                filteredCampaigns.map((camp) => {
                  const skuCount = camp.productSkus?.length || (camp.productId ? 1 : 0);

                  return (
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
                      <td className="py-3.5 px-3 max-w-[240px]">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-[11px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                              {camp.productId}
                            </span>
                            {skuCount > 1 && (
                              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                                +{skuCount - 1} SKU Lainnya
                              </span>
                            )}
                          </div>
                          {camp.targetAffiliateLink && (
                            <a
                              href={camp.targetAffiliateLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 hover:underline truncate max-w-[200px] block"
                            >
                              <span className="truncate">{camp.targetAffiliateLink}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          )}
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
                          {camp.sampleQuota - camp.approvedCount} sampel tersisa
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{camp.deadlineDate}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 max-w-[200px]">
                        {camp.slug ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono text-indigo-700 truncate max-w-[130px]">
                              /campaign/{camp.slug}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/campaign/${camp.slug}`);
                              }}
                              className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors shrink-0"
                              title="Salin link"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                            <a
                              href={`/campaign/${camp.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors shrink-0"
                              title="Buka halaman kreator"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Aktif
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Layers className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-bold text-slate-600">Belum Ada Campaign</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Klik <strong>&quot;Buat Campaign Baru&quot;</strong> untuk membuat campaign dan import file link SKU produk.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL BUAT CAMPAIGN BARU (WITH INTEGRATED EXCEL IMPORT & MULTI-SKU LIST) */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="4xl"
        placement="center"
        backdrop="blur"
        scrollBehavior="inside"
      >
        <ModalContent className="bg-white text-slate-900 border border-slate-200 shadow-2xl rounded-2xl max-h-[90vh]">
          {(onClose) => (
            <>
              <ModalHeader className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      Buat Campaign Baru &amp; Kunci Binding Link Produk / SKU
                    </h3>
                    <p className="text-[11px] text-slate-500 font-normal">
                      Import link dari file Excel TikTok Shop atau tambahkan data SKU produk secara manual.
                    </p>
                  </div>
                </div>
              </ModalHeader>

              <ModalBody className="py-4 space-y-5 text-xs">
                {/* 0. File Import Banner Inside Modal */}
                <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">
                        Punya File Export TikTok Shop Partner Center (.xlsx)?
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Upload file Excel untuk mengisi judul, brand, rate komisi, dan semua link SKU otomatis.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors shrink-0 self-start sm:self-auto"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload &amp; Auto-Fill File Excel</span>
                  </button>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".xlsx, .xls, .csv"
                    className="hidden"
                  />
                </div>

                {/* 1. Tipe Platform Switcher */}
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
                      <span>TikTok Shop (Keranjang Kuning / Showcase)</span>
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

                {/* 2. Judul Campaign & Brand */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 font-semibold mb-1">Judul Campaign</label>
                    <input
                      type="text"
                      placeholder="Contoh: [MilkyBoost] Susu Penambah Berat Badan Seeding"
                      value={newCampaign.title}
                      onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Nama Brand / Toko</label>
                    <input
                      type="text"
                      placeholder="Contoh: MilkyBoost Official"
                      value={newCampaign.brandName}
                      onChange={(e) => setNewCampaign({ ...newCampaign, brandName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
                    />
                  </div>
                </div>

                {/* 2b. Slug / Link Campaign */}
                <div className="p-3.5 bg-indigo-50/60 border border-indigo-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="text-xs font-bold text-indigo-900">Link Pendaftaran Kreator</span>
                    <span className="text-[10px] text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded font-medium">Share ke kreator</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 shrink-0 font-mono">{BASE_URL}/campaign/</span>
                    <input
                      type="text"
                      value={campaignSlug}
                      onChange={(e) => {
                        const cleaned = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-");
                        setCampaignSlug(cleaned);
                        setSlugEdited(true);
                      }}
                      placeholder="slug-campaign-anda"
                      className="flex-1 px-2.5 py-1.5 border border-indigo-200 rounded-lg text-xs font-mono focus:outline-none focus:border-indigo-500 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const fullLink = `${BASE_URL}/campaign/${campaignSlug}`;
                        navigator.clipboard.writeText(fullLink);
                        setCopiedSlug(true);
                        setTimeout(() => setCopiedSlug(false), 2000);
                      }}
                      disabled={!campaignSlug}
                      className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 shrink-0"
                      title="Salin link"
                    >
                      {copiedSlug ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {campaignSlug && (
                    <p className="text-[10px] text-indigo-600 font-mono truncate">
                      🔗 {BASE_URL}/campaign/{campaignSlug}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-500">
                    Slug otomatis dibuat dari judul. Hanya huruf kecil, angka, dan tanda strip (-). Bisa kamu ubah.
                  </p>
                </div>

                {/* 3. SEKSI LINK PRODUK & SKU (THE MAIN HIGHLIGHT) */}
                {newCampaign.platformType === "TIKTOK_SHOP" && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-indigo-600" />
                        <h4 className="font-bold text-xs text-slate-900">
                          Daftar Link Produk &amp; SKU Kuncian (TikTok Shop Binding)
                        </h4>
                      </div>

                      <div className="flex items-center gap-3">
                        {skuList.length > 0 && (
                          <button
                            type="button"
                            onClick={handleToggleSelectAll}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                          >
                            {skuList.every((s) => s.isSelected) ? "Batal Pilih Semua" : "Pilih Semua"}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={handleAddManualSku}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambah Produk Manual</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500">
                      Centang produk yang ingin dimasukkan ke campaign ini. Kreator dapat mengklik masing-masing link untuk memasukkannya ke showcase mereka.
                      {skuList.length > 0 && (
                        <strong className="text-slate-800 ml-1">
                          ({selectedSkuCount} dari {skuList.length} produk terpilih)
                        </strong>
                      )}
                    </p>

                    {/* SKU Table List */}
                    {skuList.length > 0 ? (
                      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                        {skuList.map((sku, index) => (
                          <div
                            key={sku.id}
                            className={clsx(
                              "p-3 rounded-xl border transition-all flex flex-col gap-2",
                              sku.isSelected
                                ? "bg-white border-indigo-200 shadow-sm"
                                : "bg-slate-100/70 border-slate-200 opacity-60"
                            )}
                          >
                            {/* Top row: Checkbox, Name, Price, Delete */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2.5 flex-1">
                                <input
                                  type="checkbox"
                                  checked={sku.isSelected}
                                  onChange={(e) => handleUpdateSku(sku.id, "isSelected", e.target.checked)}
                                  className="w-4 h-4 mt-1 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer shrink-0"
                                />
                                <div className="flex-1 space-y-1">
                                  <input
                                    type="text"
                                    placeholder="Nama Produk / Varian SKU (contoh: Susu Penambah Berat Badan 3 Box)"
                                    value={sku.productName}
                                    onChange={(e) => handleUpdateSku(sku.id, "productName", e.target.value)}
                                    className="w-full px-2.5 py-1 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                                  />
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveSku(sku.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                                title="Hapus SKU"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Bottom row: Product ID, Price, Showcase Link */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pl-6.5 text-[11px]">
                              <div>
                                <label className="block text-slate-400 text-[10px] font-semibold mb-0.5">Product ID (Atribusi)</label>
                                <input
                                  type="text"
                                  placeholder="Contoh: 1736993709100336445"
                                  value={sku.productId}
                                  onChange={(e) => handleUpdateSku(sku.id, "productId", e.target.value)}
                                  className="w-full px-2 py-1 border border-slate-200 rounded-lg font-mono text-xs focus:outline-none focus:border-indigo-500 bg-slate-50"
                                />
                              </div>
                              <div>
                                <label className="block text-slate-400 text-[10px] font-semibold mb-0.5">Harga Jual</label>
                                <input
                                  type="text"
                                  placeholder="Rp259.500"
                                  value={sku.salePrice}
                                  onChange={(e) => handleUpdateSku(sku.id, "salePrice", e.target.value)}
                                  className="w-full px-2 py-1 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500 bg-slate-50"
                                />
                              </div>
                              <div>
                                <label className="block text-slate-400 text-[10px] font-semibold mb-0.5">Link Showcase Produk</label>
                                <input
                                  type="text"
                                  placeholder="https://affiliate-id.tokopedia.com/api/v1/share/..."
                                  value={sku.productLink}
                                  onChange={(e) => handleUpdateSku(sku.id, "productLink", e.target.value)}
                                  className="w-full px-2 py-1 border border-slate-200 rounded-lg font-mono text-xs focus:outline-none focus:border-indigo-500 bg-slate-50 text-indigo-700"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 bg-white border border-dashed border-slate-200 rounded-xl text-center space-y-2">
                        <Tag className="w-6 h-6 mx-auto text-slate-300" />
                        <p className="font-semibold text-slate-700 text-xs">Belum ada link produk/SKU</p>
                        <p className="text-[11px] text-slate-400">
                          Upload file Excel di atas atau klik tombol <strong>&quot;Tambah Produk Manual&quot;</strong>.
                        </p>
                      </div>
                    )}
                  </div>
                )}

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
                    </div>
                  </div>
                )}

                {/* 4. Komisi, Kuota & Deadline */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Rate Komisi (%)</label>
                    <input
                      type="text"
                      placeholder="5.00%"
                      value={newCampaign.commissionRate}
                      onChange={(e) => setNewCampaign({ ...newCampaign, commissionRate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Kuota Sampel</label>
                    <input
                      type="number"
                      value={newCampaign.sampleQuota}
                      onChange={(e) => setNewCampaign({ ...newCampaign, sampleQuota: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Batas Waktu (Deadline)</label>
                    <input
                      type="date"
                      value={newCampaign.deadlineDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setNewCampaign({ ...newCampaign, deadlineDate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
                    />
                  </div>
                </div>

                {/* 5. Hashtag & Mentions */}
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

              <ModalFooter className="border-t border-slate-100 py-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => { resetForm(); onClose(); }}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
                  title="Hapus semua data form"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Bersihkan Semua
                </button>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleSaveCampaign(onClose)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Spinner size="sm" color="white" />
                      <span>Menyimpan Campaign...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Simpan Campaign ({selectedSkuCount} Link Terpilih)</span>
                    </>
                  )}
                </button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
