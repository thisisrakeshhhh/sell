"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

const PRODUCTS = [
  {
    id: "prod-1",
    code: "MU-18",
    slug: "mu-18",
    name: "Manchester United Home 24/25",
    sport: "Football",
    club: "Manchester United",
    price: 999,
    originalPrice: 1499,
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80",
    tags: ["Best Seller"],
    stock: 2,
  },
  {
    id: "prod-2",
    code: "BAR-10",
    slug: "bar-10",
    name: "FC Barcelona Away 24/25",
    sport: "Football",
    club: "FC Barcelona",
    price: 1099,
    originalPrice: 1599,
    image: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&auto=format&fit=crop&q=80",
    tags: ["Player Version"],
    stock: 12,
  },
  {
    id: "prod-3",
    code: "RMA-07",
    slug: "rma-07",
    name: "Real Madrid Home 24/25",
    sport: "Football",
    club: "Real Madrid",
    price: 999,
    originalPrice: 1499,
    image: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=800&auto=format&fit=crop&q=80",
    tags: ["Limited Edition"],
    stock: 0,
  },
  {
    id: "prod-4",
    code: "IND-18",
    slug: "ind-18",
    name: "Team India T20 Champions Kit",
    sport: "Cricket",
    club: "India Cricket",
    price: 899,
    originalPrice: 1299,
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80",
    tags: ["Retro Classic"],
    stock: 24,
  },
];

export default function CatalogPage() {
  const [selectedSport, setSelectedSport] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesSport = selectedSport === "All" || product.sport === selectedSport;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.code.toLowerCase().includes(query) ||
      product.club.toLowerCase().includes(query) ||
      product.tags.some((t) => t.toLowerCase().includes(query));

    return matchesSport && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] pt-12 pb-24 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Digital Showroom</h1>
            <p className="text-sm text-[#a1a1aa] mt-1">Official stadium kits, player versions, and cricket classics.</p>
          </div>

          {/* REAL-TIME PRODUCT SEARCH BY SKU OR NAME */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#a1a1aa] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search MU-18, BAR-10, Retro..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#18181b] border border-white/10 text-xs text-white placeholder-[#a1a1aa] focus:border-[#10b981] outline-none transition-colors"
            />
          </div>
        </div>

        {/* SPORT FILTER STRIP */}
        <div className="flex flex-wrap items-center gap-3 border-b border-white/10 pb-4">
          {["All", "Football", "Cricket", "NBA", "Anime"].map((sport) => (
            <button
              key={sport}
              onClick={() => setSelectedSport(sport)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedSport === sport
                  ? "bg-[#10b981] text-black shadow-lg shadow-emerald-500/20"
                  : "bg-[#18181b] border border-white/10 text-white hover:border-white/30"
              }`}
            >
              {sport}
            </button>
          ))}
        </div>

        {/* PRODUCT GRID */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((jersey) => {
              const isOutOfStock = jersey.stock === 0;
              const isLowStock = jersey.stock > 0 && jersey.stock <= 3;

              return (
                <div key={jersey.id} className="glass-card glass-card-hover p-4 flex flex-col group">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-900">
                    <img
                      src={jersey.image}
                      alt={jersey.name}
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                        isOutOfStock ? "opacity-40 grayscale" : ""
                      }`}
                    />
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-semibold text-[#10b981] uppercase">
                      {jersey.tags[0]}
                    </span>
                    <span className="absolute top-3 right-3 px-2 py-1 rounded bg-[#10b981] text-black font-mono font-bold text-xs shadow-lg">
                      {jersey.code}
                    </span>

                    {/* STOCK AVAILABILITY BADGES */}
                    {isOutOfStock ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
                        <span className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-bold font-mono uppercase tracking-wider">
                          Out of Stock
                        </span>
                      </div>
                    ) : isLowStock ? (
                      <span className="absolute bottom-3 left-3 px-2 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold">
                        Only {jersey.stock} left
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-xs text-[#a1a1aa]">{jersey.club}</span>
                      <h3 className="text-base font-semibold text-white mt-1 group-hover:text-[#10b981] transition-colors">
                        {jersey.name}
                      </h3>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-white">₹{jersey.price}</span>
                        <span className="text-xs text-[#a1a1aa] line-through ml-2">₹{jersey.originalPrice}</span>
                      </div>
                      {isOutOfStock ? (
                        <button
                          disabled
                          className="px-3 py-1.5 rounded-full bg-zinc-800 text-zinc-500 text-xs font-semibold cursor-not-allowed"
                        >
                          Sold Out
                        </button>
                      ) : (
                        <Link
                          href={`/products/${jersey.slug}`}
                          className="px-3 py-1.5 rounded-full bg-[#10b981] text-black text-xs font-semibold hover:bg-emerald-400 transition-colors"
                        >
                          View Details
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-card p-12 text-center text-[#a1a1aa]">
            <Search className="w-8 h-8 text-[#10b981] mx-auto mb-3 opacity-50" />
            <p className="text-sm font-semibold text-white">No jerseys found</p>
            <p className="text-xs mt-1">Try searching for "MU-18", "BAR-10", or "Retro"</p>
          </div>
        )}
      </div>
    </div>
  );
}
