"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import {
  Pencil,
  RefreshCw,
  Plus,
  HelpCircle,
  Check,
  CreditCard,
  Building,
  MapPin,
  MessageCircle,
  ExternalLink,
  Sparkles,
  TrendingUp,
  Award,
  Zap,
} from "lucide-react";
import { WilayahSelect, SelectedWilayah } from "@/components/profile/WilayahSelect";

const POPULAR_BANKS = [
  "BANK CENTRAL ASIA (BCA)",
  "BANK MANDIRI",
  "BANK RAKYAT INDONESIA (BRI)",
  "BANK NEGARA INDONESIA (BNI)",
  "BANK SYARIAH INDONESIA (BSI)",
  "BANK JAGO",
  "SEABANK INDONESIA",
  "CIMB NIAGA",
];

export default function ProfilePage() {
  // Modal Disclosures
  const {
    isOpen: isAddressModalOpen,
    onOpen: onOpenAddressModal,
    onOpenChange: onAddressModalChange,
  } = useDisclosure();

  const {
    isOpen: isAddressListOpen,
    onOpen: onOpenAddressList,
    onOpenChange: onAddressListChange,
  } = useDisclosure();

  const {
    isOpen: isBankModalOpen,
    onOpen: onOpenBankModal,
    onOpenChange: onBankModalChange,
  } = useDisclosure();

  const {
    isOpen: isBankListOpen,
    onOpen: onOpenBankList,
    onOpenChange: onBankListChange,
  } = useDisclosure();

  const {
    isOpen: isEditProfileOpen,
    onOpen: onOpenEditProfile,
    onOpenChange: onEditProfileChange,
  } = useDisclosure();

  const {
    isOpen: isHelpOpen,
    onOpen: onOpenHelp,
    onOpenChange: onHelpChange,
  } = useDisclosure();

  // User Profile State
  const [profile, setProfile] = useState({
    fullName: "Kreator Creavy",
    email: "",
    phone: "-",
    gender: "Belum disetel",
  });

  const [connectedTiktok, setConnectedTiktok] = useState<{
    handle: string;
    displayName: string;
    avatarUrl?: string;
    followerCount?: number;
    isVerified?: boolean;
  } | null>(null);

  // Addresses State
  const [addresses, setAddresses] = useState<any[]>([]);

  const [newAddress, setNewAddress] = useState({
    recipientName: "",
    phone: "",
    street: "",
    postalCode: "",
    provinceName: "",
    regencyName: "",
    districtName: "",
    villageName: "",
  });

  // Bank Accounts State
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);

  const [newBank, setNewBank] = useState({
    bankName: POPULAR_BANKS[0],
    accountNumber: "",
    accountHolder: "",
  });

  // Load Real Profile Data
  React.useEffect(() => {
    fetch("/api/profile")
      .then((res) => {
        if (!res.ok) {
          window.location.href = "/login?returnUrl=/profile";
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        setProfile({
          fullName: data.profile?.fullName || data.user?.name || "Kreator Creavy",
          email: data.user?.email || "",
          phone: data.profile?.whatsappNumber || "-",
          gender: "Belum disetel",
        });

        if (data.addresses && Array.isArray(data.addresses) && data.addresses.length > 0) {
          setAddresses(data.addresses);
        }

        if (data.profile?.bankName) {
          setBankAccounts([
            {
              id: "1",
              bankName: data.profile.bankName,
              accountNumber: data.profile.bankAccountNumber || "-",
              accountHolder: data.profile.bankAccountHolder || data.profile.fullName || "-",
              isDefault: true,
            },
          ]);
        }

        if (data.tiktokAccount) {
          setConnectedTiktok(data.tiktokAccount);
        }
      })
      .catch((err) => console.error("Error loading profile:", err));
  }, []);

  const handleSaveAddress = (onClose: () => void) => {
    if (!newAddress.recipientName || !newAddress.street) return;

    setAddresses([
      ...addresses,
      {
        id: String(Date.now()),
        recipientName: newAddress.recipientName,
        phone: newAddress.phone || profile.phone,
        province: newAddress.provinceName || "DKI JAKARTA",
        city: newAddress.regencyName || "KOTA JAKARTA PUSAT",
        district: newAddress.districtName || "KEMAYORAN",
        postalCode: newAddress.postalCode || "10650",
        street: newAddress.street,
        isDefault: false,
      },
    ]);
    onClose();
  };

  const handleSaveBank = (onClose: () => void) => {
    if (!newBank.accountNumber || !newBank.accountHolder) return;

    setBankAccounts([
      ...bankAccounts,
      {
        id: String(Date.now()),
        bankName: newBank.bankName,
        accountNumber: newBank.accountNumber,
        accountHolder: newBank.accountHolder,
        isDefault: false,
      },
    ]);
    onClose();
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="space-y-0.5">
        <span className="text-xs text-slate-400 font-medium">Profile</span>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Profile
        </h1>
      </div>

      {/* Top Profile Card with Soft Pastel Aura (Exact Gro Creator Style) */}
      <div className="relative bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Soft Pastel Aura in Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100/40 via-sky-100/30 to-amber-100/30 pointer-events-none" />

        <div className="relative flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
            HN
          </div>

          <div className="space-y-0.5 text-xs">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-slate-900">{profile.fullName}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-amber-500/10 to-amber-500/20 text-amber-700 border border-amber-300 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>Pro Creator</span>
              </span>
            </div>
            <p className="text-slate-500 font-medium">{profile.email}</p>
            <p className="text-slate-500 font-medium">{profile.phone}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenEditProfile}
          className="relative inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Pencil className="w-3.5 h-3.5" />
          <span>Edit profil</span>
        </button>
      </div>

      {/* Creavy Creator Level & Growth Card (ATM Feature) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-sm text-slate-900">Creavy Creator Level &amp; Performa</h3>
            </div>
            <p className="text-xs text-slate-500">
              Tingkat reputasimu menentukan prioritas persetujuan sampel gratis dan akses ke campaign komisi tinggi.
            </p>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 self-start sm:self-auto flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
            <span>Tingkat: Pro Creator</span>
          </span>
        </div>

        {/* 3 Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium block">Tingkat Penyelesaian Tugas</span>
            <div className="flex items-center gap-1.5 font-black text-slate-900 text-sm">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>100% Tepat Waktu</span>
            </div>
            <p className="text-[10px] text-slate-400">4 dari 4 tugas selesai sempurna</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium block">Hak Istimewa Sampel</span>
            <div className="flex items-center gap-1.5 font-black text-slate-900 text-sm">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Prioritas Approval</span>
            </div>
            <p className="text-[10px] text-slate-400">Pengiriman sampel 1–2 hari kerja</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium block">Target Level Berikutnya</span>
            <div className="flex items-center gap-1.5 font-black text-slate-900 text-sm">
              <Award className="w-4 h-4 text-purple-600" />
              <span>Star Creator</span>
            </div>
            <p className="text-[10px] text-slate-400">Kurang 6 tugas lagi untuk naik tier</p>
          </div>
        </div>

        {/* Progress bar to Star Creator */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] font-semibold">
            <span className="text-slate-600">Progress menuju 🌟 Star Creator</span>
            <span className="text-indigo-600 font-bold">40% Selesai</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-600 to-violet-500 rounded-full w-[40%]" />
          </div>
        </div>
      </div>

      {/* Section 1: Media Sosial Terhubung */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="font-bold text-sm text-slate-900">
            Media Sosial Terhubung
          </h3>

          <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
            <span className="text-slate-400 text-[11px] hidden sm:inline">
              Terakhir diperbarui: 11 Sep 2026 10:20:55
            </span>
            <button
              type="button"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-xs hover:bg-slate-50"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Perbarui Data</span>
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-indigo-500 text-indigo-600 font-semibold text-xs hover:bg-indigo-50"
            >
              <Plus className="w-3 h-3" />
              <span>Media Sosial Baru</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {connectedTiktok ? (
            /* Card TikTok */
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs overflow-hidden">
                  {connectedTiktok.avatarUrl ? (
                    <img src={connectedTiktok.avatarUrl} alt={connectedTiktok.displayName} className="w-full h-full object-cover" />
                  ) : (
                    "TT"
                  )}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-slate-900">@{connectedTiktok.handle}</span>
                    {connectedTiktok.isVerified && (
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Followers: {connectedTiktok.followerCount ? connectedTiktok.followerCount.toLocaleString("id-ID") : "0"}
                  </p>
                </div>
              </div>

              <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full">
                Terhubung
              </span>
            </div>
          ) : (
            <div className="col-span-full bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-4 text-center">
              <p className="text-xs text-slate-500">Belum ada akun TikTok yang terhubung.</p>
            </div>
          )}
        </div>
      </div>

      {/* Section 2 & 3: Alamat and Rekening Pembayaran Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Box Alamat */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Alamat</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenAddressList}
                className="text-xs text-slate-600 hover:text-slate-900 px-2 py-1 rounded-lg hover:bg-slate-100"
              >
                Lihat daftar alamat
              </button>
              <button
                type="button"
                onClick={onOpenAddressModal}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-indigo-500 text-indigo-600 font-semibold text-xs hover:bg-indigo-50"
              >
                <Plus className="w-3 h-3" />
                <span>Alamat baru</span>
              </button>
            </div>
          </div>

          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm space-y-1.5 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">{addr.recipientName}</span>
                {addr.isDefault && (
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                    Alamat utama
                  </span>
                )}
              </div>
              <p className="text-slate-500">{addr.phone}</p>
              <p className="text-slate-700 font-medium leading-relaxed">
                {addr.province}, {addr.city}, {addr.district}, {addr.postalCode}
              </p>
              <p className="text-slate-500">{addr.street}</p>
            </div>
          ))}
        </div>

        {/* Box Rekening Pembayaran */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Rekening Pembayaran</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenBankList}
                className="text-xs text-slate-600 hover:text-slate-900 px-2 py-1 rounded-lg hover:bg-slate-100"
              >
                Lihat daftar rekening
              </button>
              <button
                type="button"
                onClick={onOpenBankModal}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-indigo-500 text-indigo-600 font-semibold text-xs hover:bg-indigo-50"
              >
                <Plus className="w-3 h-3" />
                <span>Rekening baru</span>
              </button>
            </div>
          </div>

          {bankAccounts.map((b) => (
            <div
              key={b.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm space-y-1.5 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">{b.bankName}</span>
                {b.isDefault && (
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                    Rekening utama
                  </span>
                )}
              </div>
              <p className="text-slate-700 font-medium">{b.accountHolder}</p>
              <p className="text-slate-500 font-mono text-sm font-semibold">{b.accountNumber}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Butuh Bantuan Pill (Exact Gro Creator Style) */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          type="button"
          onClick={onOpenHelp}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-lg transition-all"
        >
          <HelpCircle className="w-4 h-4 text-indigo-400" />
          <span>Butuh Bantuan</span>
        </button>
      </div>

      {/* MODAL 1: EDIT PROFIL */}
      <Modal
        isOpen={isEditProfileOpen}
        onOpenChange={onEditProfileChange}
        size="md"
        placement="center"
        backdrop="blur"
      >
        <ModalContent className="bg-white text-slate-900 border border-slate-200 shadow-2xl rounded-2xl">
          {(onClose) => (
            <>
              <ModalHeader className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm text-slate-900">Edit Profil</h3>
              </ModalHeader>
              <ModalBody className="py-4 space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Nomor WhatsApp</label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Jenis Kelamin</label>
                  <select
                    value={profile.gender}
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 bg-white"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
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
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  Simpan Perubahan
                </button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* MODAL 2: ALAMAT BARU (With Cascading Wilayah API) */}
      <Modal
        isOpen={isAddressModalOpen}
        onOpenChange={onAddressModalChange}
        size="2xl"
        placement="center"
        backdrop="blur"
      >
        <ModalContent className="bg-white text-slate-900 border border-slate-200 shadow-2xl rounded-2xl">
          {(onClose) => (
            <>
              <ModalHeader className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm text-slate-900">Tambah Alamat Baru</h3>
              </ModalHeader>
              <ModalBody className="py-4 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Nama Penerima</label>
                    <input
                      type="text"
                      placeholder="Nama lengkap penerima paket"
                      value={newAddress.recipientName}
                      onChange={(e) => setNewAddress({ ...newAddress, recipientName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Nomor Telepon</label>
                    <input
                      type="text"
                      placeholder="+62 812-3456-7890"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Dropdown Wilayah Indonesia (Provinsi -> Kota -> Kecamatan -> Kelurahan) */}
                <WilayahSelect
                  onChange={(w: SelectedWilayah) => {
                    setNewAddress((prev) => ({
                      ...prev,
                      provinceName: w.provinceName,
                      regencyName: w.regencyName,
                      districtName: w.districtName,
                      villageName: w.villageName,
                    }));
                  }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Kode Pos</label>
                    <input
                      type="text"
                      placeholder="10650"
                      value={newAddress.postalCode}
                      onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 font-semibold mb-1">Alamat Lengkap</label>
                    <input
                      type="text"
                      placeholder="Nama jalan, nomor rumah, RT/RW, patokan"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
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
                  onClick={() => handleSaveAddress(onClose)}
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  Simpan Alamat
                </button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* MODAL 3: DAFTAR ALAMAT */}
      <Modal
        isOpen={isAddressListOpen}
        onOpenChange={onAddressListChange}
        size="lg"
        placement="center"
        backdrop="blur"
      >
        <ModalContent className="bg-white text-slate-900 border border-slate-200 shadow-2xl rounded-2xl">
          {(onClose) => (
            <>
              <ModalHeader className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <h3 className="font-bold text-sm text-slate-900">Daftar Alamat Pengiriman</h3>
              </ModalHeader>
              <ModalBody className="py-4 space-y-3 text-xs">
                {addresses.map((a) => (
                  <div key={a.id} className="p-3.5 border border-slate-200 rounded-2xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{a.recipientName}</span>
                      {a.isDefault ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600">
                          Utama
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setAddresses(
                              addresses.map((item) => ({ ...item, isDefault: item.id === a.id }))
                            );
                          }}
                          className="text-[11px] text-indigo-600 font-semibold hover:underline"
                        >
                          Jadikan Utama
                        </button>
                      )}
                    </div>
                    <p className="text-slate-500">{a.phone}</p>
                    <p className="text-slate-700 font-medium">
                      {a.province}, {a.city}, {a.district}, {a.postalCode}
                    </p>
                    <p className="text-slate-500">{a.street}</p>
                  </div>
                ))}
              </ModalBody>
              <ModalFooter className="border-t border-slate-100 py-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Tutup
                </button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* MODAL 4: REKENING BARU */}
      <Modal
        isOpen={isBankModalOpen}
        onOpenChange={onBankModalChange}
        size="md"
        placement="center"
        backdrop="blur"
      >
        <ModalContent className="bg-white text-slate-900 border border-slate-200 shadow-2xl rounded-2xl">
          {(onClose) => (
            <>
              <ModalHeader className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm text-slate-900">Tambah Rekening Baru</h3>
              </ModalHeader>
              <ModalBody className="py-4 space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Nama Bank</label>
                  <select
                    value={newBank.bankName}
                    onChange={(e) => setNewBank({ ...newBank, bankName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 bg-white"
                  >
                    {POPULAR_BANKS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Nomor Rekening</label>
                  <input
                    type="text"
                    placeholder="Contoh: 8832216606"
                    value={newBank.accountNumber}
                    onChange={(e) => setNewBank({ ...newBank, accountNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Nama Pemilik Rekening</label>
                  <input
                    type="text"
                    placeholder="Sesuai buku tabungan / m-Banking"
                    value={newBank.accountHolder}
                    onChange={(e) => setNewBank({ ...newBank, accountHolder: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
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
                  onClick={() => handleSaveBank(onClose)}
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  Simpan Rekening
                </button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* MODAL 5: DAFTAR REKENING */}
      <Modal
        isOpen={isBankListOpen}
        onOpenChange={onBankListChange}
        size="md"
        placement="center"
        backdrop="blur"
      >
        <ModalContent className="bg-white text-slate-900 border border-slate-200 shadow-2xl rounded-2xl">
          {(onClose) => (
            <>
              <ModalHeader className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm text-slate-900">Daftar Rekening Pembayaran</h3>
              </ModalHeader>
              <ModalBody className="py-4 space-y-3 text-xs">
                {bankAccounts.map((b) => (
                  <div key={b.id} className="p-3.5 border border-slate-200 rounded-2xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{b.bankName}</span>
                      {b.isDefault ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600">
                          Utama
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setBankAccounts(
                              bankAccounts.map((item) => ({ ...item, isDefault: item.id === b.id }))
                            );
                          }}
                          className="text-[11px] text-indigo-600 font-semibold hover:underline"
                        >
                          Jadikan Utama
                        </button>
                      )}
                    </div>
                    <p className="text-slate-700 font-medium">{b.accountHolder}</p>
                    <p className="text-slate-500 font-mono font-semibold">{b.accountNumber}</p>
                  </div>
                ))}
              </ModalBody>
              <ModalFooter className="border-t border-slate-100 py-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Tutup
                </button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* MODAL 6: BUTUH BANTUAN */}
      <Modal
        isOpen={isHelpOpen}
        onOpenChange={onHelpChange}
        size="md"
        placement="center"
        backdrop="blur"
      >
        <ModalContent className="bg-white text-slate-900 border border-slate-200 shadow-2xl rounded-2xl">
          {(onClose) => (
            <>
              <ModalHeader className="border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  <h3 className="font-bold text-sm text-slate-900">Pusat Bantuan &amp; Tim Creavy</h3>
                </div>
              </ModalHeader>
              <ModalBody className="py-4 space-y-4 text-xs">
                <p className="text-slate-600">
                  Ada kendala terkait pengiriman sampel, link keranjang kuning, atau pembayaran komisi? Hubungi langsung PIC Support kami:
                </p>

                <a
                  href="https://wa.me/6289624272784?text=Halo%20Admin%20Creavy,%20saya%20kreator%20butuh%20bantuan"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 hover:bg-emerald-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs">Chat WhatsApp Tim Support</h4>
                      <p className="text-[11px] text-emerald-600">+62 896-2427-2784 (Fast Response)</p>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="font-bold text-slate-800">Pertanyaan Sering Ditanyakan (FAQ):</h4>
                  <div className="space-y-1.5 text-slate-600 text-[11px]">
                    <p><strong>Kapan sampel saya dikirim?</strong> Sampel dikirim dalam 1-2 hari kerja setelah pendaftaran disetujui admin.</p>
                    <p><strong>Bagaimana sistem auto-detection bekerja?</strong> Cukup sertakan hashtag wajib di caption video TikTok Anda. Sistem kami mendeteksi postingan live secara berkala.</p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="border-t border-slate-100 py-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Tutup
                </button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
