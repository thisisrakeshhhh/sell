"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, MessageCircle, Sparkles } from "lucide-react";

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const searchParams = useSearchParams();

  const source = searchParams.get("source") || "Instagram";
  const campaign = searchParams.get("campaign") || "direct_view";

  const [selectedSize, setSelectedSize] = useState("XL");
  const [customName, setCustomName] = useState("Rakesh");
  const [customNumber, setCustomNumber] = useState("10");

  const product = {
    code: slug.toUpperCase().includes("BAR")
      ? "BAR-10"
      : slug.toUpperCase().includes("RMA")
      ? "RMA-07"
      : slug.toUpperCase().includes("IND")
      ? "IND-18"
      : "MU-18",
    name: slug.includes("barcelona")
      ? "FC Barcelona Away 24/25"
      : slug.includes("madrid")
      ? "Real Madrid Home 24/25"
      : slug.includes("india")
      ? "Team India T20 Champions Kit"
      : "Manchester United Home 24/25",
    price: slug.includes("barcelona") ? 1099 : slug.includes("india") ? 899 : 999,
    compareAtPrice: 1499,
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80",
    availableSizes: ["S", "M", "L", "XL", "2XL"],
  };

  // EXACT WHATSAPP PAYLOAD
  const formattedMessage = `Hi, I want to order:\n\nProduct: ${product.name}\nSKU: ${product.code}\nSize: ${selectedSize}\nName: ${customName || "None"}\nNumber: ${customNumber || "None"}\nSource: ${source}\nCampaign: ${campaign}`;

  // DIRECT TARGET TO META TEST NUMBER (+1 555 672-3534)
  const whatsappUrl = `https://wa.me/15556723534?text=${encodeURIComponent(formattedMessage)}`;

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] pt-8 pb-24 px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/products" className="inline-flex items-center gap-2 text-sm text-[#a1a1aa] hover:text-[#10b981] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Collection</span>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* PRODUCT IMAGE & LIVE BACK PRINT PREVIEW */}
          <div className="glass-card p-4 flex flex-col items-center justify-center">
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-zinc-900 flex items-center justify-center">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-90" />
              
              {/* BACK PRINT PREVIEW OVERLAY */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-black/30 backdrop-blur-[2px]">
                <div className="uppercase font-extrabold text-white text-3xl font-mono drop-shadow-md">
                  {customName || "YOUR NAME"}
                </div>
                <div className="text-7xl font-black text-white font-mono mt-1 drop-shadow-md">
                  {customNumber || "10"}
                </div>
              </div>
            </div>
          </div>

          {/* PRODUCT DETAILS & SELECTION */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-mono font-bold text-[#10b981] uppercase">{product.code}</span>
              <h1 className="text-2xl font-extrabold text-white mt-1">{product.name}</h1>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">₹{product.price}</span>
                <span className="text-xs text-[#a1a1aa] line-through">₹{product.compareAtPrice}</span>
              </div>
            </div>

            {/* AVAILABLE SIZES */}
            <div>
              <label className="text-xs text-[#a1a1aa] block mb-2 font-medium">Available sizes</label>
              <div className="flex gap-2 font-mono">
                {product.availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedSize === size
                        ? "bg-[#10b981] text-black shadow-md shadow-emerald-500/20"
                        : "bg-[#18181b] text-white border border-white/10 hover:border-white/30"
                    }`}
                  >
                    [{size}]
                  </button>
                ))}
              </div>
            </div>

            {/* CUSTOMIZATION INPUTS */}
            <div className="glass-card p-4 space-y-3">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#10b981]" />
                <span>Customization</span>
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-[#a1a1aa] block mb-1">Name</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    maxLength={15}
                    placeholder="Rakesh"
                    className="w-full px-3 py-2 rounded-xl bg-[#09090b] border border-white/10 text-white text-xs font-mono outline-none focus:border-[#10b981]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#a1a1aa] block mb-1">Number</label>
                  <input
                    type="text"
                    value={customNumber}
                    onChange={(e) => setCustomNumber(e.target.value)}
                    maxLength={3}
                    placeholder="10"
                    className="w-full px-3 py-2 rounded-xl bg-[#09090b] border border-white/10 text-white text-xs font-mono outline-none focus:border-[#10b981]"
                  />
                </div>
              </div>
            </div>

            {/* DIRECT ORDER VIA WHATSAPP CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-full bg-[#10b981] text-black font-bold text-sm hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Order on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
