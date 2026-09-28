import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, ArrowLeft, Trash2 } from "lucide-react";

export default function PrivacyPolicyPage() {
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
            <ShieldCheck className="w-4 h-4" />
            <span>Creavy Privacy Policy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Privacy Policy (Kebijakan Privasi)
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            This Privacy Policy explains how Creavy collects, uses, stores, and protects your information when you access our platform and link your TikTok account.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-600" />
            1. Information We Collect
          </h2>
          <div className="text-xs space-y-2 leading-relaxed text-slate-600">
            <p>We collect only the necessary information required to facilitate brand collaborations:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>User Identity:</strong> Name, email address, and phone/WhatsApp number.</li>
              <li><strong>Shipping & Bank Info:</strong> Physical shipping address for product samples and bank account details for commission payments.</li>
              <li><strong>TikTok Data (via TikTok Login Kit API):</strong> TikTok Open ID, Union ID, Display Name, Avatar URL, verified handle (@username), and follower metrics.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">2. How We Use TikTok Data</h2>
          <div className="text-xs space-y-2 leading-relaxed text-slate-600">
            <p>
              TikTok data is retrieved solely with your explicit consent via OAuth 2.0 to:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Verify your creator profile and prevent identity impersonation.</li>
              <li>Display verified creator badges on your dashboard.</li>
              <li>Determine eligibility for physical product sample allocation.</li>
              <li>We <strong>do not sell, rent, or trade</strong> your personal or TikTok data to third parties.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">3. Data Security & Storage</h2>
          <div className="text-xs space-y-2 leading-relaxed text-slate-600">
            <p>
              All user records and OAuth access tokens are stored in secure, encrypted PostgreSQL databases with industry-standard TLS encryption in transit and at rest.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-rose-600" />
            4. User Rights & Data Deletion Flow
          </h2>
          <div className="text-xs space-y-2 leading-relaxed text-slate-600">
            <p>
              In accordance with international privacy laws and TikTok Data Portability & User Rights guidelines:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Unlink Account:</strong> You can disconnect your TikTok account at any time in your Creavy Profile Settings.</li>
              <li><strong>Request Full Deletion:</strong> You can submit a full account and data erasure request by emailing <a href="mailto:privacy@novacorex.tech" className="text-indigo-600 underline font-semibold">privacy@novacorex.tech</a> with subject &quot;Data Deletion Request&quot;.</li>
              <li>All associated TikTok access tokens, shipping history, and personal identifiable information (PII) will be permanently purged within 30 days of request confirmation.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">5. Contact Us</h2>
          <div className="text-xs space-y-2 leading-relaxed text-slate-600">
            <p>
              For privacy queries or data protection inquiries, contact our Data Protection Officer at <a href="mailto:privacy@novacorex.tech" className="text-indigo-600 underline font-semibold">privacy@novacorex.tech</a>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
