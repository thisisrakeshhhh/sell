import Link from "next/link";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";

const FEATURED_JERSEYS = [
  {
    id: "prod-1",
    code: "MU-18",
    slug: "mu-18",
    name: "Manchester United Home 24/25",
    club: "Manchester United",
    price: 999,
    originalPrice: 1499,
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80",
    badge: "Best Seller",
  },
  {
    id: "prod-2",
    code: "BAR-10",
    slug: "bar-10",
    name: "FC Barcelona Away 24/25",
    club: "FC Barcelona",
    price: 1099,
    originalPrice: 1599,
    image: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&auto=format&fit=crop&q=80",
    badge: "Player Version",
  },
  {
    id: "prod-3",
    code: "RMA-07",
    slug: "rma-07",
    name: "Real Madrid Home 24/25",
    club: "Real Madrid",
    price: 999,
    originalPrice: 1499,
    image: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=800&auto=format&fit=crop&q=80",
    badge: "Limited Edition",
  },
  {
    id: "prod-4",
    code: "IND-18",
    slug: "ind-18",
    name: "Team India T20 Champions Kit",
    club: "India Cricket",
    price: 899,
    originalPrice: 1299,
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80",
    badge: "Retro Classic",
  },
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#09090b] text-[#f4f4f5]">
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#18181b] border border-white/10 text-xs font-medium text-[#10b981] mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Comment or DM product SKU on Instagram to order</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
          Masterpiece Jerseys. <br />
          <span className="bg-gradient-to-r from-[#10b981] via-emerald-400 to-indigo-400 bg-clip-text text-transparent">
            Direct on WhatsApp.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-[#a1a1aa] max-w-2xl mx-auto">
          Instagram gets attention. Website builds trust. WhatsApp closes the sale. Send short SKU codes like <code className="text-emerald-400 font-mono">MU-18</code> or <code className="text-emerald-400 font-mono">BAR-10</code> on WhatsApp.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/products"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#10b981] text-black font-semibold text-base hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <span>Explore Digital Showroom</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://wa.me/919999999999?text=MU-18"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#18181b] border border-white/10 text-white font-medium text-base hover:bg-[#27272a] transition-all flex items-center justify-center gap-2 font-mono"
          >
            <MessageCircle className="w-5 h-5 text-[#10b981]" />
            <span>Send "MU-18" on WhatsApp</span>
          </a>
        </div>
      </section>

      {/* 2. TOP CLUBS STRIP */}
      <section className="py-8 border-y border-white/10 bg-[#18181b]/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-6 text-sm text-[#a1a1aa] font-medium">
          <span>POPULAR SKUs:</span>
          {[
            { club: "Man United (MU-18)", sku: "MU-18" },
            { club: "Barcelona (BAR-10)", sku: "BAR-10" },
            { club: "Real Madrid (RMA-07)", sku: "RMA-07" },
            { club: "India Cricket (IND-18)", sku: "IND-18" },
            { club: "Argentina (ARG-10)", sku: "ARG-10" },
          ].map((item) => (
            <a
              key={item.sku}
              href={`https://wa.me/919999999999?text=${item.sku}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-[#09090b] border border-white/10 text-white/90 hover:border-[#10b981] font-mono text-xs cursor-pointer transition-colors"
            >
              {item.club}
            </a>
          ))}
        </div>
      </section>

      {/* 3. FEATURED JERSEYS (STRICTLY 4 ITEMS) */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Digital Showroom</h2>
            <p className="text-[#a1a1aa] mt-2">Inspect high-res photos, size charts, and custom name previews.</p>
          </div>
          <Link href="/products" className="mt-4 md:mt-0 text-[#10b981] hover:underline text-sm font-medium flex items-center gap-1">
            <span>View All Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_JERSEYS.map((jersey) => (
            <div key={jersey.id} className="glass-card glass-card-hover p-4 flex flex-col group">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-900">
                <img
                  src={jersey.image}
                  alt={jersey.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-semibold text-[#10b981] uppercase tracking-wider">
                  {jersey.badge}
                </span>
                <span className="absolute top-3 right-3 px-2 py-1 rounded-md bg-[#10b981] text-black font-mono font-bold text-xs shadow-lg">
                  {jersey.code}
                </span>
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
                  <Link
                    href={`/products/${jersey.slug}`}
                    className="px-3 py-1.5 rounded-full bg-[#10b981] text-black text-xs font-semibold hover:bg-emerald-400 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold">How JerseyFlow Works</h2>
          <p className="text-[#a1a1aa] mt-2">Zero payment gateways. Instant WhatsApp confirmation & UPI QR payments.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-[#10b981]/10 text-[#10b981] flex items-center justify-center text-xl font-bold mx-auto mb-6">
              1
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Send SKU on WhatsApp</h3>
            <p className="text-sm text-[#a1a1aa]">Send short code like <code className="text-emerald-400 font-mono">MU-18</code> or <code className="text-emerald-400 font-mono">BAR-10</code> to our bot.</p>
          </div>

          <div className="glass-card p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-[#10b981]/10 text-[#10b981] flex items-center justify-center text-xl font-bold mx-auto mb-6">
              2
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Confirm Details & Call</h3>
            <p className="text-sm text-[#a1a1aa]">Provide name, number & address. Merchant calls to confirm your order.</p>
          </div>

          <div className="glass-card p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-[#10b981]/10 text-[#10b981] flex items-center justify-center text-xl font-bold mx-auto mb-6">
              3
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">UPI QR & Fast Delivery</h3>
            <p className="text-sm text-[#a1a1aa]">Receive payment QR, send screenshot, and get tracking within 3-5 days.</p>
          </div>
        </div>
      </section>

      {/* 5. FLOATING WHATSAPP CTA */}
      <a
        href="https://wa.me/919999999999?text=MU-18"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#10b981] text-black shadow-2xl shadow-emerald-500/40 hover:scale-110 transition-all flex items-center gap-2 group"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-bold whitespace-nowrap">
          Order MU-18 on WhatsApp
        </span>
      </a>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/10 text-center text-xs text-[#a1a1aa]">
        <p>© 2026 JerseyFlow. Built for WhatsApp & Instagram Jersey Brands.</p>
      </footer>
    </div>
  );
}
