"use client";

import { useState } from "react";
import { Search, Instagram, PhoneCall, ShoppingBag, Clock, X, FileText, Heart } from "lucide-react";

export default function AdminCustomersPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const customerRecords = [
    {
      id: "c-1",
      phone: "+919876543210",
      name: "Rohan Sharma",
      instagram: "@rohan_sports",
      ordersCount: 8,
      totalRevenue: 7992,
      lastOrder: "Today, 09:30 AM",
      source: "Instagram",
      favoriteClub: "Manchester United",
      favoriteSize: "XL",
      notes: "Regular buyer of Manchester United kits. Prefers Dri-FIT player versions.",
      timeline: [
        { time: "Today 09:30 AM", title: "Placed Order #JF-10024", desc: "MU-001 (Size XL)" },
        { time: "2 weeks ago", title: "Placed Order #JF-09821", desc: "BAR-004 (Size L)" },
      ],
    },
    {
      id: "c-2",
      phone: "+919812345678",
      name: "Ananya Iyer",
      instagram: "@ananya_fcb",
      ordersCount: 1,
      totalRevenue: 1099,
      lastOrder: "Today, 10:15 AM",
      source: "WhatsApp",
      favoriteClub: "FC Barcelona",
      favoriteSize: "M",
      notes: "First time customer. Requested express courier delivery to Noida.",
      timeline: [
        { time: "Today 10:15 AM", title: "Placed Order #JF-10023", desc: "BAR-004 (Size M)" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Customer Records & Directory</h1>
          <p className="text-sm text-[#a1a1aa] mt-0.5">Phone contacts, Instagram handles, lifetime orders, and favorite sizing.</p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-[#a1a1aa] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search phone or handle..."
            className="pl-9 pr-4 py-2 rounded-xl bg-[#18181b] border border-white/10 text-xs text-white outline-none focus:border-[#10b981]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CUSTOMERS DIRECTORY TABLE */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[#a1a1aa]">
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Phone Number</th>
                  <th className="pb-3 font-medium">Instagram</th>
                  <th className="pb-3 font-medium">Orders</th>
                  <th className="pb-3 font-medium">Fav Club & Size</th>
                  <th className="pb-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {customerRecords.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedCustomer(c)}
                    className="hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <td className="py-4 font-semibold text-white">{c.name}</td>
                    <td className="py-4 font-mono text-[#a1a1aa]">{c.phone}</td>
                    <td className="py-4 text-emerald-400 font-mono flex items-center gap-1.5">
                      <Instagram className="w-3.5 h-3.5" />
                      <span>{c.instagram}</span>
                    </td>
                    <td className="py-4 font-bold text-white font-mono">{c.ordersCount}</td>
                    <td className="py-4 text-[#a1a1aa]">
                      {c.favoriteClub} ({c.favoriteSize})
                    </td>
                    <td className="py-4 text-right">
                      <button className="px-3 py-1 rounded-lg bg-[#18181b] border border-white/10 text-white text-xs hover:border-[#10b981]">
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CUSTOMER DETAIL DRAWER */}
        <div className="glass-card p-6">
          {selectedCustomer ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedCustomer.name}</h3>
                  <p className="text-xs text-[#a1a1aa] font-mono">{selectedCustomer.phone}</p>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="text-[#a1a1aa] hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* STATS SUMMARY */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-xl bg-[#09090b] border border-white/5">
                  <p className="text-[10px] text-[#a1a1aa]">Total Orders</p>
                  <p className="text-lg font-bold text-white font-mono mt-0.5">{selectedCustomer.ordersCount}</p>
                </div>
                <div className="p-3 rounded-xl bg-[#09090b] border border-white/5">
                  <p className="text-[10px] text-[#a1a1aa]">Lifetime Spend</p>
                  <p className="text-lg font-bold text-emerald-400 font-mono mt-0.5">₹{selectedCustomer.totalRevenue}</p>
                </div>
              </div>

              {/* PREFERENCES & NOTES */}
              <div className="space-y-3 text-xs text-[#a1a1aa]">
                <p className="flex items-center justify-between">
                  <span>Favorite Club:</span>
                  <strong className="text-white">{selectedCustomer.favoriteClub}</strong>
                </p>
                <p className="flex items-center justify-between">
                  <span>Favorite Size:</span>
                  <strong className="text-emerald-400 font-mono font-bold">{selectedCustomer.favoriteSize}</strong>
                </p>

                <div className="p-3 rounded-xl bg-[#09090b] border border-white/5 mt-2">
                  <p className="text-[10px] font-semibold text-white mb-1">Customer Notes:</p>
                  <p className="text-[11px] text-[#a1a1aa] italic">{selectedCustomer.notes}</p>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <a
                href={`tel:${selectedCustomer.phone}`}
                className="w-full py-2.5 rounded-xl bg-[#10b981] text-black text-xs font-semibold hover:bg-emerald-400 flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call {selectedCustomer.name}</span>
              </a>
            </div>
          ) : (
            <div className="text-center py-12 text-[#a1a1aa] text-xs">
              Select a customer to view order history, preferences & notes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
