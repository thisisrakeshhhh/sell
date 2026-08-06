import Link from "next/link";
import { LayoutDashboard, ShoppingBag, Shirt, Users, Settings, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex">
      {/* SIDEBAR NAVIGATION (STREAMLINED 5 TABS) */}
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
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-white bg-[#18181b] border border-white/10"
            >
              <LayoutDashboard className="w-4 h-4 text-[#10b981]" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#a1a1aa] hover:text-white hover:bg-[#18181b]/50 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Orders</span>
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#a1a1aa] hover:text-white hover:bg-[#18181b]/50 transition-colors"
            >
              <Shirt className="w-4 h-4" />
              <span>Products & Stock</span>
            </Link>
            <Link
              href="/admin/customers"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#a1a1aa] hover:text-white hover:bg-[#18181b]/50 transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>Customers</span>
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#a1a1aa] hover:text-white hover:bg-[#18181b]/50 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
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
