"use client";

import React from "react";
import Link from "next/link";
import { ChevronDown, Globe } from "lucide-react";
import { Avatar } from "@heroui/react";

export function AppHeader() {
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

      {/* Right Side: Language & User Avatar */}
      <div className="flex items-center gap-6">
        {/* Language Selector */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer hover:text-slate-900 transition-colors">
          <span>Bahasa:</span>
          <span className="text-base">🇮🇩</span>
          <span className="font-semibold">Bahasa Indonesia</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
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
