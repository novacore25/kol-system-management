import React from "react";
import { SampleLogisticsTable } from "@/components/admin/SampleLogisticsTable";

export default function LogisticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          Logistik &amp; Pengiriman Sampel Produk
        </h1>
        <p className="text-xs sm:text-sm text-default-500">
          Kelola pencetakan label alamat dan input nomor resi kurir (J&amp;T, SiCepat, JNE, SPX). Begitu resi diinput, status tugas kreator otomatis ter-update.
        </p>
      </div>

      <SampleLogisticsTable />
    </div>
  );
}
