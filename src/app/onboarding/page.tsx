import React from "react";
import { CreatorRegistrationForm } from "@/components/profile/CreatorRegistrationForm";

export default function OnboardingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-2 max-w-lg mx-auto">
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          Pendaftaran Kreator Affiliate
        </h1>
        <p className="text-sm text-default-500">
          Lengkapi data profil, nomor WhatsApp, dan alamat pengiriman sampel produk untuk memulai kolaborasi dengan agency resmi TikTok.
        </p>
      </div>

      <CreatorRegistrationForm />
    </div>
  );
}
