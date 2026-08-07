"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Shirt, Users, Settings, LogOut, Instagram, Printer, Bot } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { href: "/admin/products", label: "Products & Stock", icon: Shirt },
    { href: "/admin/campaigns", label: "Campaign Analytics", icon: Instagram },
    { href: "/admin/printing-queue", label: "Printing Queue", icon: Printer },
    { href: "/admin/ai-assistant", label: "AI Co-Pilot", icon: Bot },
    { href: "/admin/customers", label: "Customers", icon: Users },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex">
      {/* SIDEBAR NAVIGATION WITH DYNAMIC ACTIVE TAB STYLING */}
      <aside className="w-64 border-r border-white/10 p-6 flex flex-col justify-between shrink-0 bg-[#09090b]">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-[#10b981] flex items-center justify-center font-bold text-black text-lg">
              J
            </div>
            <span className="font-bold text-lg text-white">JerseyFlow</span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-emerald-400">
              Merchant
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#18181b] text-white border border-white/10 shadow-lg shadow-emerald-500/5"
                      : "text-[#a1a1aa] hover:text-white hover:bg-[#18181b]/50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#10b981]" : ""}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-[#10b981] flex items-center justify-center font-bold text-xs">
              AD
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Merchant Admin</p>
              <p className="text-[10px] text-[#a1a1aa]">admin@jerseyflow.com</p>
            </div>
          </div>
          <Link href="/login" className="text-[#a1a1aa] hover:text-red-400">
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
