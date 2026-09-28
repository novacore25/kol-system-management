import React from "react";
import Link from "next/link";
import { FileText, ArrowLeft, ShieldCheck } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 px-4 sm:px-6">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda / Back to Home</span>
        </Link>
        <span className="text-[11px] text-slate-400">Effective Date: September 2026</span>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 shadow-sm space-y-8 text-slate-700">
        <div className="border-b border-slate-100 pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold border border-indigo-200">
            <FileText className="w-4 h-4" />
            <span>Creavy Official Terms</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Terms of Service (Ketentuan Layanan)
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Welcome to Creavy. By accessing our platform, connecting your TikTok creator account, and participating in brand campaigns, you agree to comply with the following terms.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">1. Eligibility & Creator Account</h2>
          <div className="text-xs space-y-2 leading-relaxed text-slate-600">
            <p>
              To use Creavy as a creator, you must be at least 18 years old and possess an active, legitimate TikTok account. You agree to provide accurate information regarding your identity, shipping address, and payment details.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">2. TikTok Integration & Login Kit Usage</h2>
          <div className="text-xs space-y-2 leading-relaxed text-slate-600">
            <p>
              Creavy utilizes official TikTok Login Kit and Open APIs to verify creator identity, display public follower counts, and confirm campaign video uploads. We strictly adhere to TikTok Developer Terms:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>We only access data with your explicit OAuth consent.</li>
              <li>We never access or store your TikTok account credentials or passwords.</li>
              <li>You may revoke Creavy&apos;s access at any time via your TikTok Security settings or Creavy profile.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">3. Campaign SOW & Free Sample Allocation</h2>
          <div className="text-xs space-y-2 leading-relaxed text-slate-600">
            <p>
              When applying for campaigns offering free physical samples:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>You agree to publish content fulfilling the agreed Scope of Work (SOW), mandatory brand hashtags, and product link binding within the designated deadline.</li>
              <li>Product samples are provided solely for content creation and review purposes and cannot be resold commercially.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">4. Commissions & Payouts</h2>
          <div className="text-xs space-y-2 leading-relaxed text-slate-600">
            <p>
              Commissions generated through affiliate links and agreed fixed fees will be distributed to your verified bank account according to our settlement schedules.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">5. Contact Information</h2>
          <div className="text-xs space-y-2 leading-relaxed text-slate-600">
            <p>
              For legal inquiries or terms clarification, please contact our support team at <a href="mailto:support@novacorex.tech" className="text-indigo-600 underline font-semibold">support@novacorex.tech</a>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
