"use client";

import { useState } from "react";
import { Save, Store, QrCode, Phone, Instagram, Facebook, Truck, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState("JerseyFlow Store");
  const [whatsappNumber, setWhatsappNumber] = useState("+919999999999");
  const [upiId, setUpiId] = useState("jerseyflow@upi");
  const [shippingCost, setShippingCost] = useState(99);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(1500);
  const [instagramUrl, setInstagramUrl] = useState("https://instagram.com/jerseyflow");
  const [facebookUrl, setFacebookUrl] = useState("https://facebook.com/jerseyflow");
  const [address, setAddress] = useState("MG Road, Indiranagar, Bengaluru 560038");
  const [gstNumber, setGstNumber] = useState("29ABCDE1234F1Z5");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Merchant Store Settings</h1>
          <p className="text-sm text-[#a1a1aa] mt-0.5">Configure store branding, payment UPI VPA, shipping rules, and GST details.</p>
        </div>

        {savedSuccess && (
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved!</span>
          </span>
        )}
      </div>

      <div className="glass-card p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-medium text-[#a1a1aa] block mb-1">Store Name</label>
            <div className="relative">
              <Store className="w-4 h-4 text-[#a1a1aa] absolute left-3.5 top-3" />
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#09090b] border border-white/10 text-white text-sm focus:border-[#10b981] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#a1a1aa] block mb-1">Official WhatsApp Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#a1a1aa] absolute left-3.5 top-3" />
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#09090b] border border-white/10 text-white text-sm focus:border-[#10b981] outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#a1a1aa] block mb-1">UPI VPA ID (For Payment QR)</label>
            <div className="relative">
              <QrCode className="w-4 h-4 text-[#a1a1aa] absolute left-3.5 top-3" />
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#09090b] border border-white/10 text-white text-sm focus:border-[#10b981] outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#a1a1aa] block mb-1">GST Number</label>
            <div className="relative">
              <ShieldCheck className="w-4 h-4 text-[#a1a1aa] absolute left-3.5 top-3" />
              <input
                type="text"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#09090b] border border-white/10 text-white text-sm focus:border-[#10b981] outline-none font-mono uppercase"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#a1a1aa] block mb-1">Standard Shipping Cost (₹)</label>
            <div className="relative">
              <Truck className="w-4 h-4 text-[#a1a1aa] absolute left-3.5 top-3" />
              <input
                type="number"
                value={shippingCost}
                onChange={(e) => setShippingCost(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#09090b] border border-white/10 text-white text-sm focus:border-[#10b981] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#a1a1aa] block mb-1">Free Shipping Threshold (₹)</label>
            <div className="relative">
              <Truck className="w-4 h-4 text-[#a1a1aa] absolute left-3.5 top-3" />
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#09090b] border border-white/10 text-white text-sm focus:border-[#10b981] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#a1a1aa] block mb-1">Instagram Profile URL</label>
            <div className="relative">
              <Instagram className="w-4 h-4 text-[#a1a1aa] absolute left-3.5 top-3" />
              <input
                type="text"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#09090b] border border-white/10 text-white text-sm focus:border-[#10b981] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#a1a1aa] block mb-1">Facebook Page URL</label>
            <div className="relative">
              <Facebook className="w-4 h-4 text-[#a1a1aa] absolute left-3.5 top-3" />
              <input
                type="text"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#09090b] border border-white/10 text-white text-sm focus:border-[#10b981] outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-[#a1a1aa] block mb-1">Business Store Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-[#09090b] border border-white/10 text-white text-sm focus:border-[#10b981] outline-none"
          />
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-3 rounded-full bg-[#10b981] text-black font-bold text-xs hover:bg-emerald-400 flex items-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          <Save className="w-4 h-4" />
          <span>Save Store Settings</span>
        </button>
      </div>
    </div>
  );
}
