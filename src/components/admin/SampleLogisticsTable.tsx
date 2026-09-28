"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Input,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import {
  Truck,
  Copy,
  CheckCircle2,
  PackageCheck,
  Send,
  RefreshCw,
  Loader2,
  Tag,
  Phone,
} from "lucide-react";

export interface LogisticsItem {
  id: string;
  status: "APPROVED" | "DISPATCHED";
  creatorName: string;
  whatsapp: string;
  tiktokHandle: string;
  campaignTitle: string;
  brandName: string;
  selectedVariant?: string;
  shippingAddress: {
    recipientName?: string;
    phoneNumber?: string;
    streetAddress?: string;
    district?: string;
    city?: string;
    province?: string;
    postalCode?: string;
  };
  shipmentId?: string | null;
  courierName?: string | null;
  trackingNumber?: string | null;
  trackingStatus?: string | null;
  dispatchedAt?: string | null;
}

const COURIERS = [
  "J&T Express",
  "SiCepat Ekspres",
  "JNE Express",
  "Shopee Xpress (SPX)",
  "Anteraja",
  "Ninja Xpress",
  "GoSend / GrabExpress",
];

export function SampleLogisticsTable() {
  const [items, setItems] = useState<LogisticsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [activeItem, setActiveItem] = useState<LogisticsItem | null>(null);
  const [selectedCourier, setSelectedCourier] = useState(COURIERS[0]);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadLogistics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/logistics");
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load logistics queue:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogistics();
  }, []);

  const handleOpenShipModal = (item: LogisticsItem) => {
    setActiveItem(item);
    setSelectedCourier(item.courierName || COURIERS[0]);
    setTrackingNumber(item.trackingNumber || "");
    onOpen();
  };

  const handleSaveTracking = async (onClose: () => void) => {
    if (!activeItem || !trackingNumber.trim()) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/logistics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: activeItem.id,
          courierName: selectedCourier,
          trackingNumber: trackingNumber.trim(),
        }),
      });

      if (res.ok) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === activeItem.id
              ? {
                  ...i,
                  status: "DISPATCHED",
                  courierName: selectedCourier,
                  trackingNumber: trackingNumber.trim(),
                  dispatchedAt: new Date().toISOString(),
                }
              : i
          )
        );
        onClose();
      }
    } catch (err) {
      console.error("Error saving tracking number:", err);
    } finally {
      setSaving(false);
    }
  };

  const copyFullAddress = (item: LogisticsItem) => {
    const addr = item.shippingAddress;
    const text = `${addr.recipientName || item.creatorName} (${addr.phoneNumber || item.whatsapp})\n${addr.streetAddress || "-"}\n${addr.district || "-"}, ${addr.city || "-"}, ${addr.province || "-"} ${addr.postalCode || ""}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-foreground flex items-center gap-2">
            <Truck className="w-5 h-5 text-indigo-600" />
            Antrean Pengiriman Sampel Produk ({items.length})
          </h3>
          <p className="text-xs text-default-500">
            Daftar kreator yang telah disetujui dan siap dikirimkan sampel produk gratis dari gudang.
          </p>
        </div>
        <Button
          size="sm"
          variant="flat"
          onClick={loadLogistics}
          startContent={<RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />}
          className="rounded-xl font-semibold text-xs"
        >
          Refresh
        </Button>
      </div>

      <div className="border border-divider/60 rounded-2xl overflow-hidden shadow-sm bg-card">
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
            <p className="text-xs text-default-500 font-medium">Memuat antrean logistik dari database...</p>
          </div>
        ) : (
          <Table aria-label="Tabel Logistik Sampel" removeWrapper>
            <TableHeader>
              <TableColumn>KREATOR & CAMPAIGN</TableColumn>
              <TableColumn>ALAMAT LENGKAP PENGIRIMAN</TableColumn>
              <TableColumn>EKSPEDISI & RESI</TableColumn>
              <TableColumn>STATUS LOGISTIK</TableColumn>
              <TableColumn align="center">AKSI</TableColumn>
            </TableHeader>
            <TableBody emptyContent="Tidak ada antrean sampel saat ini. Pendaftar yang disetujui akan muncul di sini.">
              {items.map((item) => {
                const addr = item.shippingAddress;
                return (
                  <TableRow key={item.id}>
                    {/* Kreator & Campaign */}
                    <TableCell>
                      <div className="space-y-1 text-xs">
                        <p className="font-extrabold text-foreground">{item.creatorName}</p>
                        <p className="text-purple-600 font-bold text-[11px]">{item.tiktokHandle}</p>
                        <div className="p-2 bg-default-50 dark:bg-default-100/50 rounded-lg text-[11px] max-w-[200px]">
                          <span className="text-default-400 block text-[9px] uppercase font-bold">{item.brandName}</span>
                          <span className="font-medium line-clamp-1">{item.campaignTitle}</span>
                          {item.selectedVariant && item.selectedVariant !== "-" && (
                            <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-violet-700 bg-violet-50 px-1.5 py-0.5 rounded border border-violet-200">
                              <Tag className="w-2.5 h-2.5" />
                              {item.selectedVariant}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Alamat Pengiriman */}
                    <TableCell>
                      <div className="space-y-1 text-xs max-w-[260px]">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-default-800">{addr.recipientName || item.creatorName}</span>
                          <Button
                            size="sm"
                            variant="light"
                            onClick={() => copyFullAddress(item)}
                            className="text-[10px] h-6 px-2 text-indigo-600 font-bold"
                            startContent={<Copy className="w-3 h-3" />}
                          >
                            {copiedId === item.id ? "Tersalin!" : "Salin Label"}
                          </Button>
                        </div>
                        <p className="text-default-500 text-[11px]">Telp: {addr.phoneNumber || item.whatsapp}</p>
                        <p className="text-default-700 text-[11px] font-medium leading-relaxed">
                          {addr.streetAddress || "-"}, {addr.district || "-"}, {addr.city || "-"},{" "}
                          {addr.province || "-"} {addr.postalCode ? `(${addr.postalCode})` : ""}
                        </p>
                      </div>
                    </TableCell>

                    {/* Ekspedisi & Resi */}
                    <TableCell>
                      {item.trackingNumber ? (
                        <div className="space-y-1 text-xs">
                          <Chip size="sm" variant="flat" color="secondary" className="font-bold text-[10px]">
                            {item.courierName}
                          </Chip>
                          <p className="font-mono font-bold text-foreground tracking-wide">
                            {item.trackingNumber}
                          </p>
                          {item.dispatchedAt && (
                            <span className="text-[10px] text-default-400 block">
                              Dikirim: {new Date(item.dispatchedAt).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-default-400 italic">Belum ada nomor resi</span>
                      )}
                    </TableCell>

                    {/* Status Logistik */}
                    <TableCell>
                      {item.status === "APPROVED" && (
                        <Chip size="sm" color="warning" variant="flat" className="font-bold text-xs">
                          Menunggu Input Resi
                        </Chip>
                      )}
                      {item.status === "DISPATCHED" && (
                        <Chip size="sm" color="success" variant="flat" startContent={<CheckCircle2 className="w-3.5 h-3.5" />} className="font-bold text-xs">
                          Terkirim (Resi Aktif)
                        </Chip>
                      )}
                    </TableCell>

                    {/* Aksi */}
                    <TableCell>
                      <Button
                        size="sm"
                        color="primary"
                        variant={item.trackingNumber ? "bordered" : "solid"}
                        onClick={() => handleOpenShipModal(item)}
                        startContent={<Send className="w-3.5 h-3.5" />}
                        className="font-bold text-xs rounded-xl"
                      >
                        {item.trackingNumber ? "Edit Resi" : "Input Resi"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* MODAL INPUT RESI */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" backdrop="blur">
        <ModalContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl">
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <PackageCheck className="w-5 h-5 text-indigo-600" />
                <span className="font-bold text-slate-900 dark:text-white">Input Resi Pengiriman Sampel</span>
              </ModalHeader>
              <ModalBody className="space-y-4 py-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1 text-xs border border-slate-100 dark:border-slate-700">
                  <p className="font-bold text-slate-900 dark:text-white">
                    {activeItem?.creatorName} ({activeItem?.tiktokHandle})
                  </p>
                  <p className="text-slate-500 dark:text-slate-400">
                    Campaign: <strong className="text-slate-700 dark:text-slate-300">{activeItem?.campaignTitle}</strong>
                  </p>
                  {activeItem?.selectedVariant && activeItem?.selectedVariant !== "-" && (
                    <p className="text-violet-700 dark:text-violet-400 font-semibold">
                      Varian: <strong>{activeItem?.selectedVariant}</strong>
                    </p>
                  )}
                </div>

                <Select
                  label="Pilih Ekspedisi / Kurir"
                  size="sm"
                  selectedKeys={[selectedCourier]}
                  onChange={(e) => setSelectedCourier(e.target.value)}
                  variant="bordered"
                >
                  {COURIERS.map((c) => (
                    <SelectItem key={c} textValue={c}>
                      {c}
                    </SelectItem>
                  ))}
                </Select>

                <Input
                  label="Nomor Resi / AWB"
                  placeholder="Contoh: JNT1234567890ID"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  variant="bordered"
                  size="sm"
                />

                <p className="text-[11px] text-slate-400">
                  Nomor resi yang diinput akan langsung muncul di halaman <strong>Campaign Saya</strong> kreator.
                </p>
              </ModalBody>
              <ModalFooter className="border-t border-slate-100 dark:border-slate-800 pt-3">
                <Button size="sm" variant="flat" onClick={onClose} disabled={saving} className="font-semibold">
                  Batal
                </Button>
                <Button
                  size="sm"
                  color="primary"
                  onClick={() => handleSaveTracking(onClose)}
                  isLoading={saving}
                  className="font-bold shadow-sm"
                >
                  Simpan &amp; Perbarui Status
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
