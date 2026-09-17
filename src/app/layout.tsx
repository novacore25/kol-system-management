import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AppHeader } from "@/components/navigation/AppHeader";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { MobileBottomNav } from "@/components/navigation/MobileBottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Creavy - Let's grow together",
  description: "Platform kolaborasi resmi kreator TikTok Affiliate: temukan campaign brand ternama, ajukan sampel gratis, dan pantau komisi penjualan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="light">
      <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-800 antialiased flex flex-col`}>
        <Providers>
          {/* Top Header */}
          <AppHeader />

          {/* Main App Body with Left Sidebar */}
          <div className="flex-1 flex w-full">
            <AppSidebar />
            <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full pb-24 md:pb-12">
              {children}
            </main>
          </div>

          {/* Bottom Bar for Smartphone Screen */}
          <MobileBottomNav />
        </Providers>
      </body>
    </html>
  );
}
