"use client";

import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Divider,
  Chip,
} from "@heroui/react";
import {
  User,
  Phone,
  CreditCard,
  Sparkles,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building,
} from "lucide-react";
import { WilayahSelect, SelectedWilayah } from "./WilayahSelect";

const POPULAR_BANKS = [
  { key: "BCA", name: "Bank Central Asia (BCA)" },
  { key: "MANDIRI", name: "Bank Mandiri" },
  { key: "BRI", name: "Bank Rakyat Indonesia (BRI)" },
  { key: "BNI", name: "Bank Negara Indonesia (BNI)" },
  { key: "BSI", name: "Bank Syariah Indonesia (BSI)" },
  { key: "JAGO", name: "Bank Jago" },
  { key: "SEABANK", name: "SeaBank Indonesia" },
  { key: "CIMB", name: "CIMB Niaga" },
];

const NICHES = [
  "Beauty & Skincare",
  "Fashion & Hijab",
  "Food & Beverage",
  "Gadget & Elektronik",
  "Home & Living",
  "Mom & Baby",
  "Health & Wellness",
  "Entertainment & Humor",
];

export function CreatorRegistrationForm() {
  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    whatsappNumber: "",
    niche: "",
    email: "",
    // Shipping Address
    recipientName: "",
    shippingPhone: "",
    provinceName: "",
    regencyName: "",
    districtName: "",
    villageName: "",
    postalCode: "",
    streetAddress: "",
    // Bank Account
    bankName: "",
    bankAccountNumber: "",
    bankAccountHolder: "",
    // TikTok Account
    tiktokHandle: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleWilayahChange = (wilayah: SelectedWilayah) => {
    setFormData((prev) => ({
      ...prev,
      provinceName: wilayah.provinceName,
      regencyName: wilayah.regencyName,
      districtName: wilayah.districtName,
      villageName: wilayah.villageName,
    }));
  };

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card className="max-w-xl mx-auto border border-divider/60 shadow-xl rounded-3xl p-6 text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 mx-auto rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-2xl font-black tracking-tight text-foreground">
            Pendaftaran Berhasil!
          </h2>
          <p className="text-sm text-default-500 max-w-md mx-auto">
            Data profil, rekening bank, dan alamat pengiriman sampel kamu sudah tersimpan. Sekarang kamu bisa langsung memilih campaign dan meminta sampel gratis!
          </p>
        </div>

        <div className="bg-default-50 dark:bg-default-100/50 rounded-2xl p-4 text-left space-y-2 text-xs">
          <div className="flex justify-between border-b border-divider pb-1.5">
            <span className="text-default-500">Nama Kreator</span>
            <span className="font-bold text-default-800">{formData.fullName}</span>
          </div>
          <div className="flex justify-between border-b border-divider pb-1.5">
            <span className="text-default-500">WhatsApp PIC</span>
            <span className="font-bold text-default-800">{formData.whatsappNumber}</span>
          </div>
          <div className="flex justify-between border-b border-divider pb-1.5">
            <span className="text-default-500">Rekening</span>
            <span className="font-bold text-default-800">
              {formData.bankName} - {formData.bankAccountNumber} (a.n {formData.bankAccountHolder})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-default-500">Tujuan Sampel</span>
            <span className="font-bold text-default-800 text-right">
              {formData.districtName}, {formData.regencyName}, {formData.provinceName}
            </span>
          </div>
        </div>

        <Button
          as="a"
          href="/"
          color="primary"
          size="lg"
          className="w-full bg-gradient-to-r from-brand-600 to-purple-600 text-white font-bold"
        >
          Lihat Katalog Campaign & Minta Sampel
        </Button>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto border border-divider/60 shadow-xl rounded-3xl overflow-hidden">
      {/* Progress Steps Header */}
      <CardHeader className="p-6 bg-gradient-to-r from-slate-900 via-brand-950 to-purple-950 text-white flex flex-col items-start gap-3">
        <div className="flex items-center justify-between w-full">
          <Chip size="sm" variant="flat" className="bg-white/10 text-purple-200">
            Langkah {step} dari 4
          </Chip>
          <span className="text-xs text-slate-300 font-medium">Nusantara Creator Hub</span>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            {step === 1 && "Data Diri & WhatsApp Kreator"}
            {step === 2 && "Alamat Pengiriman Sampel Gratis"}
            {step === 3 && "Informasi Rekening Bank"}
            {step === 4 && "Hubungkan Akun TikTok"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            {step === 1 && "Pastikan nomor WhatsApp aktif untuk koordinasi pengiriman sampel & campaign."}
            {step === 2 && "Pilih wilayah Indonesia untuk pengiriman paket sampel produk brand secara akurat."}
            {step === 3 && "Digunakan untuk verifikasi identitas dan pencairan insentif agency resmi."}
            {step === 4 && "Kaitkan handle TikTok kamu agar video tugas dapat dideteksi secara otomatis."}
          </p>
        </div>

        {/* Step Indicator Pills */}
        <div className="grid grid-cols-4 gap-1.5 w-full pt-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s <= step ? "bg-gradient-to-r from-brand-400 to-purple-400" : "bg-white/20"
              }`}
            />
          ))}
        </div>
      </CardHeader>

      <CardBody className="p-6 space-y-4">
        {/* STEP 1: Data Diri & WhatsApp */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <Input
              label="Nama Lengkap"
              placeholder="Contoh: Hibban Nazala"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              startContent={<User className="w-4 h-4 text-default-400" />}
              variant="bordered"
              isRequired
            />

            <Input
              label="Nomor WhatsApp"
              placeholder="Contoh: 089624272784 / 628..."
              value={formData.whatsappNumber}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              startContent={<Phone className="w-4 h-4 text-emerald-500" />}
              variant="bordered"
              description="Tim PIC agency akan menghubungi nomor ini untuk konfirmasi resi kurir."
              isRequired
            />

            <Input
              label="Email Aktif"
              placeholder="nama@email.com"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              variant="bordered"
              isRequired
            />

            <Select
              label="Niche / Kategori Utama Konten"
              placeholder="Pilih Kategori Kontenmu"
              variant="bordered"
              selectedKeys={formData.niche ? [formData.niche] : []}
              onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
              isRequired
            >
              {NICHES.map((niche) => (
                <SelectItem key={niche} textValue={niche}>
                  {niche}
                </SelectItem>
              ))}
            </Select>
          </div>
        )}

        {/* STEP 2: Alamat Pengiriman Sampel */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Nama Penerima Paket"
                placeholder="Nama lengkap penerima"
                value={formData.recipientName || formData.fullName}
                onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                variant="bordered"
                isRequired
              />
              <Input
                label="No. HP Penerima"
                placeholder="Nomor kurir bisa hubungi"
                value={formData.shippingPhone || formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, shippingPhone: e.target.value })}
                variant="bordered"
                isRequired
              />
            </div>

            {/* Cascading Wilayah Dropdown */}
            <WilayahSelect onChange={handleWilayahChange} />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Kode Pos"
                placeholder="10650"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                variant="bordered"
                className="sm:col-span-1"
                isRequired
              />
              <Input
                label="Alamat Jalan / Patokan Rumah"
                placeholder="Jl. Taruna Jaya No. 42, RT 01/RW 02 (Pagar Hitam)"
                value={formData.streetAddress}
                onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                variant="bordered"
                className="sm:col-span-2"
                isRequired
              />
            </div>
          </div>
        )}

        {/* STEP 3: Rekening Bank */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <Select
              label="Pilih Bank"
              placeholder="Pilih Bank Pencairan"
              startContent={<Building className="w-4 h-4 text-default-400" />}
              variant="bordered"
              selectedKeys={formData.bankName ? [formData.bankName] : []}
              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              isRequired
            >
              {POPULAR_BANKS.map((bank) => (
                <SelectItem key={bank.key} textValue={bank.name}>
                  {bank.name}
                </SelectItem>
              ))}
            </Select>

            <Input
              label="Nomor Rekening"
              placeholder="Contoh: 8832216606"
              value={formData.bankAccountNumber}
              onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
              startContent={<CreditCard className="w-4 h-4 text-default-400" />}
              variant="bordered"
              isRequired
            />

            <Input
              label="Nama Pemilik Rekening"
              placeholder="Harus sesuai dengan nama di buku tabungan / e-wallet"
              value={formData.bankAccountHolder}
              onChange={(e) => setFormData({ ...formData, bankAccountHolder: e.target.value })}
              variant="bordered"
              isRequired
            />
          </div>
        )}

        {/* STEP 4: Hubungkan TikTok */}
        {step === 4 && (
          <div className="space-y-5 text-center py-4 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-gradient-to-tr from-pink-500 via-purple-600 to-brand-600 text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-foreground">Hubungkan Akun TikTok Kamu</h3>
              <p className="text-xs text-default-500 max-w-sm mx-auto">
                Dengan menghubungkan akun, kami bisa otomatis mendeteksi ketika kamu meng-upload video tugas campaign.
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-3">
              <Input
                label="Handle TikTok (@username)"
                placeholder="@banibanzl"
                value={formData.tiktokHandle}
                onChange={(e) => setFormData({ ...formData, tiktokHandle: e.target.value })}
                variant="bordered"
                description="Masukkan username akun TikTok yang kamu gunakan untuk affiliate."
                isRequired
              />

              <div className="p-3 bg-default-50 dark:bg-default-100/50 rounded-xl text-left text-xs text-default-600 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-brand-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Keuntungan Binding Akun:
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-default-500 pl-1">
                  <li>Otomatis terbaca followers & kategori channel</li>
                  <li>Auto-tracking postingan video tanpa form manual</li>
                  <li>Prioritas persetujuan sampel gratis dari brand</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardBody>

      <Divider />

      <CardFooter className="p-4 sm:p-6 flex items-center justify-between bg-default-50/50">
        {step > 1 ? (
          <Button
            variant="flat"
            size="sm"
            onClick={handleBack}
            startContent={<ArrowLeft className="w-4 h-4" />}
            className="font-semibold text-xs"
          >
            Kembali
          </Button>
        ) : (
          <div />
        )}

        {step < 4 ? (
          <Button
            color="primary"
            size="sm"
            onClick={handleNext}
            endContent={<ArrowRight className="w-4 h-4" />}
            className="bg-brand-600 text-white font-bold text-xs"
          >
            Lanjutkan
          </Button>
        ) : (
          <Button
            color="primary"
            size="md"
            onClick={handleSubmit}
            className="bg-gradient-to-r from-brand-600 to-purple-600 text-white font-bold text-xs shadow-md shadow-brand-500/25"
          >
            Selesaikan Pendaftaran & Simpan
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
