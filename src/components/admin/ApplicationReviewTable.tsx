"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
  Input,
} from "@heroui/react";
import {
  Check,
  X,
  Phone,
  Sparkles,
  MapPin,
  ExternalLink,
  Search,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Loader2,
  Tag,
  Copy,
} from "lucide-react";

export interface AdminApplicationItem {
  id: string;
  status: "PENDING_REVIEW" | "APPROVED" | "DISPATCHED" | "REJECTED";
  rejectionReason?: string;
  selectedVariant?: string;
  appliedAt: string;
  isGuestApply: boolean;
  creatorName: string;
  whatsapp: string;
  tiktokHandle: string;
  followers: number;
  engagementRate: string;
  tier: string;
  city: string;
  campaignId: string;
  campaignTitle: string;
  campaignSlug: string;
  brandName: string;
  bannerUrl: string;
  commissionRateText: string;
  shippingAddress: {
    recipientName?: string;
    phoneNumber?: string;
    streetAddress?: string;
    district?: string;
    city?: string;
    province?: string;
    postalCode?: string;
  };
  shipment?: {
    id: string;
    courierName: string;
    trackingNumber: string;
    trackingStatus: string;
    dispatchedAt?: string;
  } | null;
}

const REJECTION_REASONS = [
  "Jumlah followers belum memenuhi syarat minimum campaign",
  "Niche konten tidak sesuai dengan target audiens brand",
  "Kuota sampel gratis untuk kategori ini sudah habis",
  "Tingkat completion rate postingan sebelumnya rendah",
  "Format engagement rate akun TikTok di bawah standar",
];

