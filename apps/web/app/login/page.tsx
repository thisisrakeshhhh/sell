"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@jerseyflow.com");
  const [password, setPassword] = useState("password123");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex items-center justify-center p-6">
      <div className="w-full max-w-md glass-card p-8 space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#10b981] flex items-center justify-center font-bold text-black text-2xl mx-auto mb-4">
            J
          </div>
          <h1 className="text-2xl font-bold text-white">Merchant Admin Login</h1>
          <p className="text-xs text-[#a1a1aa] mt-1">Sign in to manage WhatsApp orders, inventory & UPI payments.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[#a1a1aa] block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#a1a1aa] absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#09090b] border border-white/10 text-white text-sm focus:border-[#10b981] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#a1a1aa] block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#a1a1aa] absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#09090b] border border-white/10 text-white text-sm focus:border-[#10b981] outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-[#10b981] text-black font-bold text-sm hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <span>Sign In to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
