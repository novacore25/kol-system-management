"use client";

import React, { useState } from "react";
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
  ExternalLink,
} from "lucide-react";
import { AdminApplicationItem, initialApplications } from "@/lib/admin-data";

const COURIERS = [
  "J&T Express",
  "SiCepat Ekspres",
  "JNE Express",
  "Shopee Xpress (SPX)",
  "Anteraja",
  "Ninja Xpress",
];

export function SampleLogisticsTable() {
  const [items, setItems] = useState<AdminApplicationItem[]>(
    initialApplications.filter(
      (a) => a.status === "APPROVED" || a.status === "DISPATCHED"
    )
  );

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [activeItem, setActiveItem] = useState<AdminApplicationItem | null>(null);
  const [selectedCourier, setSelectedCourier] = useState(COURIERS[0]);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleOpenShipModal = (item: AdminApplicationItem) => {
    setActiveItem(item);
    setSelectedCourier(item.courierName || COURIERS[0]);
    setTrackingNumber(item.trackingNumber || "");
    onOpen();
  };

  const handleSaveTracking = (onClose: () => void) => {
    if (!activeItem || !trackingNumber) return;

    setItems((prev) =>
      prev.map((i) =>
        i.id === activeItem.id
          ? {
              ...i,
              status: "DISPATCHED",
              courierName: selectedCourier,
              trackingNumber: trackingNumber.trim(),
              dispatchedAt: "17 Sep 2026 " + new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
            }
          : i
      )
    );
    onClose();
  };

  const copyFullAddress = (item: AdminApplicationItem) => {
    const text = `${item.shippingAddress.recipientName} (${item.shippingAddress.phone})\n${item.shippingAddress.street}\n${item.shippingAddress.district}, ${item.shippingAddress.city}, ${item.shippingAddress.province} - ${item.shippingAddress.postalCode}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-foreground flex items-center gap-2">
            <Truck className="w-5 h-5 text-brand-600" />
            Antrean Pengiriman Sampel Produk
          </h3>
          <p className="text-xs text-default-500">
            Daftar kreator yang telah disetujui dan siap dikirimkan sampel produk gratis dari gudang.
          </p>
        </div>
      </div>

      <div className="border border-divider/60 rounded-2xl overflow-hidden shadow-sm bg-card">
        <Table aria-label="Tabel Logistik Sampel" removeWrapper>
          <TableHeader>
            <TableColumn>KREATOR & CAMPAIGN</TableColumn>
            <TableColumn>ALAMAT LENGKAP PENGIRIMAN</TableColumn>
            <TableColumn>EKSPEDISI & RESI</TableColumn>
            <TableColumn>STATUS LOGISTIK</TableColumn>
            <TableColumn align="center">AKSI</TableColumn>
          </TableHeader>
          <TableBody emptyContent="Tidak ada antrean sampel saat ini.">
            {items.map((item) => (
              <TableRow key={item.id}>
                {/* Kreator & Campaign */}
                <TableCell>
                  <div className="space-y-1 text-xs">
                    <p className="font-extrabold text-foreground">{item.creatorName}</p>
                    <p className="text-purple-600 font-bold text-[11px]">{item.tiktokHandle}</p>
                    <div className="p-2 bg-default-50 dark:bg-default-100/50 rounded-lg text-[11px] max-w-[200px]">
                      <span className="text-default-400 block text-[9px] uppercase font-bold">{item.brandName}</span>
                      <span className="font-medium line-clamp-1">{item.campaignTitle}</span>
                    </div>
                  </div>
                </TableCell>

                {/* Alamat Pengiriman */}
                <TableCell>
                  <div className="space-y-1 text-xs max-w-[260px]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-default-800">{item.shippingAddress.recipientName}</span>
                      <Button
                        size="sm"
                        variant="light"
                        onClick={() => copyFullAddress(item)}
                        className="text-[10px] h-6 px-2 text-brand-600"
                        startContent={<Copy className="w-3 h-3" />}
                      >
                        {copiedId === item.id ? "Tersalin!" : "Salin Label"}
                      </Button>
                    </div>
                    <p className="text-default-500 text-[11px]">Telp: {item.shippingAddress.phone}</p>
                    <p className="text-default-700 text-[11px] font-medium leading-relaxed">
                      {item.shippingAddress.street}, {item.shippingAddress.district}, {item.shippingAddress.city},{" "}
                      {item.shippingAddress.province} ({item.shippingAddress.postalCode})
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
                      <span className="text-[10px] text-default-400 block">
                        Dikirim: {item.dispatchedAt}
                      </span>
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
                    className="font-bold text-xs"
                  >
                    {item.trackingNumber ? "Edit Resi" : "Input Resi"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* MODAL INPUT RESI */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="md"
        placement="center"
        backdrop="blur"
      >
        <ModalContent className="bg-white text-slate-900 border border-slate-200 shadow-2xl rounded-2xl">
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-brand-600" />
                <span className="font-bold">Input Nomor Resi Kurir</span>
              </ModalHeader>
              <ModalBody className="space-y-3">
                <div className="p-3 bg-default-50 dark:bg-default-100/50 rounded-xl text-xs space-y-1">
                  <span className="text-default-400 block text-[10px] uppercase font-bold">Tujuan Pengiriman</span>
                  <p className="font-bold text-default-800">{activeItem?.creatorName} ({activeItem?.tiktokHandle})</p>
                  <p className="text-default-600">{activeItem?.shippingAddress.city}, {activeItem?.shippingAddress.province}</p>
                </div>

                <Select
                  label="Pilih Ekspedisi / Kurir"
                  size="sm"
                  variant="bordered"
                  selectedKeys={[selectedCourier]}
                  onChange={(e) => setSelectedCourier(e.target.value)}
                  isRequired
                >
                  {COURIERS.map((c) => (
                    <SelectItem key={c} textValue={c}>
                      {c}
                    </SelectItem>
                  ))}
                </Select>

                <Input
                  label="Nomor Resi Pengiriman"
                  placeholder="Contoh: JT9928174620ID"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  size="sm"
                  variant="bordered"
                  className="font-mono"
                  isRequired
                />
              </ModalBody>
              <ModalFooter>
                <Button size="sm" variant="light" onPress={onClose}>
                  Batal
                </Button>
                <Button
                  size="sm"
                  color="primary"
                  className="bg-brand-600 text-white font-bold"
                  onClick={() => handleSaveTracking(onClose)}
                  isDisabled={!trackingNumber}
                >
                  Simpan & Update Status
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
