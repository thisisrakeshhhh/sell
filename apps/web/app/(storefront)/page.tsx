"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Trophy } from "lucide-react";

export default function StorefrontHomePage() {
  const quotes = [
    "\"Football is a game of passion, precision, and pride.\"",
    "\"Class is permanent. Wear the colors of glory.\"",
    "\"The shirt on your back represents history.\"",
    "\"Every match day tells a new story.\"",
    "\"Some people believe football is a matter of life and death. It's much more important than that.\"",
  ];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const featuredProducts = [
    {
      code: "MU-18",
      name: "Manchester United Home 24/25",
      club: "Manchester United",
      price: 999,
      compareAtPrice: 1499,
      image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80",
      slug: "manchester-united-home-24-25",
      badge: "Best Seller",
    },
    {
      code: "BAR-10",
      name: "FC Barcelona Away 24/25",
      club: "FC Barcelona",
      price: 1099,
      compareAtPrice: 1599,
      image: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=800&auto=format&fit=crop&q=80",
      slug: "fc-barcelona-away-24-25",
      badge: "Player Version",
    },
    {
      code: "RMA-07",
      name: "Real Madrid Home 24/25",
      club: "Real Madrid",
      price: 999,
      compareAtPrice: 1499,
      image: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&auto=format&fit=crop&q=80",
      slug: "real-madrid-home-24-25",
      badge: "Popular",
    },
    {
      code: "IND-18",
      name: "Team India T20 Champions Kit",
      club: "India Cricket",
      price: 899,
      compareAtPrice: 1299,
      image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80",
      slug: "team-india-t20-champions",
      badge: "Limited Edition",
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5]">
      {/* ANIMATED FOOTBALL QUOTE HERO */}
      <section className="relative py-24 px-6 max-w-7xl mx-auto text-center overflow-hidden">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] text-xs font-mono font-bold mb-6">
          <Trophy className="w-3.5 h-3.5" />
          <span>The Heritage Collection</span>
        </div>

        {/* DYNAMIC CYCLING FOOTBALL QUOTE ANIMATION */}
        <div className="h-32 sm:h-40 flex items-center justify-center">
          <h1
            key={currentQuoteIndex}
            className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight italic font-serif transition-all duration-700 animate-fadeIn"
          >
            {quotes[currentQuoteIndex]}
          </h1>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/products"
            className="px-8 py-3.5 rounded-full bg-[#10b981] text-black font-bold text-sm hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-xl shadow-emerald-500/20 group"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* SHOWROOM CATALOG GRID */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#10b981]" />
            <span>Jerseys Collection</span>
          </h2>
          <Link href="/products" className="text-xs text-[#10b981] hover:underline font-mono font-bold">
            View All ({featuredProducts.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((p) => (
            <Link
              key={p.code}
              href={`/products/${p.slug}`}
              className="glass-card overflow-hidden group hover:border-[#10b981]/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-square overflow-hidden bg-zinc-900">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  />
                  <span className="absolute top-3 left-3 px-2 py-1 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-[#10b981] font-bold">
                    SKU: {p.code}
                  </span>
                  <span className="absolute top-3 right-3 px-2 py-1 rounded bg-[#10b981] text-black text-[10px] font-extrabold">
                    {p.badge}
                  </span>
                </div>

                <div className="p-4 space-y-1">
                  <p className="text-[11px] text-[#a1a1aa] font-mono">{p.club}</p>
                  <h3 className="text-sm font-bold text-white group-hover:text-[#10b981] transition-colors line-clamp-1">
                    {p.name}
                  </h3>
                  <div className="pt-2 flex items-baseline gap-2">
                    <span className="text-base font-extrabold text-white">₹{p.price}</span>
                    <span className="text-xs text-[#a1a1aa] line-through">₹{p.compareAtPrice}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <span className="w-full py-2 rounded-xl bg-[#18181b] border border-white/10 text-white text-xs font-semibold hover:bg-[#10b981] hover:text-black hover:border-transparent transition-all flex items-center justify-center gap-1">
                  <span>View Details</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-8 px-6 text-center text-xs text-[#a1a1aa]">
        <p>© 2026 JerseyFlow Digital Showroom.</p>
      </footer>
    </div>
  );
}
