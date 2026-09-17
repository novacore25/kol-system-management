import React from "react";
import Link from "next/link";
import {
  Card,
  CardBody,
  Button,
  Chip,
} from "@heroui/react";
import {
  Layers,
  UserCheck,
  Truck,
  Video,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
} from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Dashboard Operasional Agency
          </h1>
          <p className="text-xs sm:text-sm text-default-500">
            Kelola kurasi pendaftar kreator, alokasi sampel produk gratis, dan pemantauan video live TikTok Shop.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            as={Link}
            href="/admin/applications"
            color="primary"
            size="sm"
            className="bg-brand-600 text-white font-bold text-xs"
            endContent={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Kurasi Pendaftar (1 Baru)
          </Button>
        </div>
      </div>

      {/* 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <Card className="border border-divider/60 shadow-sm p-4 rounded-2xl bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-default-500">Campaign Aktif</span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-foreground mt-2">4</p>
          <p className="text-[11px] text-default-400 mt-1">Make Over, Emina, Kahf, Skintific</p>
        </Card>

        {/* Metric 2 */}
        <Card className="border border-divider/60 shadow-sm p-4 rounded-2xl bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-default-500">Menunggu Review</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-foreground mt-2">1</p>
          <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold mt-1">
            <Clock className="w-3 h-3" />
            <span>Perlu ditinjau admin</span>
          </div>
        </Card>

        {/* Metric 3 */}
        <Card className="border border-divider/60 shadow-sm p-4 rounded-2xl bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-default-500">Sampel Perlu Resi</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-foreground mt-2">1</p>
          <p className="text-[11px] text-default-400 mt-1">Siap dikirim ekspedisi</p>
        </Card>

        {/* Metric 4 */}
        <Card className="border border-divider/60 shadow-sm p-4 rounded-2xl bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-default-500">Video Terdeteksi Live</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-foreground mt-2">12</p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>Auto-detected via TikTok API</span>
          </div>
        </Card>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kurasi Box */}
        <Card className="border border-divider/60 shadow-sm p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-extrabold text-lg text-foreground">Antrean Kurasi Pendaftar</h3>
              <p className="text-xs text-default-500">
                Tinjau pendaftar baru, verifikasi followers TikTok, dan setujui alokasi sampel gratis.
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="p-3 bg-default-50 dark:bg-default-100/50 rounded-2xl flex items-center justify-between text-xs">
            <span className="font-bold text-default-700">Hibban Nazala (@banibanzl)</span>
            <Chip size="sm" color="warning" variant="flat" className="font-bold text-[10px]">
              Menunggu Review
            </Chip>
          </div>

          <Button
            as={Link}
            href="/admin/applications"
            size="sm"
            color="primary"
            variant="flat"
            className="w-full font-bold text-xs"
            endContent={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Buka Halaman Kurasi Lengkap
          </Button>
        </Card>

        {/* Logistik Box */}
        <Card className="border border-divider/60 shadow-sm p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-extrabold text-lg text-foreground">Pengiriman Sampel & Input Resi</h3>
              <p className="text-xs text-default-500">
                Salin alamat tujuan pengiriman kurir dan input nomor resi pengiriman ekspedisi.
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
          </div>

          <div className="p-3 bg-default-50 dark:bg-default-100/50 rounded-2xl flex items-center justify-between text-xs">
            <span className="font-bold text-default-700">Siti Rahmawati - Emina Glossy Tint</span>
            <Chip size="sm" color="warning" variant="flat" className="font-bold text-[10px]">
              Perlu Input Resi
            </Chip>
          </div>

          <Button
            as={Link}
            href="/admin/logistics"
            size="sm"
            color="primary"
            variant="flat"
            className="w-full font-bold text-xs"
            endContent={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Kelola Pengiriman Sampel
          </Button>
        </Card>
      </div>
    </div>
  );
}
