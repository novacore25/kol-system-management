"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserCheck,
  Truck,
  Layers,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import clsx from "clsx";

export function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      label: "Overview & Metrik",
      href: "/admin",
      icon: LayoutDashboard,
      isActive: pathname === "/admin",
    },
    {
      label: "Manajemen Campaign",
      href: "/admin/campaigns",
      icon: Layers,
      isActive: pathname.startsWith("/admin/campaigns"),
    },
    {
      label: "Kurasi Pendaftar",
      href: "/admin/applications",
      icon: UserCheck,
      isActive: pathname.startsWith("/admin/applications"),
      badge: "1 Baru",
    },
    {
      label: "Logistik & Resi Sampel",
      href: "/admin/logistics",
      icon: Truck,
      isActive: pathname.startsWith("/admin/logistics"),
      badge: "1 Pending",
    },
    {
      label: "Import Raw Data",
      href: "/admin/import",
      icon: Sparkles,
      isActive: pathname.startsWith("/admin/import"),
      badge: "Baru",
    },
  ];

  return (
    <aside className="w-64 border-r border-divider/60 bg-card p-4 flex flex-col justify-between shrink-0 hidden md:flex min-h-[calc(100vh-65px)]">
      <div className="space-y-6">
        {/* Agency Badge */}
        <div className="p-3 bg-gradient-to-r from-brand-950 to-purple-950 rounded-2xl border border-brand-500/20 text-white space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span className="font-extrabold text-xs tracking-tight">Agency Workspace</span>
          </div>
          <p className="text-[11px] text-purple-200">KOL Management & TikTok Partner Hub</p>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all",
                  item.isActive
                    ? "bg-brand-600 text-white shadow-md shadow-brand-500/20"
                    : "text-default-600 hover:bg-default-100 hover:text-default-900"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={clsx(
                      "text-[10px] px-1.5 py-0.5 rounded-full font-extrabold",
                      item.isActive
                        ? "bg-white/20 text-white"
                        : "bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Action */}
      <div className="pt-4 border-t border-divider">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-semibold text-default-500 hover:text-brand-600 transition-colors p-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Web Kreator</span>
        </Link>
      </div>
    </aside>
  );
}
