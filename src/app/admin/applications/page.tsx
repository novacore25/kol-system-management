import React, { Suspense } from "react";
import { ApplicationReviewTable } from "@/components/admin/ApplicationReviewTable";
import { Loader2 } from "lucide-react";

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

      <Suspense
        fallback={
          <div className="py-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
            <p className="text-xs text-default-500 font-medium">Memuat halaman kurasi...</p>
          </div>
        }
      >
        <ApplicationReviewTable />
      </Suspense>
    </div>
  );
}
