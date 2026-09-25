"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardBody, Button, Spinner } from "@heroui/react";
import { Sparkles, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";

function GoogleIcon({ className = "w-5 h-5" }: { className?: string }) {
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

function LoginFormContent() {
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/my-tasks";
  const errorParam = searchParams.get("error");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/google/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returnUrl }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Gagal memuat Google Login. Cek konfigurasi server.");
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan saat menghubungi server.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="max-w-md w-full border border-divider/70 shadow-2xl rounded-3xl overflow-hidden bg-card">
        <div className="bg-gradient-to-tr from-brand-600 via-purple-600 to-pink-500 p-8 text-center text-white space-y-2">
          <div className="w-14 h-14 bg-white/15 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center shadow-lg">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">Portal Kreator Creavy</h1>
          <p className="text-xs text-purple-100 font-medium max-w-xs mx-auto">
            Masuk untuk mengakses tugas campaign, lacak sampel produk, dan pantau estimasi komisi penjualan.
          </p>
        </div>

        <CardBody className="p-8 space-y-6">
          {errorParam && (
            <div className="p-3.5 bg-danger-50 dark:bg-danger-950/40 border border-danger-200 dark:border-danger-900 rounded-2xl flex items-center gap-2.5 text-danger-700 dark:text-danger-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                {errorParam === "login_required"
                  ? "Silakan login terlebih dahulu untuk mengakses halaman tersebut."
                  : errorParam === "admin_required"
                  ? "Akun Anda terdaftar sebagai Kreator. Akses admin dibatasi."
                  : "Login gagal atau dibatalkan. Silakan coba kembali."}
              </span>
            </div>
          )}

          <div className="space-y-4">
            <Button
              size="lg"
              variant="bordered"
              className="w-full h-13 border-default-300 dark:border-default-100 bg-white dark:bg-default-100 text-slate-800 dark:text-white font-bold text-sm shadow-sm hover:bg-default-50"
              startContent={loading ? <Spinner size="sm" /> : <GoogleIcon className="w-5 h-5" />}
              onClick={handleGoogleLogin}
              isDisabled={loading}
            >
              {loading ? "Menghubungkan ke Google..." : "Lanjutkan dengan Google"}
            </Button>

            <div className="p-4 bg-default-50 dark:bg-default-100/50 rounded-2xl border border-divider/60 space-y-1.5 text-xs text-default-600">
              <p className="font-bold flex items-center gap-1.5 text-brand-600">
                <ShieldCheck className="w-4 h-4" />
                Login Cepat &amp; Aman:
              </p>
              <p className="text-[11px] text-default-500 leading-relaxed">
                Gunakan akun Google yang sama dengan akun saat Anda pertama kali mendaftar agar seluruh riwayat tugas &amp; komisi langsung tersinkronisasi.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-divider/60 text-center space-y-2">
            <p className="text-xs text-default-500">Belum pernah mendaftar sebagai kreator?</p>
            <Button
              as={Link}
              href="/register"
              variant="flat"
              color="primary"
              size="sm"
              className="font-bold text-xs"
              endContent={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Daftar Akun Kreator Baru
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><Spinner size="lg" /></div>}>
      <LoginFormContent />
    </Suspense>
  );
}
