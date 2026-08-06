"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MessageCircle, ShieldCheck, Truck, RotateCcw, Sparkles } from "lucide-react";

export default function ProductDetailPage() {
  const [selectedSize, setSelectedSize] = useState("L");
  const [customName, setCustomName] = useState("RONALDO");
  const [customNumber, setCustomNumber] = useState("7");

  const product = {
    code: "MU24H",
    slug: "manchester-united-home-24-25",
    name: "Manchester United Home 24/25 Stadium Edition",
    club: "Manchester United",
    sport: "Football",
    season: "24/25",
    price: 999,
    originalPrice: 1499,
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80",
    description: "Official stadium edition home jersey. Engineered with breathable moisture-wicking Dri-FIT fabric. Custom printing uses authentic heat-applied vinyl typography.",
    stock: 2,
  };

  // PRIORITY 1: STRUCTURED WHATSAPP MESSAGE PAYLOAD FORMATTING
  const formattedMessage = `Hi 👋\n\nI'd like to order this jersey.\n\nProduct:\n${product.name}\n\nCode:\n${product.code}\n\nSize:\n${selectedSize}\n\nName:\n${customName || "None"}\n\nNumber:\n${customNumber || "None"}\n\nPrice:\n₹${product.price}\n\nPlease confirm my order.`;

  const whatsappUrl = `https://wa.me/919999999999?text=${encodeURIComponent(formattedMessage)}`;

  // PRIORITY 2: JSON-LD STRUCTURED DATA SCHEMA FOR PRODUCT DISCOVERABILITY
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": [product.image],
    "description": product.description,
    "sku": product.code,
    "offers": {
      "@type": "Offer",
      "url": `https://jerseyflow.com/products/${product.slug}`,
      "priceCurrency": "INR",
      "price": product.price,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] pt-12 pb-24 px-6">
      {/* JSON-LD SEO STRUCTURED DATA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto">
        <Link href="/products" className="inline-flex items-center gap-2 text-sm text-[#a1a1aa] hover:text-[#10b981] mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* LEFT: LIGHTWEIGHT CSS OVERLAY CUSTOMIZER PREVIEW */}
          <div className="glass-card p-6 flex flex-col items-center justify-center relative">
            <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden bg-zinc-900 shadow-2xl flex items-center justify-center">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-90" />

              {/* OVERLAY JERSEY BACK PRINT PREVIEW */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/30 backdrop-blur-[2px]">
                <div className="mt-8 uppercase font-extrabold tracking-widest text-white text-3xl sm:text-4xl drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] font-mono">
                  {customName || "YOUR NAME"}
                </div>
                <div className="text-6xl sm:text-8xl font-black text-white tracking-tighter drop-shadow-[0_6px_14px_rgba(0,0,0,0.9)] font-mono mt-1">
                  {customNumber || "7"}
                </div>
              </div>
            </div>

            <p className="text-xs text-[#a1a1aa] mt-4 text-center">
              * Live CSS Preview: Authentic heat-pressed vinyl typography applied upon confirmation.
            </p>
          </div>

          {/* RIGHT: CUSTOMIZER FORM & CHECKOUT DETAILS */}
          <div className="flex flex-col space-y-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md bg-[#10b981]/10 text-[#10b981] text-xs font-semibold uppercase">
                  {product.code}
                </span>
                <span className="text-xs text-[#a1a1aa]">{product.club} • {product.season}</span>
                {product.stock > 0 && product.stock <= 3 && (
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-xs font-mono font-bold">
                    Only {product.stock} left
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-extrabold text-white mt-2">{product.name}</h1>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-white">₹{product.price}</span>
                <span className="text-base text-[#a1a1aa] line-through">₹{product.originalPrice}</span>
                <span className="text-xs font-semibold text-[#10b981]">Save 33%</span>
              </div>
            </div>

            <p className="text-sm text-[#a1a1aa] leading-relaxed">{product.description}</p>

            {/* CUSTOMIZER CONTROLS */}
            <div className="glass-card p-6 space-y-4 border-emerald-500/20">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#10b981]" />
                <span>Personalize Your Jersey</span>
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#a1a1aa] block mb-1">Player Name on Back</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value.toUpperCase())}
                    maxLength={15}
                    placeholder="E.G. BECKHAM"
                    className="w-full px-3 py-2 rounded-xl bg-[#09090b] border border-white/10 text-white text-sm focus:border-[#10b981] outline-none uppercase tracking-wider font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#a1a1aa] block mb-1">Squad Number</label>
                  <input
                    type="text"
                    value={customNumber}
                    onChange={(e) => setCustomNumber(e.target.value)}
                    maxLength={3}
                    placeholder="7"
                    className="w-full px-3 py-2 rounded-xl bg-[#09090b] border border-white/10 text-white text-sm focus:border-[#10b981] outline-none tracking-wider font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#a1a1aa] block mb-2">Select Jersey Size</label>
                <div className="grid grid-cols-6 gap-2">
                  {["S", "M", "L", "XL", "2XL", "3XL"].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                        selectedSize === size
                          ? "bg-[#10b981] text-black shadow-lg shadow-emerald-500/20"
                          : "bg-[#09090b] text-white border border-white/10 hover:border-white/30"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ORDER ON WHATSAPP CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-full bg-[#10b981] text-black font-bold text-base hover:bg-emerald-400 transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Order via WhatsApp</span>
            </a>

            {/* TRUST BADGES */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 text-center text-xs text-[#a1a1aa]">
              <div className="flex flex-col items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#10b981]" />
                <span>3–5 Days Express Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#10b981]" />
                <span>COD / UPI Direct QR</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-[#10b981]" />
                <span>Free Shipping over ₹1500</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
