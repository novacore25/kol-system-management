"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FolderKanban, Wallet, User } from "lucide-react";
import clsx from "clsx";

export function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Beranda",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "Campaign",
      href: "/my-tasks",
      icon: FolderKanban,
      isActive: pathname.startsWith("/my-tasks"),
    },
    {
      label: "Komisi",
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
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-divider px-3 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all",
                item.isActive
                  ? "text-brand-600 dark:text-brand-400 font-bold scale-105"
                  : "text-default-500 hover:text-default-800 dark:hover:text-default-200"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
