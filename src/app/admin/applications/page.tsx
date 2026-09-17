import React from "react";
import { ApplicationReviewTable } from "@/components/admin/ApplicationReviewTable";

export default function ApplicationsReviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          Kurasi Pendaftar Campaign
        </h1>
        <p className="text-xs sm:text-sm text-default-500">
          Tinjau profil kreator yang mendaftar ke campaign agensi. Periksa statistik TikTok, completion rate, dan setujui untuk alokasi sampel gratis.
        </p>
      </div>

      <ApplicationReviewTable />
    </div>
  );
}
