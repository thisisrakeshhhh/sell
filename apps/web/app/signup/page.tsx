"use client";

import { useState } from "react";
import { Store, QrCode, Phone, CheckCircle2, ArrowRight, ShieldCheck, Mail, Lock } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [storeName, setStoreName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [phone, setPhone] = useState("");
  const [upiId, setUpiId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCompleted(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="w-full max-w-md glass-card p-8 space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono text-[#10b981] uppercase tracking-widest">JerseyFlow SaaS</span>
          <h1 className="text-2xl font-black text-white">Create Store Account</h1>
          <p className="text-xs text-[#a1a1aa]">Launch your WhatsApp-first jersey store in 60 seconds.</p>
        </div>

        {!completed ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-[#a1a1aa] block mb-1">Store Name</label>
              <div className="relative">
                <Store className="w-4 h-4 text-[#a1a1aa] absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => {
                    setStoreName(e.target.value);
                    setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""));
                  }}
                  placeholder="e.g. Real Madrid India Store"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#18181b] border border-white/10 text-xs text-white outline-none focus:border-[#10b981]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-[#a1a1aa] block mb-1">Store Subdomain URL</label>
              <div className="flex items-center rounded-xl bg-[#18181b] border border-white/10 px-3 py-2.5 text-xs text-[#a1a1aa] font-mono">
                <span className="text-white font-bold">{subdomain || "yourstore"}</span>
                <span>.jerseyflow.in</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-[#a1a1aa] block mb-1">Official WhatsApp Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#a1a1aa] absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+919876543210"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#18181b] border border-white/10 text-xs text-white outline-none focus:border-[#10b981] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-[#a1a1aa] block mb-1">Merchant UPI VPA ID</label>
              <div className="relative">
                <QrCode className="w-4 h-4 text-[#a1a1aa] absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourstore@upi"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#18181b] border border-white/10 text-xs text-white outline-none focus:border-[#10b981] font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#a1a1aa] block mb-1">Owner Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@store.com"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#18181b] border border-white/10 text-xs text-white outline-none focus:border-[#10b981]"
                />
              </div>
              <div>
                <label className="text-xs text-[#a1a1aa] block mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#18181b] border border-white/10 text-xs text-white outline-none focus:border-[#10b981]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-[#10b981] text-black font-bold text-xs hover:bg-emerald-400 flex items-center justify-center gap-2 mt-4 shadow-lg shadow-emerald-500/20"
            >
              {loading ? (
                <span>Provisioning Cloudflare D1 Store...</span>
              ) : (
                <>
                  <span>Launch Jersey Store</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4 py-6">
            <CheckCircle2 className="w-12 h-12 text-[#10b981] mx-auto" />
            <h3 className="text-xl font-bold text-white">Store Successfully Provisioned!</h3>
            <p className="text-xs text-[#a1a1aa]">Your store is live at <span className="text-emerald-400 font-mono font-bold">{subdomain}.jerseyflow.in</span></p>

            <Link
              href="/admin"
              className="inline-flex py-3 px-6 rounded-full bg-[#10b981] text-black font-bold text-xs hover:bg-emerald-400 items-center gap-2"
            >
              <span>Go to Merchant Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
