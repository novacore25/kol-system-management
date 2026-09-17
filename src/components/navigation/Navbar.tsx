"use client";

import React from "react";
import Link from "next/link";
import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Chip,
} from "@heroui/react";
import { Sparkles, ShieldCheck, Flame, UserCheck } from "lucide-react";

export function Navbar() {
  return (
    <HeroNavbar isBordered maxWidth="xl" className="bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <NavbarBrand>
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-purple-950 to-slate-800 dark:from-white dark:via-purple-200 dark:to-slate-200 bg-clip-text text-transparent">
                Nusantara Creator
              </span>
              <Chip size="sm" variant="flat" color="secondary" startContent={<ShieldCheck className="w-3.5 h-3.5 text-purple-600" />}>
                TAP Official
              </Chip>
            </div>
            <p className="text-[10px] text-default-400 font-medium tracking-wider uppercase">TikTok Affiliate Partner</p>
          </div>
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        <NavbarItem isActive>
          <Link href="/" className="text-sm font-semibold text-brand-600 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-500" />
            Katalog Campaign
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="#how-it-works" className="text-sm font-medium text-default-600 hover:text-brand-600 transition-colors">
            Alur & Sampel Gratis
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="#auto-detect" className="text-sm font-medium text-default-600 hover:text-brand-600 transition-colors">
            Auto-Detect Video
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden sm:flex">
          <Button
            as={Link}
            href="/admin"
            variant="light"
            color="default"
            size="sm"
            className="font-medium"
          >
            Portal Internal Agency
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button
            as={Link}
            href="/login"
            color="primary"
            variant="shadow"
            size="sm"
            startContent={<UserCheck className="w-4 h-4" />}
            className="bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold shadow-md shadow-brand-500/25"
          >
            Masuk / Hubungkan TikTok
          </Button>
        </NavbarItem>
      </NavbarContent>
    </HeroNavbar>
  );
}
