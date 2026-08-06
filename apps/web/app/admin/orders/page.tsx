"use client";

import { useState, useEffect, useRef } from "react";
import { PhoneCall, CheckCircle2, Search, Clock, X, Printer, PackageCheck, Truck, AlertCircle } from "lucide-react";

export default function AdminOrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // KEYBOARD SHORTCUTS: / to focus search, Esc to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "Escape") {
        setSelectedOrder(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const ordersList = [
    {
      id: "JF-10024",
      customerName: "Rohan Sharma",
      customerPhone: "+919876543210",
      instagramHandle: "@rohan_sports",
      productName: "Manchester United Home 24/25",
      productCode: "MU-001",
      size: "L",
      customName: "BECKHAM",
      customNumber: "7",
      totalAmount: 999,
      status: "WAITING_CALL",
      paymentStatus: "pending",
      shippingAddress: "Flat 402, Green Valley Apartments, Indiranagar, Bengaluru 560038",
      createdAt: "2026-08-06 09:30 AM",
      timeline: [
        { time: "09:30 AM", title: "Customization Started", desc: "Customer initialized custom back print on web" },
        { time: "09:33 AM", title: "Draft Order Created", desc: "Draft order logged via WhatsApp link" },
      ],
    },
    {
      id: "JF-10023",
      customerName: "Ananya Iyer",
      customerPhone: "+919812345678",
      instagramHandle: "@ananya_fcb",
      productName: "FC Barcelona Away 24/25",
      productCode: "BAR-004",
      size: "M",
      customName: "MESSI",
      customNumber: "10",
      totalAmount: 1099,
      status: "WAITING_PAYMENT",
      paymentStatus: "pending",
      shippingAddress: "B-12, Sector 62, Noida, Uttar Pradesh 201301",
      createdAt: "2026-08-06 10:15 AM",
      timeline: [
        { time: "10:15 AM", title: "Draft Order Created", desc: "Draft order created" },
        { time: "10:20 AM", title: "Customer Called", desc: "Owner confirmed size M & shipping details via call" },
        { time: "10:22 AM", title: "UPI QR Sent", desc: "Merchant UPI VPA QR sent in WhatsApp chat" },
      ],
    },
    {
      id: "JF-10022",
      customerName: "Vikram Singh",
      customerPhone: "+919988776655",
      instagramHandle: "@vikram_rm",
      productName: "Real Madrid Home 24/25",
      productCode: "RMA-007",
      size: "XL",
      customName: "RONALDO",
      customNumber: "7",
      totalAmount: 999,
      status: "PAID",
      paymentStatus: "verified",
      shippingAddress: "C-45, Jubilee Hills, Hyderabad 500033",
      createdAt: "2026-08-06 11:00 AM",
      timeline: [
        { time: "11:00 AM", title: "Payment Verified", desc: "UPI screenshot approved by merchant" },
      ],
    },
  ];

  const handleStateAction = (orderId: string, action: string) => {
    alert(`Order ${orderId} transition: ${action}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Order Management</h1>
          <p className="text-sm text-[#a1a1aa] mt-0.5">
            Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono">/</kbd> to search, <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono">Esc</kbd> to close drawer.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#a1a1aa] absolute left-3 top-3" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order #, phone... [/]"
              className="pl-9 pr-4 py-2 rounded-xl bg-[#18181b] border border-white/10 text-xs text-white outline-none focus:border-[#10b981]"
            />
          </div>
        </div>
      </div>

      {/* ORDERS BOARD & DRAWER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ORDER LIST TABLE */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[#a1a1aa]">
                  <th className="pb-3 font-medium">Order #</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Customization</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {ordersList.map((ord) => (
                  <tr
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className="hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <td className="py-4 font-mono font-bold text-white">{ord.id}</td>
                    <td className="py-4">
                      <p className="font-semibold text-white">{ord.customerName}</p>
                      <p className="text-[11px] text-[#a1a1aa] font-mono">{ord.customerPhone}</p>
                    </td>
                    <td className="py-4">
                      <p className="text-white font-mono">{ord.customName || "NO NAME"} #{ord.customNumber || "N/A"}</p>
                      <p className="text-[11px] text-[#a1a1aa]">{ord.productCode} • Size {ord.size}</p>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-mono font-bold ${
                        ord.status === "WAITING_CALL"
                          ? "bg-amber-500/10 text-amber-400"
                          : ord.status === "WAITING_PAYMENT"
                          ? "bg-indigo-500/10 text-indigo-400"
                          : "bg-emerald-500/10 text-emerald-400"
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button className="px-3 py-1 rounded-lg bg-[#18181b] border border-white/10 text-white text-xs hover:border-[#10b981]">
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* STATE-DRIVEN ORDER ACTION DRAWER */}
        <div className="glass-card p-6 relative">
          {selectedOrder ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="text-xs font-mono text-[#10b981]">{selectedOrder.id}</span>
                  <h3 className="text-lg font-bold text-white">{selectedOrder.customerName}</h3>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-[#a1a1aa] hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* CUSTOMER & CONTACT DETAILS */}
              <div className="space-y-2 text-xs text-[#a1a1aa]">
                <p><strong className="text-white">Phone:</strong> {selectedOrder.customerPhone}</p>
                <p><strong className="text-white">Instagram:</strong> {selectedOrder.instagramHandle || "N/A"}</p>
                <p><strong className="text-white">Address:</strong> {selectedOrder.shippingAddress}</p>
              </div>

              {/* CUSTOM PRINT DETAIL */}
              <div className="p-4 rounded-xl bg-[#09090b] border border-white/5 text-center">
                <p className="text-xs text-[#a1a1aa]">Back Print Configuration</p>
                <p className="text-xl font-extrabold text-white font-mono mt-1">{selectedOrder.customName} {selectedOrder.customNumber}</p>
                <p className="text-xs text-emerald-400 mt-1">{selectedOrder.productName} ({selectedOrder.size})</p>
              </div>

              {/* STATE-DRIVEN DYNAMIC OPERATIONAL ACTIONS */}
              <div className="space-y-2">
                {selectedOrder.status === "WAITING_CALL" && (
                  <>
                    <a
                      href={`tel:${selectedOrder.customerPhone}`}
                      className="w-full py-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold hover:bg-amber-500/20 flex items-center justify-center gap-2"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>☎ Call Customer</span>
                    </a>
                    <button
                      onClick={() => handleStateAction(selectedOrder.id, "Confirm Order & Send QR")}
                      className="w-full py-2.5 rounded-xl bg-[#10b981] text-black text-xs font-semibold hover:bg-emerald-400 flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>✓ Confirm Order & Send UPI QR</span>
                    </button>
                  </>
                )}

                {selectedOrder.status === "WAITING_PAYMENT" && (
                  <>
                    <button
                      onClick={() => handleStateAction(selectedOrder.id, "Approve Payment Screenshot")}
                      className="w-full py-2.5 rounded-xl bg-[#10b981] text-black text-xs font-semibold hover:bg-emerald-400 flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Payment Screenshot</span>
                    </button>
                  </>
                )}

                {selectedOrder.status === "PAID" && (
                  <button
                    onClick={() => handleStateAction(selectedOrder.id, "Start Printing Jersey")}
                    className="w-full py-2.5 rounded-xl bg-indigo-500 text-white text-xs font-semibold hover:bg-indigo-600 flex items-center justify-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Start Printing Jersey</span>
                  </button>
                )}

                {selectedOrder.status === "PRINTING" && (
                  <button
                    onClick={() => handleStateAction(selectedOrder.id, "Pack Jersey")}
                    className="w-full py-2.5 rounded-xl bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 flex items-center justify-center gap-2"
                  >
                    <PackageCheck className="w-4 h-4" />
                    <span>Pack Jersey</span>
                  </button>
                )}

                {selectedOrder.status === "PACKED" && (
                  <button
                    onClick={() => handleStateAction(selectedOrder.id, "Dispatch & Ship")}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 text-black text-xs font-semibold hover:bg-emerald-400 flex items-center justify-center gap-2"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Dispatch & Ship Order</span>
                  </button>
                )}
              </div>

              {/* CUSTOMER CONVERSATION TIMELINE */}
              <div className="pt-4 border-t border-white/10">
                <h4 className="text-xs font-semibold text-white mb-3 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>Order Audit Timeline</span>
                </h4>

                <div className="space-y-3 pl-2 border-l border-white/10">
                  {selectedOrder.timeline.map((evt: any, i: number) => (
                    <div key={i} className="relative pl-4">
                      <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[#10b981]" />
                      <p className="text-xs font-semibold text-white">{evt.title} <span className="text-[10px] text-[#a1a1aa] font-mono">({evt.time})</span></p>
                      <p className="text-[11px] text-[#a1a1aa]">{evt.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-[#a1a1aa] text-xs">
              Select an order to view valid state actions. Press <kbd className="px-1 py-0.5 rounded bg-white/10 text-[10px] font-mono">Esc</kbd> to close.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
