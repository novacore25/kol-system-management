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
  Spinner,
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
  ShieldCheck,
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

// SVG Icon for Google
function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export function CreatorRegistrationForm() {
  const [step, setStep] = useState(1);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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

  // Trigger Google OAuth with current registration data encoded in state
  const handleGoogleSubmit = async () => {
    try {
      setIsGoogleLoading(true);
      const res = await fetch("/api/auth/google/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationData: formData,
          returnUrl: "/my-tasks",
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Gagal memuat URL Google Auth. Silakan coba lagi.");
        setIsGoogleLoading(false);
      }
    } catch (err) {
      console.error("Google Auth error:", err);
      alert("Terjadi kesalahan saat menghubungkan ke Google.");
      setIsGoogleLoading(false);
    }
  };

  // Direct login for users who just want to login with Google
  const handleQuickGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      const res = await fetch("/api/auth/google/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returnUrl: "/my-tasks" }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
      setIsGoogleLoading(false);
    }
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
    <Card className="max-w-2xl mx-auto border border-divider/60 shadow-xl rounded-3xl overflow-hidden bg-background">
      {/* Quick Google Login Option at Top */}
      <div className="bg-default-50/70 border-b border-divider/60 px-6 py-3 flex items-center justify-between">
        <span className="text-xs text-default-500 font-medium">Sudah pernah mendaftar sebelumnya?</span>
        <Button
          size="sm"
          variant="bordered"
          className="bg-white dark:bg-default-100 border-default-200 text-xs font-semibold"
          startContent={isGoogleLoading ? <Spinner size="sm" /> : <GoogleIcon className="w-3.5 h-3.5" />}
          onClick={handleQuickGoogleLogin}
          isDisabled={isGoogleLoading}
        >
          Masuk dengan Google
        </Button>
      </div>

      {/* Progress Steps Header */}
      <CardHeader className="flex flex-col gap-3 p-6 bg-default-50/50 border-b border-divider/60">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Chip size="sm" color="primary" variant="flat" className="font-bold">
              Langkah {step} dari 4
            </Chip>
            <span className="text-sm font-extrabold text-foreground">
              {step === 1 && "Profil & Niche Kreator"}
              {step === 2 && "Alamat Pengiriman Sampel"}
              {step === 3 && "Rekening Fee & Reward"}
              {step === 4 && "Hubungkan TikTok & Akun Google"}
            </span>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-4 gap-2 w-full pt-1">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= step ? "bg-brand-600" : "bg-default-200 dark:bg-default-100"
              }`}
            />
          ))}
        </div>
      </CardHeader>

      <CardBody className="p-6">
        {/* STEP 1: Profil Kreator */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-foreground">Data Pribadi Kreator</h3>
              <p className="text-xs text-default-500">
                Nama dan WhatsApp ini akan digunakan tim PIC agency untuk berkoordinasi dan konfirmasi sampel.
              </p>
            </div>

            <Input
              label="Nama Lengkap"
              placeholder="Contoh: Baban Maulana"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              startContent={<User className="w-4 h-4 text-default-400" />}
              variant="bordered"
              isRequired
            />

            <Input
              label="Nomor WhatsApp PIC"
              placeholder="Contoh: 08123456789"
              value={formData.whatsappNumber}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              startContent={<Phone className="w-4 h-4 text-default-400" />}
              variant="bordered"
              description="Pastikan nomor aktif untuk konfirmasi pengiriman resi sampel."
              isRequired
            />

            <Select
              label="Kategori / Niche Konten Utama"
              placeholder="Pilih Niche Kamu"
              selectedKeys={formData.niche ? [formData.niche] : []}
              onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
              variant="bordered"
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
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-foreground flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-600" />
                Alamat Tujuan Sampel Produk
              </h3>
              <p className="text-xs text-default-500">
                Pastikan data wilayah tepat agar paket sampel dari brand sampai tanpa kendala kurir.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Nama Penerima Paket"
                placeholder="Nama kamu atau nama orang rumah"
                value={formData.recipientName || formData.fullName}
                onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                variant="bordered"
                isRequired
              />
              <Input
                label="Nomor HP Penerima"
                placeholder="08xxxxxxxxxx"
                value={formData.shippingPhone || formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, shippingPhone: e.target.value })}
                variant="bordered"
                isRequired
              />
            </div>

            {/* Hierarchical Indonesian Region Selector */}
            <WilayahSelect onChange={handleWilayahChange} />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <Input
                  label="Alamat Lengkap & Patokan"
                  placeholder="Jl. Melati No. 12, RT 02/RW 05, Pagar Hitam"
                  value={formData.streetAddress}
                  onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                  variant="bordered"
                  isRequired
                />
              </div>
              <Input
                label="Kode Pos"
                placeholder="40123"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                variant="bordered"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Rekening Bank */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-foreground flex items-center gap-1.5">
                <Building className="w-4 h-4 text-brand-600" />
                Informasi Rekening Bank
              </h3>
              <p className="text-xs text-default-500">
                Digunakan untuk pencairan fixed-fee campaign atau bonus performa awareness dari agency Creavy.
              </p>
            </div>

            <Select
              label="Pilih Bank / E-Wallet"
              placeholder="Pilih Bank"
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

        {/* STEP 4: Hubungkan TikTok & Google */}
        {step === 4 && (
          <div className="space-y-5 text-center py-2 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-gradient-to-tr from-pink-500 via-purple-600 to-brand-600 text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-foreground">Hubungkan Akun TikTok & Google Kamu</h3>
              <p className="text-xs text-default-500 max-w-sm mx-auto">
                Dengan menghubungkan akun TikTok & profil Google, sistem Creavy otomatis mendeteksi upload video kamu dan memvalidasi akun.
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-4 text-left">
              <Input
                label="Handle Akun TikTok (@username)"
                placeholder="@banibanzl"
                value={formData.tiktokHandle}
                onChange={(e) => setFormData({ ...formData, tiktokHandle: e.target.value })}
                variant="bordered"
                description="Masukkan username TikTok yang kamu gunakan untuk konten affiliate / TikTok Go."
                isRequired
              />

              <div className="p-4 bg-default-50 dark:bg-default-100/50 rounded-2xl border border-divider/60 space-y-2.5">
                <p className="font-bold text-xs flex items-center gap-1.5 text-brand-600">
                  <ShieldCheck className="w-4 h-4" />
                  Keamanan & Sinkronisasi Otomatis:
                </p>
                <ul className="text-xs text-default-600 space-y-1 pl-1">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    <span>Profil dan email resmi akan diverifikasi langsung via akun Google kamu.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    <span>Alamat sampel dan nomor rekening otomatis tersimpan aman di database.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    <span>Auto-tracking penjualan keranjang kuning & voucher TikTok Go.</span>
                  </li>
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
            isDisabled={isGoogleLoading}
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
            onClick={handleGoogleSubmit}
            isDisabled={isGoogleLoading}
            startContent={isGoogleLoading ? <Spinner size="sm" color="white" /> : <GoogleIcon className="w-4 h-4" />}
            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 font-bold text-xs px-5 shadow-lg shadow-slate-950/20"
          >
            {isGoogleLoading ? "Menghubungkan ke Google..." : "Daftar & Hubungkan dengan Google"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
