"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Spinner } from "@heroui/react";
import {
  Lock,
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Mail,
  User,
  FileText,
} from "lucide-react";

function GoogleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="20" height="20" style={{ minWidth: "20px", minHeight: "20px" }}>
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
  const [showRequestForm, setShowRequestForm] = useState(false);

  // Request form state
  const [reqName, setReqName] = useState("");
  const [reqEmail, setReqEmail] = useState("");
  const [reqReason, setReqReason] = useState("");
  const [reqLoading, setReqLoading] = useState(false);
  const [reqResult, setReqResult] = useState<{ type: "success" | "error"; message: string } | null>(null);

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

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setReqLoading(true);
    setReqResult(null);
    try {
      const res = await fetch("/api/admin/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: reqName, email: reqEmail, reason: reqReason }),
      });
      const data = await res.json();
      if (res.ok) {
        setReqResult({ type: "success", message: data.message });
        setReqName("");
        setReqEmail("");
        setReqReason("");
      } else {
        setReqResult({ type: "error", message: data.error || "Terjadi kesalahan." });
      }
    } catch {
      setReqResult({ type: "error", message: "Gagal terhubung ke server." });
    } finally {
      setReqLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/20 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-4">

        {/* Logo / Brand */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2.5 mb-3">
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-purple-600 to-pink-500 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-purple-500/25">
              C
            </span>
            <div className="text-left">
              <p className="font-black text-base text-foreground leading-tight">Creavy</p>
              <p className="text-[10px] text-default-400 font-medium leading-tight">Operations Portal</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 text-[10px] font-bold tracking-widest text-red-600 dark:text-red-400 uppercase">
            🔒 Internal Only
          </span>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/30 overflow-hidden">

          <div className="p-7 space-y-5">
            <div>
              <h1 className="text-xl font-black tracking-tight text-foreground">Masuk ke Portal Admin</h1>
              <p className="text-xs text-default-400 mt-1">Akses khusus PIC, Admin, dan Tim Manajemen Agensi Creavy.</p>
            </div>

            {/* Error Banner */}
            {errorParam && (
              <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 rounded-2xl flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                <div>
                  <p className="font-bold text-xs text-red-700 dark:text-red-300">Akses Ditolak</p>
                  <p className="text-[11px] text-red-600/80 dark:text-red-400/80 mt-0.5">
                    {errorParam === "unauthorized_email" || errorParam === "not_admin"
                      ? "Email Google Anda belum terdaftar sebagai Admin/PIC internal. Ajukan permintaan akses di bawah."
                      : "Sesi login berakhir atau tidak valid. Silakan login kembali."}
                  </p>
                </div>
              </div>
            )}

            {/* Google Login Button */}
            <button
              onClick={handleAdminGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 h-12 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-sm text-slate-800 dark:text-white hover:border-brand-400 hover:bg-brand-50/30 dark:hover:bg-slate-700 transition-all shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Spinner size="sm" color="default" />
                  <span className="text-xs">Memverifikasi...</span>
                </>
              ) : (
                <>
                  <GoogleIcon className="w-5 h-5 shrink-0" />
                  <span className="text-xs">Masuk dengan Akun Google Admin</span>
                </>
              )}
            </button>

            {/* Security Note */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1.5">
              <p className="font-bold text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Ketentuan Keamanan
              </p>
              <ul className="space-y-1 pl-1 text-[11px] text-slate-500 dark:text-slate-400">
                <li>• Email harus terdaftar sebagai Admin di sistem oleh Superadmin.</li>
                <li>• Seluruh aktivitas admin terekam di audit log sistem.</li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 dark:border-slate-800" />

          {/* Request Access Toggle */}
          <div className="px-7 py-4">
            <button
              onClick={() => setShowRequestForm(!showRequestForm)}
              className="w-full flex items-center justify-between text-xs font-semibold text-default-500 hover:text-brand-600 transition-colors group"
            >
              <span className="flex items-center gap-1.5">
                <UserPlus className="w-3.5 h-3.5" />
                Belum punya akses? Ajukan permintaan ke Superadmin
              </span>
              {showRequestForm ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Request Access Form */}
            {showRequestForm && (
              <form onSubmit={handleRequestAccess} className="mt-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
                {reqResult && (
                  <div
                    className={`p-3 rounded-xl flex items-start gap-2 text-xs ${
                      reqResult.type === "success"
                        ? "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                        : "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
                    }`}
                  >
                    {reqResult.type === "success" ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    ) : (
                      <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                    )}
                    <span>{reqResult.message}</span>
                  </div>
                )}

                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-default-400" />
                  <input
                    type="text"
                    required
                    placeholder="Nama Lengkap"
                    value={reqName}
                    onChange={(e) => setReqName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-foreground placeholder:text-default-400 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400/30 transition-all"
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-default-400" />
                  <input
                    type="email"
                    required
                    placeholder="Email Google (yang akan digunakan login)"
                    value={reqEmail}
                    onChange={(e) => setReqEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-foreground placeholder:text-default-400 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400/30 transition-all"
                  />
                </div>

                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-3.5 h-3.5 text-default-400" />
                  <textarea
                    placeholder="Alasan / jabatan (opsional)"
                    value={reqReason}
                    onChange={(e) => setReqReason(e.target.value)}
                    rows={2}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-foreground placeholder:text-default-400 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400/30 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={reqLoading}
                  className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white text-xs font-bold hover:opacity-90 transition-all shadow-md shadow-brand-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {reqLoading ? (
                    <>
                      <Spinner size="sm" color="white" />
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Kirim Permintaan Akses</span>
                    </>
                  )}
                </button>

                <p className="text-center text-[10px] text-default-400">
                  Superadmin akan mengubah role kamu di database setelah verifikasi. Proses 1–2 hari kerja.
                </p>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-[11px] text-default-400">
          © 2025 Creavy by Novacore · Internal use only
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
