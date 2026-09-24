"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Bell,
  CheckCircle2,
  Truck,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import clsx from "clsx";

interface NotificationItem {
  id: string;
  type: "APPROVAL" | "SHIPPING" | "DETECTION" | "PERFORMANCE";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  link?: string;
}

const initialNotifications: NotificationItem[] = [
  {
    id: "n-1",
    type: "APPROVAL",
    title: "Pendaftaran Disetujui 🎉",
    message: "Pendaftaranmu untuk Make Over Velvet Cushion telah disetujui admin. Sampel segera disiapkan!",
    time: "1 jam yang lalu",
    isRead: false,
    link: "/my-tasks/task-1",
  },
  {
    id: "n-2",
    type: "SHIPPING",
    title: "Sampel Sedang Dikirim 🚚",
    message: "Resi kurir J&T Express (JT8829104821ID) telah diterbitkan. Lacak pengiriman di detail tugas.",
    time: "1 hari yang lalu",
    isRead: false,
    link: "/my-tasks/task-1",
  },
  {
    id: "n-3",
    type: "DETECTION",
    title: "Video Terdeteksi Live ✅",
    message: "Sistem mendeteksi video TikTok Anda dengan hashtag wajib. SOW dinyatakan valid!",
    time: "2 hari yang lalu",
    isRead: false,
    link: "/my-tasks/task-1",
  },
  {
    id: "n-4",
    type: "PERFORMANCE",
    title: "Penjualan Baru Tercatat 💰",
    message: "Pesanan baru dari keranjang kuning berhasil teratribusi ke akun Anda.",
    time: "3 hari yang lalu",
    isRead: true,
    link: "/earnings",
  },
];

export function AppHeader() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Brand Logo on Left */}
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
          C
        </div>
        <div className="flex flex-col">
          <span className="font-black text-base tracking-tight text-slate-900 leading-none">
            Creavy
          </span>
          <span className="text-[10px] text-indigo-600 font-semibold tracking-tight mt-0.5">
            Let&apos;s grow together
          </span>
        </div>
      </Link>

      {/* Right Side: Language, Notification Bell, User Avatar */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Language Selector */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer hover:text-slate-900 transition-colors">
          <span>Bahasa:</span>
          <span className="text-base">🇮🇩</span>
          <span className="font-semibold">Bahasa Indonesia</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors relative"
            aria-label="Notifikasi"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-black text-[9px] flex items-center justify-center shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Popover Panel */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden text-xs">
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">Notifikasi</h4>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                      {unreadCount} Baru
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-[11px] text-indigo-600 font-semibold hover:underline"
                  >
                    Tandai Semua Dibaca
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <Link
                      key={n.id}
                      href={n.link || "/my-tasks"}
                      onClick={() => {
                        setNotifications(
                          notifications.map((item) =>
                            item.id === n.id ? { ...item, isRead: true } : item
                          )
                        );
                        setIsNotifOpen(false);
                      }}
                      className={clsx(
                        "p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors block text-left",
                        !n.isRead ? "bg-indigo-50/30" : "bg-white"
                      )}
                    >
                      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                        {n.type === "APPROVAL" && <Sparkles className="w-4 h-4 text-indigo-600" />}
                        {n.type === "SHIPPING" && <Truck className="w-4 h-4 text-sky-600" />}
                        {n.type === "DETECTION" && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        {n.type === "PERFORMANCE" && <TrendingUp className="w-4 h-4 text-amber-600" />}
                      </div>

                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-bold text-slate-900 text-xs truncate">{n.title}</p>
                          <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                          {n.message}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="p-6 text-center text-slate-400">Tidak ada notifikasi.</p>
                )}
              </div>

              <div className="p-2.5 border-t border-slate-100 bg-slate-50 text-center">
                <Link
                  href="/my-tasks"
                  onClick={() => setIsNotifOpen(false)}
                  className="text-[11px] font-semibold text-slate-600 hover:text-indigo-600"
                >
                  Lihat Semua Aktivitas Campaign
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <Link href="/profile" className="flex items-center gap-2.5 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-slate-100 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-xs">
            HN
          </div>
          <div className="hidden sm:block text-left">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                Hibban Nazala
              </p>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-gradient-to-r from-amber-500/10 to-amber-500/20 text-amber-700 border border-amber-300 flex items-center gap-0.5">
                ⚡ Pro
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Kreator</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </Link>
      </div>
    </header>
  );
}
