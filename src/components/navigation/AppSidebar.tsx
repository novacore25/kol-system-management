"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FolderKanban,
  Wallet,
  User,
  Shield,
} from "lucide-react";
import clsx from "clsx";

export function AppSidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      label: "Beranda",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "Campaign Saya",
      href: "/my-tasks",
      icon: FolderKanban,
      isActive: pathname.startsWith("/my-tasks"),
    },
    {
      label: "Komisi Saya",
      href: "/earnings",
      icon: Wallet,
      isActive: pathname.startsWith("/earnings"),
    },
    {
      label: "Profil",
      href: "/profile",
      icon: User,
      isActive: pathname.startsWith("/profile"),
    },
  ];

  return (
    <aside className="w-56 bg-white border-r border-slate-200/80 p-4 shrink-0 hidden md:flex flex-col justify-between min-h-[calc(100vh-64px)]">
      <div className="space-y-6">
        {/* Section 1: Menu */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Menu
          </p>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors",
                    item.isActive
                      ? "bg-indigo-50 text-indigo-600 font-bold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Section 2: Lainnya */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Lainnya
          </p>
          <Link
            href="/protocol"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <Shield className="w-4 h-4" />
            <span>Kebijakan Privasi</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
