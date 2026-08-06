"use client";

import { use, useState } from "react";
import { Clock, CheckCircle2, Package, Truck, Printer, FileText, ArrowLeft, Shirt } from "lucide-react";
import Link from "next/link";

export default function OrderTrackingPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const resolvedParams = use(params);
  const orderNumber = resolvedParams.orderNumber.toUpperCase();

  const [order] = useState({
    orderNumber,
    customerName: "Rohan Sharma",
    productName: "Manchester United Home 24/25",
    productCode: "MU-001",
    customName: "BECKHAM",
    customNumber: "7",
    size: "L",
    totalAmount: 999,
    status: "PRINTING", // NEW, WAITING_CALL, CONFIRMED, WAITING_PAYMENT, PAID, PRINTING, PACKED, SHIPPED, DELIVERED
    shippingAddress: "Indiranagar, Bengaluru",
    courier: "Delhivery Express",
    trackingNumber: "DEL987654321IN",
    timeline: [
      { date: "Today, 09:30 AM", title: "Order Initialized via WhatsApp", done: true },
      { date: "Today, 09:35 AM", title: "Confirmed by Merchant Call", done: true },
      { date: "Today, 10:00 AM", title: "UPI Payment Verified (₹999)", done: true },
      { date: "Today, 11:15 AM", title: "Printing Custom Back Name & Number", done: true },
      { date: "Estimated Tomorrow", title: "Packing & Dispatch to Delhivery", done: false },
      { date: "Expected 2 Days", title: "Out for Delivery", done: false },
    ],
  });

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6 max-w-3xl mx-auto space-y-6">
      <Link href="/products" className="inline-flex items-center gap-2 text-xs text-[#a1a1aa] hover:text-white">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Storefront</span>
      </Link>

      <div className="glass-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <span className="text-xs font-mono text-[#10b981]">Order Tracker</span>
            <h1 className="text-2xl font-black text-white">{order.orderNumber}</h1>
          </div>

          <span className="px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-bold self-start sm:self-auto">
            STATUS: {order.status}
          </span>
        </div>

        {/* CUSTOMIZATION PREVIEW & PRODUCT DETAILS */}
        <div className="p-4 rounded-xl bg-[#18181b] border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-xs text-[#a1a1aa]">{order.productCode}</p>
            <h3 className="text-sm font-bold text-white">{order.productName}</h3>
            <p className="text-xs text-emerald-400 font-mono mt-0.5">Size {order.size} • Total ₹{order.totalAmount}</p>
          </div>

          <div className="p-3 rounded-lg bg-[#09090b] text-center border border-white/10">
            <p className="text-[10px] text-[#a1a1aa]">Print Spec</p>
            <p className="text-sm font-extrabold text-white font-mono">{order.customName} #{order.customNumber}</p>
          </div>
        </div>

        {/* TRACKING TIMELINE */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#10b981]" />
            <span>Live Order Progress</span>
          </h3>

          <div className="space-y-4 pl-3 border-l-2 border-white/10">
            {order.timeline.map((step, idx) => (
              <div key={idx} className="relative pl-5">
                <span
                  className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    step.done ? "bg-[#10b981] text-black font-bold" : "bg-white/10 text-[#a1a1aa]"
                  }`}
                >
                  {step.done ? "✓" : idx + 1}
                </span>
                <p className={`text-xs font-semibold ${step.done ? "text-white" : "text-[#a1a1aa]"}`}>{step.title}</p>
                <p className="text-[10px] text-[#a1a1aa] font-mono">{step.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* COURIER DISPATCH INFORMATION */}
        {order.trackingNumber && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-emerald-400 font-mono">Courier Partner</p>
              <p className="text-xs font-bold text-white">{order.courier}</p>
              <p className="text-[11px] text-[#a1a1aa] font-mono mt-0.5">AWB: {order.trackingNumber}</p>
            </div>

            <button
              onClick={() => alert(`Tracking ${order.trackingNumber} on ${order.courier}`)}
              className="px-3 py-1.5 rounded-lg bg-[#10b981] text-black text-xs font-bold hover:bg-emerald-400"
            >
              Track Package
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
