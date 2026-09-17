"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { AdminApplicationItem, initialApplications } from "@/lib/admin-data";

const REJECTION_REASONS = [
  "Jumlah followers belum memenuhi syarat minimum campaign",
  "Niche konten tidak sesuai dengan target audiens brand",
  "Kuota sampel gratis untuk kategori ini sudah habis",
  "Tingkat completion rate postingan sebelumnya rendah",
  "Format engagement rate akun TikTok di bawah standar",
];

export function ApplicationReviewTable() {
  const [applications, setApplications] = useState<AdminApplicationItem[]>(initialApplications);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

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

  // Actions
  const handleApprove = (onClose: () => void) => {
    if (!selectedApp) return;
    setApplications((prev) =>
      prev.map((item) =>
        item.id === selectedApp.id ? { ...item, status: "APPROVED" } : item
      )
    );
    onClose();
  };

  const handleReject = (onClose: () => void) => {
    if (!selectedApp) return;
    setApplications((prev) =>
      prev.map((item) =>
        item.id === selectedApp.id
          ? { ...item, status: "REJECTED", rejectionReason: selectedReason }
          : item
      )
    );
    onClose();
  };

  const filtered = applications.filter((item) => {
    const matchesStatus =
      filterStatus === "ALL" || item.status === filterStatus;
    const matchesQuery =
      item.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tiktokHandle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brandName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 w-full sm:w-auto">
          {[
            { key: "ALL", label: "Semua Pendaftar" },
            { key: "PENDING_REVIEW", label: "Menunggu Review" },
            { key: "APPROVED", label: "Disetujui" },
            { key: "DISPATCHED", label: "Sampel Terkirim" },
            { key: "REJECTED", label: "Ditolak" },
          ].map((tab) => (
            <Button
              key={tab.key}
              size="sm"
              variant={filterStatus === tab.key ? "solid" : "flat"}
              color={filterStatus === tab.key ? "primary" : "default"}
              onClick={() => setFilterStatus(tab.key)}
              className="text-xs font-semibold rounded-xl"
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <Input
          placeholder="Cari kreator, @handle, atau brand..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          startContent={<Search className="w-4 h-4 text-default-400" />}
          size="sm"
          variant="bordered"
          className="w-full sm:w-64"
        />
      </div>

      {/* Main Review Table */}
      <div className="border border-divider/60 rounded-2xl overflow-hidden shadow-sm bg-card">
        <Table aria-label="Tabel Kurasi Pendaftar" removeWrapper>
          <TableHeader>
            <TableColumn>KREATOR & WA PIC</TableColumn>
            <TableColumn>TIKTOK & STATS</TableColumn>
            <TableColumn>KUALITAS</TableColumn>
            <TableColumn>CAMPAIGN TUJUAN</TableColumn>
            <TableColumn>ALAMAT SAMPEL</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn align="center">AKSI</TableColumn>
          </TableHeader>
          <TableBody emptyContent="Tidak ada pendaftar pada kategori ini.">
            {filtered.map((item) => {
              const waClean = item.whatsappNumber.replace(/^0/, "62");
              const waUrl = `https://wa.me/${waClean}?text=Halo%20${encodeURIComponent(
                item.creatorName
              )},%20kami%20dari%20tim%20agency%20resmi%20TikTok%20ingin%20mengonfirmasi%20pendaftaran%20kamu%20pada%20campaign%20${encodeURIComponent(
                item.campaignTitle
              )}`;

              return (
                <TableRow key={item.id}>
                  {/* Kreator & WA */}
                  <TableCell>
                    <div className="space-y-1">
                      <User
                        avatarProps={{ src: item.creatorAvatar, size: "sm" }}
                        name={item.creatorName}
                        description={`Terdaftar: ${item.appliedDate}`}
                        classNames={{ name: "font-bold text-xs", description: "text-[10px]" }}
                      />
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full"
                      >
                        <Phone className="w-3 h-3" />
                        Chat WA PIC
                      </a>
                    </div>
                  </TableCell>

                  {/* TikTok Stats */}
                  <TableCell>
                    <div className="space-y-0.5 text-xs">
                      <div className="flex items-center gap-1 font-extrabold text-foreground">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        <span>{item.tiktokHandle}</span>
                      </div>
                      <p className="text-default-500 font-medium">
                        {item.followersCount} Followers
                      </p>
                      <Chip size="sm" variant="flat" className="text-[10px] h-4 font-bold">
                        {item.tier}
                      </Chip>
                    </div>
                  </TableCell>

                  {/* Kualitas & Niche */}
                  <TableCell>
                    <div className="space-y-1 text-xs">
                      <p className="font-semibold text-default-700">{item.niche}</p>
                      <Chip size="sm" variant="dot" color="success" className="border-none text-[10px]">
                        Completion: {item.completionRate}
                      </Chip>
                    </div>
                  </TableCell>

                  {/* Campaign */}
                  <TableCell>
                    <div className="space-y-0.5 text-xs max-w-[180px]">
                      <span className="font-black text-[10px] text-purple-600 uppercase">
                        {item.brandName}
                      </span>
                      <p className="font-bold text-foreground line-clamp-1">{item.campaignTitle}</p>
                    </div>
                  </TableCell>

                  {/* Alamat Sampel */}
                  <TableCell>
                    <div className="text-[11px] text-default-600 max-w-[160px] space-y-0.5">
                      <p className="font-bold text-default-800 line-clamp-1">
                        {item.shippingAddress.district}, {item.shippingAddress.city}
                      </p>
                      <p className="text-default-500 text-[10px] line-clamp-1">
                        {item.shippingAddress.street}
                      </p>
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    {item.status === "PENDING_REVIEW" && (
                      <Chip size="sm" color="warning" variant="flat" className="font-bold text-xs">
                        Menunggu Review
                      </Chip>
                    )}
                    {item.status === "APPROVED" && (
                      <Chip size="sm" color="success" variant="flat" className="font-bold text-xs">
                        Disetujui
                      </Chip>
                    )}
                    {item.status === "DISPATCHED" && (
                      <Chip size="sm" color="secondary" variant="flat" className="font-bold text-xs">
                        Sampel Dikirim
                      </Chip>
                    )}
                    {item.status === "REJECTED" && (
                      <Chip size="sm" color="danger" variant="flat" className="font-bold text-xs">
                        Ditolak
                      </Chip>
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
                          className="w-7 h-7 min-w-7 rounded-lg text-emerald-600"
                        >
                          <Check className="w-4 h-4" />
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
                          className="w-7 h-7 min-w-7 rounded-lg text-rose-600"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-default-400 font-medium italic text-center block">
                        Sudah Diproses
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* APPROVE CONFIRMATION MODAL */}
      <Modal
        isOpen={isApproveOpen}
        onOpenChange={onApproveChange}
        size="md"
        placement="center"
        backdrop="blur"
      >
        <ModalContent className="bg-white text-slate-900 border border-slate-200 shadow-2xl rounded-2xl">
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="font-bold">Setujui Pendaftaran Kreator</span>
              </ModalHeader>
              <ModalBody className="text-xs space-y-2 text-default-600">
                <p>
                  Apakah Anda yakin ingin menyetujui <strong>{selectedApp?.creatorName}</strong> ({selectedApp?.tiktokHandle}) untuk campaign:
                </p>
                <div className="p-3 bg-default-50 dark:bg-default-100/50 rounded-xl font-bold text-default-800">
                  {selectedApp?.campaignTitle}
                </div>
                <ul className="list-disc list-inside space-y-1 text-default-500 pt-1">
                  <li>Kuota sampel gratis campaign akan berkurang 1.</li>
                  <li>Data alamat pengiriman otomatis diteruskan ke antrean Logistik Sampel.</li>
                  <li>Kreator dapat langsung melihat instruksi tautan TikTok Affiliate target agency.</li>
                </ul>
              </ModalBody>
              <ModalFooter>
                <Button size="sm" variant="light" onPress={onClose}>
                  Batal
                </Button>
                <Button
                  size="sm"
                  color="success"
                  className="bg-emerald-600 text-white font-bold"
                  onClick={() => handleApprove(onClose)}
                >
                  Ya, Setujui & Alokasikan Sampel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* REJECT MODAL */}
      <Modal
        isOpen={isRejectOpen}
        onOpenChange={onRejectChange}
        size="md"
        placement="center"
        backdrop="blur"
      >
        <ModalContent className="bg-white text-slate-900 border border-slate-200 shadow-2xl rounded-2xl">
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-600" />
                <span className="font-bold">Tolak Pendaftaran</span>
              </ModalHeader>
              <ModalBody className="space-y-3">
                <p className="text-xs text-default-600">
                  Pilih alasan penolakan untuk <strong>{selectedApp?.creatorName}</strong>:
                </p>
                <Select
                  label="Alasan Penolakan"
                  size="sm"
                  variant="bordered"
                  selectedKeys={[selectedReason]}
                  onChange={(e) => setSelectedReason(e.target.value)}
                >
                  {REJECTION_REASONS.map((r) => (
                    <SelectItem key={r} textValue={r}>
                      {r}
                    </SelectItem>
                  ))}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button size="sm" variant="light" onPress={onClose}>
                  Batal
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  className="bg-rose-600 text-white font-bold"
                  onClick={() => handleReject(onClose)}
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
