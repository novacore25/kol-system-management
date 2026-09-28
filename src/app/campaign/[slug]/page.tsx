"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  ShoppingBag,
  MapPin,
  Calendar,
  Users,
  Gift,
  Tag,
  ExternalLink,
  Send,
  AlertCircle,
  Loader2,
  Hash,
  AtSign,
  Star,
  Clock,
  LogIn,
  Lock,
  ChevronDown,
  UserCircle2,
  X,
} from "lucide-react";

interface CampaignDetail {
  id: string;
  title: string;
  slug: string;
  brandName: string;
  bannerUrl: string;
  description: string;
  brief?: string;
  platformType: "TIKTOK_SHOP" | "TIKTOK_GO";
  salePrice?: string;
  shopName?: string;
  locationName?: string;
  industryCategory?: string;
  benefitType?: string;
  commissionRateText: string;
  isFreeSample: boolean;
  sampleQuota: number;
  sampleStockRemaining: number;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  mandatoryHashtags: string[];
  mandatoryMentions: string[];
  sowItems: string[];
  targetAffiliateLink?: string;
  productSkus: Array<{
    productId: string;
    productName: string;
    salePrice?: string;
    productLink?: string;
    commissionRate?: string;
  }>;
  status: string;
}

export default function CampaignPublicPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Auth state
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [creatorProfile, setCreatorProfile] = useState<any>(null);
  const [tiktokAccounts, setTiktokAccounts] = useState<any[]>([]);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Form state (managed separately from auth)
  const [selectedTiktokId, setSelectedTiktokId] = useState<string>("");
  const [form, setForm] = useState({
    applicantName: "",
    applicantWhatsapp: "",
    applicantTiktokHandle: "",
    applicantFollowerCount: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setIsLoggedIn(true);
          setCurrentUser(data.user);
          setCreatorProfile(data.creatorProfile);
          setTiktokAccounts(data.tiktokAccounts || []);

          // Auto-fill form from profile
          if (data.creatorProfile) {
            setForm((prev) => ({
              ...prev,
              applicantName: data.creatorProfile.fullName || "",
              applicantWhatsapp: data.creatorProfile.whatsappNumber || "",
            }));
          }
          // If only one TikTok account, auto-select it
          if (data.tiktokAccounts?.length === 1) {
            const acc = data.tiktokAccounts[0];
            setSelectedTiktokId(acc.id);
            setForm((prev) => ({
              ...prev,
              applicantTiktokHandle: acc.handle,
              applicantFollowerCount: String(acc.followerCount || ""),
            }));
          }
        }
        setAuthChecked(true);
      })
      .catch(() => setAuthChecked(true));
  }, []);

  // When TikTok account dropdown changes
  const handleTiktokSelect = (accountId: string) => {
    setSelectedTiktokId(accountId);
    const acc = tiktokAccounts.find((a) => a.id === accountId);
    if (acc) {
      setForm((prev) => ({
        ...prev,
        applicantTiktokHandle: acc.handle,
        applicantFollowerCount: String(acc.followerCount || ""),
      }));
    }
  };

  // Google login handler (opens Google OAuth, will return to same URL)
  const handleGoogleLogin = async () => {
    setLoginLoading(true);
    try {
      const returnUrl = window.location.pathname;
      const res = await fetch("/api/auth/google/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returnUrl }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Gagal memuat Google Login. Coba lagi.");
        setLoginLoading(false);
      }
    } catch {
      alert("Terjadi kesalahan. Coba lagi.");
      setLoginLoading(false);
    }
  };

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/campaigns/${slug}`)
      .then((res) => {
        if (res.status === 404) { setNotFound(true); setLoading(false); return null; }
        return res.json();
      })
      .then((data) => {
        if (data) setCampaign(data);
        setLoading(false);
      })
      .catch(() => { setLoading(false); setNotFound(true); });
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // If not logged in, show login popup
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }
    if (!form.applicantName.trim() || !form.applicantWhatsapp.trim() || !form.applicantTiktokHandle.trim()) {
      setSubmitError("Nama, nomor WhatsApp, dan akun TikTok wajib diisi.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(`/api/campaigns/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || "Gagal mengirim pendaftaran.");
      } else {
        setSubmitSuccess(data.message);
        setAlreadyApplied(true);
      }
    } catch {
      setSubmitError("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-slate-500 text-sm font-medium">Memuat detail campaign...</p>
        </div>
      </div>
    );
  }

  if (notFound || !campaign) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-rose-500" />
          </div>
          <h1 className="font-bold text-xl text-slate-900">Campaign Tidak Ditemukan</h1>
          <p className="text-slate-500 text-sm">
            Link campaign ini sudah tidak aktif atau tidak valid. Hubungi brand/agensi yang mengirimkan link ini.
          </p>
        </div>
      </div>
    );
  }

  const isFullQuota = campaign.sampleStockRemaining <= 0;
  const isExpired = campaign.daysRemaining <= 0 || campaign.status !== "ACTIVE";
  const canApply = !isFullQuota && !isExpired && !alreadyApplied;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Banner */}
      <div className="relative w-full h-52 sm:h-72 overflow-hidden bg-indigo-900">
        {campaign.bannerUrl ? (
          <img
            src={campaign.bannerUrl}
            alt={campaign.title}
            className="w-full h-full object-cover opacity-60"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 mb-2">
            {campaign.platformType === "TIKTOK_GO" ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-emerald-600 px-2 py-0.5 rounded">
                <MapPin className="w-3 h-3" /> TikTok Go
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-indigo-600 px-2 py-0.5 rounded">
                <ShoppingBag className="w-3 h-3" /> TikTok Shop
              </span>
            )}
            {isExpired && (
              <span className="text-[10px] font-bold text-white bg-rose-600 px-2 py-0.5 rounded">Sudah Berakhir</span>
            )}
            {isFullQuota && !isExpired && (
              <span className="text-[10px] font-bold text-white bg-amber-600 px-2 py-0.5 rounded">Kuota Penuh</span>
            )}
          </div>
          <h1 className="text-white font-bold text-xl sm:text-2xl leading-tight drop-shadow-lg">
            {campaign.title}
          </h1>
          <p className="text-white/80 text-sm mt-0.5 font-medium">{campaign.brandName}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-3 text-center border border-slate-200 shadow-sm">
            <Gift className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
            <p className="font-bold text-slate-900 text-sm">{campaign.sampleStockRemaining}</p>
            <p className="text-[10px] text-slate-500">Slot Tersisa</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center border border-slate-200 shadow-sm">
            <Star className="w-5 h-5 text-amber-500 mx-auto mb-1" />
            <p className="font-bold text-slate-900 text-sm">{campaign.commissionRateText}</p>
            <p className="text-[10px] text-slate-500">Komisi</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center border border-slate-200 shadow-sm">
            <Clock className="w-5 h-5 text-rose-500 mx-auto mb-1" />
            <p className="font-bold text-slate-900 text-sm">{campaign.daysRemaining} hari</p>
            <p className="text-[10px] text-slate-500">Sisa Waktu</p>
          </div>
        </div>

        {/* SOW */}
        {campaign.sowItems.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            <h2 className="font-bold text-sm text-slate-900">📋 Syarat & Ketentuan (SOW)</h2>
            <ul className="space-y-2">
              {campaign.sowItems.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {campaign.mandatoryHashtags.length > 0 && (
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Hash className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="text-xs font-semibold text-slate-600">Hashtag Wajib:</span>
                  {campaign.mandatoryHashtags.map((h, i) => (
                    <span key={i} className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">{h}</span>
                  ))}
                </div>
                {campaign.mandatoryMentions.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <AtSign className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                    <span className="text-xs font-semibold text-slate-600">Mention Wajib:</span>
                    {campaign.mandatoryMentions.map((m, i) => (
                      <span key={i} className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">{m}</span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Brief Campaign */}
        {campaign.brief && (
          <div className="bg-amber-50 rounded-2xl border border-amber-200 shadow-sm p-4 space-y-2">
            <h2 className="font-bold text-sm text-amber-900 flex items-center gap-2">
              📝 Brief Campaign
            </h2>
            <p className="text-xs text-amber-800 leading-relaxed whitespace-pre-wrap">{campaign.brief}</p>
          </div>
        )}

        {/* Product Links */}
        {campaign.productSkus.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            <h2 className="font-bold text-sm text-slate-900">🛒 Produk Campaign</h2>
            <div className="space-y-2">
              {campaign.productSkus.map((sku, i) => (
                <div key={i} className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xs text-slate-900 truncate">{sku.productName || `Produk ${i + 1}`}</p>
                    {sku.salePrice && <p className="text-[11px] text-emerald-700 font-bold">{sku.salePrice}</p>}
                  </div>
                  {sku.productLink && (
                    <a
                      href={sku.productLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600 text-white text-[11px] font-bold shrink-0 hover:bg-indigo-700"
                    >
                      Tambah ke Showcase <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Application Form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <h2 className="font-bold text-sm text-slate-900 mb-1">🚀 Daftar ke Campaign Ini</h2>
          <p className="text-xs text-slate-500 mb-4">
            Isi form di bawah untuk mendaftarkan diri. Tim kami akan menghubungimu via WhatsApp.
          </p>

          {submitSuccess ? (
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-base text-emerald-800">🎉 Pendaftaran Berhasil!</p>
                <p className="text-xs text-emerald-700 leading-relaxed">{submitSuccess}</p>
                <p className="text-[11px] text-emerald-600">
                  Tim kami akan menghubungimu via WhatsApp untuk langkah selanjutnya.
                </p>
              </div>
              <a
                href="/my-tasks"
                className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-colors shadow-md shadow-indigo-600/20"
              >
                <ExternalLink className="w-4 h-4" />
                Lihat Campaign Saya
              </a>
              <p className="text-[10px] text-emerald-600">
                Pantau status pendaftaran dan informasi pengiriman sampel di halaman Campaign Saya.
              </p>
            </div>
          ) : !canApply ? (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-1">
              <AlertCircle className="w-6 h-6 text-slate-400 mx-auto" />
              <p className="font-semibold text-sm text-slate-700">
                {isExpired ? "Campaign ini sudah berakhir." : "Kuota sampel sudah penuh."}
              </p>
              <p className="text-xs text-slate-500">Pantau terus campaign berikutnya!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Auth status banner */}
              {isLoggedIn && currentUser ? (
                <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <UserCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-emerald-800 truncate">
                      Login sebagai {currentUser.name || currentUser.email}
                    </p>
                    <p className="text-[10px] text-emerald-600">Data diambil otomatis dari profil kamu</p>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowLoginPopup(true)}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-700 text-sm font-semibold hover:bg-indigo-100 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Login / Daftar untuk mengisi data otomatis
                </button>
              )}

              {submitError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {submitError}
                </div>
              )}

              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                {isLoggedIn && creatorProfile ? (
                  <div className="flex items-center gap-2 w-full px-3 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-sm text-slate-700">
                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{form.applicantName}</span>
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="Contoh: Siti Rahmawati"
                    value={form.applicantName}
                    onChange={(e) => setForm({ ...form, applicantName: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                    required
                  />
                )}
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
                </label>
                {isLoggedIn && creatorProfile ? (
                  <div className="flex items-center gap-2 w-full px-3 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-sm text-slate-700">
                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{form.applicantWhatsapp || "—"}</span>
                  </div>
                ) : (
                  <input
                    type="tel"
                    placeholder="Contoh: 0812-3456-7890"
                    value={form.applicantWhatsapp}
                    onChange={(e) => setForm({ ...form, applicantWhatsapp: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                    required
                  />
                )}
              </div>

              {/* TikTok Account */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Akun TikTok <span className="text-rose-500">*</span>
                </label>
                {isLoggedIn && tiktokAccounts.length > 0 ? (
                  tiktokAccounts.length === 1 ? (
                    // Single account — readonly display
                    <div className="flex items-center gap-2 w-full px-3 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-sm text-slate-700">
                      <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>@{tiktokAccounts[0].handle}</span>
                      <span className="ml-auto text-[10px] text-slate-400">
                        {Number(tiktokAccounts[0].followerCount).toLocaleString()} followers
                      </span>
                    </div>
                  ) : (
                    // Multiple accounts — dropdown
                    <div className="relative">
                      <select
                        value={selectedTiktokId}
                        onChange={(e) => handleTiktokSelect(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 appearance-none bg-white pr-9"
                        required
                      >
                        <option value="">-- Pilih akun TikTok --</option>
                        {tiktokAccounts.map((acc) => (
                          <option key={acc.id} value={acc.id}>
                            @{acc.handle} ({Number(acc.followerCount).toLocaleString()} followers)
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  )
                ) : isLoggedIn && tiktokAccounts.length === 0 ? (
                  // Logged in but no TikTok connected
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 space-y-1">
                    <p className="font-semibold">Belum ada akun TikTok yang terhubung.</p>
                    <p>Hubungkan akun TikTok kamu di <a href="/creator/settings" className="underline font-bold">Pengaturan Profil</a> terlebih dahulu.</p>
                  </div>
                ) : (
                  // Not logged in — free text input
                  <input
                    type="text"
                    placeholder="Contoh: @namaakuntiktok"
                    value={form.applicantTiktokHandle}
                    onChange={(e) => setForm({ ...form, applicantTiktokHandle: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                    required
                  />
                )}
              </div>

              {/* Followers — only show if not logged in (otherwise auto from TikTok) */}
              {(!isLoggedIn || tiktokAccounts.length === 0) && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jumlah Followers (opsional)</label>
                  <input
                    type="text"
                    placeholder="Contoh: 12.500"
                    value={form.applicantFollowerCount}
                    onChange={(e) => setForm({ ...form, applicantFollowerCount: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              {isLoggedIn && creatorProfile && (
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Data dikunci dari profil. Update di{" "}
                  <a href="/creator/settings" className="underline text-indigo-600">Pengaturan Profil</a>.
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting || (isLoggedIn && tiktokAccounts.length === 0)}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Mengirim Pendaftaran...</>
                ) : !isLoggedIn ? (
                  <><LogIn className="w-4 h-4" /> Login & Daftar Sekarang</>
                ) : (
                  <><Send className="w-4 h-4" /> Daftar Sekarang</>
                )}
              </button>
              <p className="text-[10px] text-slate-400 text-center">
                Dengan mendaftar, kamu setuju untuk mengikuti semua syarat & ketentuan campaign.
              </p>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center pb-6">
          <p className="text-[11px] text-slate-400">Powered by <span className="font-bold text-indigo-600">Creavy KOL System</span></p>
        </div>
      </div>

      {/* ── LOGIN POPUP MODAL ─────────────────────────────────────────────── */}
      {showLoginPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-5 relative">
            <button
              type="button"
              onClick={() => setShowLoginPopup(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto">
                <LogIn className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="font-bold text-lg text-slate-900">Masuk untuk Mendaftar</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Login dengan Google supaya data kamu terisi otomatis dan pendaftaran campaign langsung tercatat.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loginLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 transition-all font-semibold text-sm text-slate-700 disabled:opacity-60"
            >
              {loginLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              )}
              {loginLoading ? "Memuat..." : "Lanjutkan dengan Google"}
            </button>

            <div className="text-center">
              <p className="text-[11px] text-slate-400">
                Belum punya akun? Klik tombol di atas — akun akan dibuat otomatis saat login Google pertama kali.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
