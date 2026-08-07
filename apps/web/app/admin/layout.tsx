"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, LogOut, LayoutDashboard, ShoppingBag, Shirt, Instagram, Printer, Users, Settings } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Dashboard", symbol: "◈", icon: LayoutDashboard },
    { href: "/admin/orders", label: "Orders", symbol: "◇", icon: ShoppingBag },
    { href: "/admin/products", label: "Products", symbol: "◇", icon: Shirt },
    { href: "/admin/campaigns", label: "Campaigns", symbol: "◇", icon: Instagram },
    { href: "/admin/customers", label: "Customers", symbol: "◇", icon: Users },
    { href: "/admin/printing-queue", label: "Printing Queue", symbol: "◇", icon: Printer },
    { href: "/admin/settings", label: "Settings", symbol: "⚙", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col">
      {/* SAAS TOP HEADER BAR */}
      <header className="h-16 border-b border-white/10 px-6 flex items-center justify-between shrink-0 bg-[#09090b]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#10b981] flex items-center justify-center font-bold text-black text-lg">
            J
          </div>
          <span className="font-extrabold text-lg tracking-wider text-white">JERSEYFLOW</span>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-emerald-400">
            SaaS Admin
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-xl bg-[#18181b] border border-white/10 text-[#a1a1aa] hover:text-white relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#10b981]"></span>
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-[#10b981] flex items-center justify-center font-bold text-xs font-mono">
              AD
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-white flex items-center gap-1">
                <span>Admin</span>
                <ChevronDown className="w-3 h-3 text-[#a1a1aa]" />
              </p>
              <p className="text-[10px] text-[#a1a1aa]">admin@jerseyflow.com</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR NAVIGATION WITH SMOOTH ACTIVE INDICATORS */}
        <aside className="w-64 border-r border-white/10 p-4 flex flex-col justify-between shrink-0 bg-[#09090b]">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#18181b] text-white border border-white/10 shadow-lg shadow-emerald-500/10 font-bold"
                      : "text-[#a1a1aa] hover:text-white hover:bg-[#18181b]/50"
                  }`}
                >
                  <span className={`font-mono text-sm ${isActive ? "text-[#10b981]" : "text-[#a1a1aa]"}`}>
                    {item.symbol}
                  </span>
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#10b981]" : ""}`} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-white/10">
            <Link
              href="/login"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs text-[#a1a1aa] hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </Link>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-8 overflow-y-auto bg-[#09090b]">{children}</main>
      </div>
    </div>
  );
}
