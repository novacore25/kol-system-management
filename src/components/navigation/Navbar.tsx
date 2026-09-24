"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Chip,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import {
  Sparkles,
  Flame,
  LayoutDashboard,
  FolderKanban,
  FileSpreadsheet,
  Package,
  Users,
  LogOut,
  User,
  ShieldCheck,
  Wallet,
  LogIn,
} from "lucide-react";
import { AuthSessionUser } from "@/lib/auth";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<AuthSessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : { authenticated: false }))
      .then((data) => {
        if (data.authenticated && data.user) {
          setSession(data.user);
        } else {
          setSession(null);
        }
      })
      .catch(() => setSession(null))
      .finally(() => setLoading(false));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setSession(null);
    router.push("/register");
    router.refresh();
  };

  const isAdmin = session?.role === "ADMIN";

  return (
    <HeroNavbar isBordered maxWidth="xl" className="bg-background/85 backdrop-blur-md sticky top-0 z-50">
      {/* BRAND LOGO */}
      <NavbarBrand>
        <Link href={isAdmin ? "/admin" : "/"} className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-purple-950 to-slate-800 dark:from-white dark:via-purple-200 dark:to-slate-200 bg-clip-text text-transparent">
                Creavy
              </span>
              {isAdmin ? (
                <Chip size="sm" variant="solid" color="danger" className="text-[10px] font-black tracking-wider px-1.5 h-5">
                  ADMIN
                </Chip>
              ) : (
                <Chip size="sm" variant="flat" color="secondary" className="text-[10px] font-bold h-5">
                  CREATOR
                </Chip>
              )}
            </div>
            <p className="text-[10px] text-default-400 font-medium tracking-wide">
              {isAdmin ? "Admin & Management Portal" : "Let's grow together"}
            </p>
          </div>
        </Link>
      </NavbarBrand>

      {/* NAVIGATION LINKS BASED ON ROLE */}
      <NavbarContent className="hidden md:flex gap-5" justify="center">
        {isAdmin ? (
          <>
            <NavbarItem isActive={pathname === "/admin"}>
              <Link
                href="/admin"
                className={`text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  pathname === "/admin" ? "text-brand-600" : "text-default-600 hover:text-brand-600"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard Admin
              </Link>
            </NavbarItem>
            <NavbarItem isActive={pathname === "/admin/campaigns"}>
              <Link
                href="/admin/campaigns"
                className={`text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  pathname === "/admin/campaigns" ? "text-brand-600" : "text-default-600 hover:text-brand-600"
                }`}
              >
                <FolderKanban className="w-4 h-4" />
                Kelola Campaign
              </Link>
            </NavbarItem>
            <NavbarItem isActive={pathname === "/admin/import"}>
              <Link
                href="/admin/import"
                className={`text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  pathname === "/admin/import" ? "text-brand-600" : "text-default-600 hover:text-brand-600"
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                Ingestion Data
              </Link>
            </NavbarItem>
            <NavbarItem isActive={pathname === "/admin/logistics"}>
              <Link
                href="/admin/logistics"
                className={`text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  pathname === "/admin/logistics" ? "text-brand-600" : "text-default-600 hover:text-brand-600"
                }`}
              >
                <Package className="w-4 h-4" />
                Logistik & Sampel
              </Link>
            </NavbarItem>
            <NavbarItem isActive={pathname === "/admin/applications"}>
              <Link
                href="/admin/applications"
                className={`text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  pathname === "/admin/applications" ? "text-brand-600" : "text-default-600 hover:text-brand-600"
                }`}
              >
                <Users className="w-4 h-4" />
                Approval Kreator
              </Link>
            </NavbarItem>
          </>
        ) : (
          <>
            <NavbarItem isActive={pathname === "/"}>
              <Link
                href="/"
                className={`text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  pathname === "/" ? "text-brand-600" : "text-default-600 hover:text-brand-600"
                }`}
              >
                <Flame className="w-4 h-4 text-orange-500" />
                Katalog Campaign
              </Link>
            </NavbarItem>
            <NavbarItem isActive={pathname.startsWith("/my-tasks")}>
              <Link
                href="/my-tasks"
                className={`text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  pathname.startsWith("/my-tasks") ? "text-brand-600" : "text-default-600 hover:text-brand-600"
                }`}
              >
                <FolderKanban className="w-4 h-4 text-brand-600" />
                Tugas Saya
              </Link>
            </NavbarItem>
            <NavbarItem isActive={pathname.startsWith("/earnings")}>
              <Link
                href="/earnings"
                className={`text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  pathname.startsWith("/earnings") ? "text-brand-600" : "text-default-600 hover:text-brand-600"
                }`}
              >
                <Wallet className="w-4 h-4 text-emerald-500" />
                Komisi & Estimasi
              </Link>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      {/* RIGHT ACTION: USER PROFILE / AUTH BUTTONS */}
      <NavbarContent justify="end">
        {loading ? (
          <div className="w-8 h-8 rounded-full bg-default-200 animate-pulse" />
        ) : session ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <div className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-default-100 transition-colors">
                <Avatar
                  src={session.avatarUrl || undefined}
                  name={session.name || session.email}
                  size="sm"
                  className="ring-2 ring-brand-500/30"
                />
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-foreground leading-none">
                    {session.name || session.email.split("@")[0]}
                  </span>
                  <span className="text-[10px] text-default-400 font-semibold">
                    {isAdmin ? "Admin Agency" : "Kreator"}
                  </span>
                </div>
              </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="User Actions" variant="flat">
              <DropdownItem key="profile_info" className="h-14 gap-2" textValue="Profil Info">
                <p className="font-semibold text-xs">Login sebagai</p>
                <p className="font-bold text-xs text-brand-600 truncate">{session.email}</p>
              </DropdownItem>

              {isAdmin ? (
                <DropdownItem
                  key="admin_dash"
                  as={Link}
                  href="/admin"
                  startContent={<ShieldCheck className="w-4 h-4 text-danger-500" />}
                >
                  Dashboard Admin
                </DropdownItem>
              ) : (
                <DropdownItem
                  key="creator_profile"
                  as={Link}
                  href="/profile"
                  startContent={<User className="w-4 h-4 text-brand-600" />}
                >
                  Profil & Pengaturan
                </DropdownItem>
              )}

              <DropdownItem
                key="logout"
                color="danger"
                className="text-danger"
                startContent={<LogOut className="w-4 h-4" />}
                onClick={handleLogout}
              >
                Keluar / Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <Button
            as={Link}
            href="/register"
            color="primary"
            variant="shadow"
            size="sm"
            startContent={<LogIn className="w-4 h-4" />}
            className="bg-gradient-to-r from-brand-600 to-purple-600 text-white font-bold text-xs shadow-md shadow-brand-500/25"
          >
            Masuk / Daftar
          </Button>
        )}
      </NavbarContent>
    </HeroNavbar>
  );
}
