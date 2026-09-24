import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import Link from "next/link";
import { ShieldCheck, Bell } from "lucide-react";
import { Chip, Button } from "@heroui/react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col">
      {/* Top Admin Bar */}
      <header className="border-b border-divider/60 bg-card px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="font-extrabold text-base text-foreground tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 via-purple-600 to-pink-500 text-white flex items-center justify-center font-black text-sm">
              C
            </span>
            <span>Creavy Operations</span>
          </Link>
          <Chip size="sm" color="danger" variant="flat" className="hidden sm:inline-flex text-[10px] font-bold">
            Admin Internal
          </Chip>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-right hidden sm:block">
            <p className="text-xs font-bold text-foreground">PIC & Operations Team</p>
            <p className="text-[10px] text-default-400">admin@creavy.id</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
            AD
          </div>
        </div>
      </header>

      {/* Main Admin Body with Sidebar */}
      <div className="flex-1 flex">
        <AdminSidebar />
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
