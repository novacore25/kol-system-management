"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardBody, Button, Spinner } from "@heroui/react";
import { Lock, ShieldAlert, ShieldCheck } from "lucide-react";

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

function AdminLoginForm() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const [loading, setLoading] = useState(false);

  const handleAdminGoogleLogin = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/google/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returnUrl: "/admin" }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Gagal memuat Google Auth URL. Cek konfigurasi server.");
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan server.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <Card className="max-w-md w-full bg-slate-900 border border-slate-800 shadow-2xl rounded-3xl overflow-hidden text-slate-100">
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-8 text-center space-y-3 border-b border-slate-800">
          <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-black tracking-wider text-red-400 uppercase mb-2">
              Internal Only
            </div>
            <h1 className="text-xl font-black tracking-tight text-white">
              Creavy Operations Portal
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Akses khusus PIC, Admin, dan Tim Manajemen Agensi Creavy.
            </p>
          </div>
        </div>

        <CardBody className="p-8 space-y-6">
          {errorParam && (
            <div className="p-4 bg-red-950/50 border border-red-800/80 rounded-2xl flex items-start gap-3 text-red-300 text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <div>
                <p className="font-bold text-red-200">Akses Ditolak</p>
                <p className="text-[11px] text-red-300/80 mt-0.5">
                  {errorParam === "unauthorized_email" || errorParam === "not_admin"
                    ? "Email Google Anda tidak terdaftar sebagai Admin/PIC internal. Silakan hubungi Superadmin."
                    : "Sesi login berakhir atau tidak valid. Silakan login kembali."}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <Button
              size="lg"
              className="w-full h-13 bg-white text-slate-950 hover:bg-slate-100 font-bold text-xs shadow-lg shadow-white/5"
              startContent={loading ? <Spinner size="sm" color="default" /> : <GoogleIcon className="w-5 h-5" />}
              onClick={handleAdminGoogleLogin}
              isDisabled={loading}
            >
              {loading ? "Memverifikasi Otorisasi..." : "Masuk dengan Akun Google Admin"}
            </Button>

            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-2 text-[11px] text-slate-400">
              <p className="font-bold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Ketentuan Keamanan:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-slate-400">
                <li>Gunakan email terdaftar pada variable <code className="text-red-400 bg-red-950/50 px-1 py-0.5 rounded">ADMIN_EMAILS</code>.</li>
                <li>Seluruh aktivitas kurasi, logistik, dan ingest data terekam pada audit log.</li>
              </ul>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white"><Spinner size="lg" /></div>}>
      <AdminLoginForm />
    </Suspense>
  );
}