export function ApplicationReviewTable() {
  const [applications, setApplications] = useState<AdminApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals state
  const {
    isOpen: isApproveOpen,
    onOpen: onOpenApprove,
    onOpenChange: onApproveChange,
  } = useDisclosure();

  const {
    isOpen: isRejectOpen,
    onOpen: onOpenReject,
    onOpenChange: onRejectChange,
  } = useDisclosure();

  const [selectedApp, setSelectedApp] = useState<AdminApplicationItem | null>(null);
  const [selectedReason, setSelectedReason] = useState(REJECTION_REASONS[0]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/applications");
      if (res.ok) {
        const data = await res.json();
        setApplications(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  // Actions
  const handleApprove = async (onClose: () => void) => {
    if (!selectedApp) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedApp.id, status: "APPROVED" }),
      });
      if (res.ok) {
        setApplications((prev) =>
          prev.map((item) =>
            item.id === selectedApp.id ? { ...item, status: "APPROVED" } : item
          )
        );
      }
    } catch (err) {
      console.error("Error approving application:", err);
    } finally {
      setActionLoading(false);
      onClose();
    }
  };

  const handleReject = async (onClose: () => void) => {
    if (!selectedApp) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedApp.id,
          status: "REJECTED",
          rejectionReason: selectedReason,
        }),
      });
      if (res.ok) {
        setApplications((prev) =>
          prev.map((item) =>
            item.id === selectedApp.id
              ? { ...item, status: "REJECTED", rejectionReason: selectedReason }
              : item
          )
        );
      }
    } catch (err) {
      console.error("Error rejecting application:", err);
    } finally {
      setActionLoading(false);
      onClose();
    }
  };

  const copyAddress = (item: AdminApplicationItem) => {
    const addr = item.shippingAddress;
    const text = `${addr.recipientName || item.creatorName} (${addr.phoneNumber || item.whatsapp})\n${addr.streetAddress || "-"}\n${addr.district || "-"}, ${addr.city || "-"}, ${addr.province || "-"} ${addr.postalCode || ""}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = applications.filter((item) => {
    const matchesStatus =
      filterStatus === "ALL" || item.status === filterStatus;
    const matchesQuery =
      item.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tiktokHandle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.campaignTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 w-full sm:w-auto">
          {[
            { key: "ALL", label: `Semua (${applications.length})` },
            {
              key: "PENDING_REVIEW",
              label: `Menunggu Review (${applications.filter((a) => a.status === "PENDING_REVIEW").length})`,
            },
            {
              key: "APPROVED",
              label: `Disetujui (${applications.filter((a) => a.status === "APPROVED").length})`,
            },
            {
              key: "DISPATCHED",
              label: `Sampel Terkirim (${applications.filter((a) => a.status === "DISPATCHED").length})`,
            },
            {
              key: "REJECTED",
              label: `Ditolak (${applications.filter((a) => a.status === "REJECTED").length})`,
            },
          ].map((tab) => (
            <Button
              key={tab.key}
              size="sm"
              variant={filterStatus === tab.key ? "solid" : "flat"}
              color={filterStatus === tab.key ? "primary" : "default"}
              onClick={() => setFilterStatus(tab.key)}
              className="text-xs font-semibold rounded-xl shrink-0"
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Input
            placeholder="Cari kreator, @handle, atau brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startContent={<Search className="w-4 h-4 text-default-400" />}
            size="sm"
            variant="bordered"
            className="w-full sm:w-64"
          />
          <Button
            size="sm"
            variant="flat"
            isIconOnly
            onClick={loadApplications}
            title="Refresh data"
            className="rounded-xl"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Main Review Table */}
      <div className="border border-divider/60 rounded-2xl overflow-hidden shadow-sm bg-card">
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
            <p className="text-xs text-default-500 font-medium">Memuat pendaftar campaign dari database...</p>
          </div>
        ) : (
          <Table aria-label="Tabel Kurasi Pendaftar" removeWrapper>
            <TableHeader>
              <TableColumn>KREATOR & WA</TableColumn>
              <TableColumn>TIKTOK & STATS</TableColumn>
              <TableColumn>CAMPAIGN & VARIAN</TableColumn>
              <TableColumn>ALAMAT PENGIRIMAN</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn align="center">AKSI</TableColumn>
            </TableHeader>
            <TableBody emptyContent="Tidak ada pendaftar pada kategori ini.">
              {filtered.map((item) => {
                const waClean = item.whatsapp ? item.whatsapp.replace(/\D/g, "").replace(/^0/, "62") : "";
                const waUrl = waClean
                  ? `https://wa.me/${waClean}?text=Halo%20${encodeURIComponent(
                      item.creatorName
                    )},%20kami%20dari%20tim%20Creavy%20Operations%20ingin%20mengonfirmasi%20pendaftaran%20kamu%20pada%20campaign%20${encodeURIComponent(
                      item.campaignTitle
                    )}`
                  : "#";

                const dateFormatted = new Date(item.appliedAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });

                return (
                  <TableRow key={item.id}>
                    {/* Kreator & WA */}
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-bold text-xs text-foreground">{item.creatorName}</p>
                        <p className="text-[10px] text-default-400">Daftar: {dateFormatted}</p>
                        {waClean ? (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full"
                          >
                            <Phone className="w-3 h-3" />
                            {item.whatsapp}
                          </a>
                        ) : (
                          <span className="text-[10px] text-default-400">-</span>
                        )}
                      </div>
                    </TableCell>

                    {/* TikTok Stats */}
                    <TableCell>
                      <div className="space-y-0.5 text-xs">
                        {item.tiktokHandle && item.tiktokHandle !== "-" ? (
                          <>
                            <a
                              href={`https://tiktok.com/@${item.tiktokHandle.replace(/^@/, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 font-extrabold text-foreground hover:text-primary transition-colors"
                              title="Buka profil TikTok"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                              <span className="truncate max-w-[130px]">{item.tiktokHandle}</span>
                              <ExternalLink className="w-3 h-3 text-default-400 shrink-0" />
                            </a>
                            <p className="text-default-500 font-medium text-[11px]">
                              {item.followers ? Number(item.followers).toLocaleString() : "0"} Followers
                            </p>
                            <Chip size="sm" variant="flat" className="text-[9px] h-4 font-bold">
                              {item.tier || "CREATOR"}
                            </Chip>
                          </>
                        ) : (
                          <span className="text-default-400 text-xs italic">Belum terhubung</span>
                        )}
                      </div>
                    </TableCell>

                    {/* Campaign & Varian */}
                    <TableCell>
                      <div className="space-y-1 text-xs max-w-[200px]">
                        <span className="font-black text-[10px] text-purple-600 uppercase">
                          {item.brandName}
                        </span>
                        <p className="font-bold text-foreground line-clamp-1">{item.campaignTitle}</p>
                        {item.selectedVariant && item.selectedVariant !== "-" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-50 text-violet-700 rounded-md text-[10px] font-semibold border border-violet-200">
                            <Tag className="w-2.5 h-2.5" />
                            Varian: {item.selectedVariant}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Alamat Sampel */}
                    <TableCell>
                      <div className="text-[11px] text-default-600 max-w-[180px] space-y-1">
                        <p className="font-bold text-default-800 line-clamp-1">
                          {item.shippingAddress.district || item.shippingAddress.city || item.city || "-"}
                        </p>
                        <p className="text-default-500 text-[10px] line-clamp-2">
                          {item.shippingAddress.streetAddress || "-"}
                        </p>
                        <button
                          type="button"
                          onClick={() => copyAddress(item)}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary hover:underline"
                        >
                          <Copy className="w-2.5 h-2.5" />
                          {copiedId === item.id ? "Tersalin!" : "Salin Alamat"}
                        </button>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      {item.status === "PENDING_REVIEW" && (
                        <Chip size="sm" color="warning" variant="flat" className="font-bold text-[11px]">
                          Menunggu Review
                        </Chip>
                      )}
                      {item.status === "APPROVED" && (
                        <Chip size="sm" color="success" variant="flat" className="font-bold text-[11px]">
                          Disetujui ✓
                        </Chip>
                      )}
                      {item.status === "DISPATCHED" && (
                        <Chip size="sm" color="secondary" variant="flat" className="font-bold text-[11px]">
                          Sampel Dikirim
                        </Chip>
                      )}
                      {item.status === "REJECTED" && (
                        <div className="space-y-0.5">
                          <Chip size="sm" color="danger" variant="flat" className="font-bold text-[11px]">
                            Ditolak
                          </Chip>
                          {item.rejectionReason && (
                            <p className="text-[9px] text-danger max-w-[120px] truncate" title={item.rejectionReason}>
                              {item.rejectionReason}
                            </p>
                          )}
                        </div>
                      )}
                    </TableCell>

                    {/* Aksi */}
                    <TableCell>
                      {item.status === "PENDING_REVIEW" ? (
                        <div className="flex items-center gap-1.5 justify-center">
                          <Button
                            size="sm"
                            isIconOnly
                            color="success"
                            variant="flat"
                            onClick={() => {
                              setSelectedApp(item);
                              onOpenApprove();
                            }}
                            title="Setujui Pendaftaran"
                            className="rounded-xl"
                          >
                            <Check className="w-4 h-4 text-success-600" />
                          </Button>
                          <Button
                            size="sm"
                            isIconOnly
                            color="danger"
                            variant="flat"
                            onClick={() => {
                              setSelectedApp(item);
                              onOpenReject();
                            }}
                            title="Tolak Pendaftaran"
                            className="rounded-xl"
                          >
                            <X className="w-4 h-4 text-danger-600" />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center text-[10px] text-default-400 font-medium">
                          {item.status === "APPROVED" ? (
                            <span className="text-success font-semibold">Siap Kirim Sampel</span>
                          ) : item.status === "DISPATCHED" ? (
                            <span className="text-secondary font-semibold">Terkirim ({item.shipment?.courierName || "Kurir"})</span>
                          ) : (
                            <span>Selesai Kurasi</span>
                          )}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* MODAL 1: APPROVE MODAL */}
      <Modal isOpen={isApproveOpen} onOpenChange={onApproveChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span>Setujui Pendaftar Campaign</span>
              </ModalHeader>
              <ModalBody className="space-y-3">
                <p className="text-xs text-default-600">
                  Kamu akan menyetujui kreator{" "}
                  <strong>{selectedApp?.creatorName}</strong> ({selectedApp?.tiktokHandle}) untuk campaign{" "}
                  <strong>{selectedApp?.campaignTitle}</strong>.
                </p>
                {selectedApp?.selectedVariant && selectedApp?.selectedVariant !== "-" && (
                  <div className="p-2.5 bg-violet-50 rounded-xl border border-violet-200 text-xs text-violet-800">
                    <strong>Varian Sampel:</strong> {selectedApp.selectedVariant}
                  </div>
                )}
                <div className="bg-success-50 dark:bg-success-950/40 p-3 rounded-xl border border-success-200">
                  <p className="text-[11px] text-success-800 dark:text-success-300 font-medium">
                    Kreator akan otomatis masuk ke antrean <strong>Logistik &amp; Resi Sampel</strong> untuk pengiriman sampel produk.
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button size="sm" variant="flat" onClick={onClose} disabled={actionLoading}>
                  Batal
                </Button>
                <Button
                  size="sm"
                  color="success"
                  onClick={() => handleApprove(onClose)}
                  isLoading={actionLoading}
                  className="font-bold text-white shadow-sm"
                >
                  Setujui Sekarang
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* MODAL 2: REJECT MODAL */}
      <Modal isOpen={isRejectOpen} onOpenChange={onRejectChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-danger" />
                <span>Tolak Pendaftar Campaign</span>
              </ModalHeader>
              <ModalBody className="space-y-3">
                <p className="text-xs text-default-600">
                  Pilih alasan penolakan untuk kreator{" "}
                  <strong>{selectedApp?.creatorName}</strong>:
                </p>
                <Select
                  label="Alasan Penolakan"
                  size="sm"
                  selectedKeys={[selectedReason]}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  variant="bordered"
                >
                  {REJECTION_REASONS.map((reason) => (
                    <SelectItem key={reason} textValue={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button size="sm" variant="flat" onClick={onClose} disabled={actionLoading}>
                  Batal
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  onClick={() => handleReject(onClose)}
                  isLoading={actionLoading}
                  className="font-bold"
                >
                  Tolak Pendaftar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
