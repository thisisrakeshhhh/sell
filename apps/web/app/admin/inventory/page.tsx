"use client";

import { Layers, AlertTriangle } from "lucide-react";

export default function AdminInventoryPage() {
  const stockMatrix = [
    { code: "MU24H", name: "Manchester United Home 24/25", variant: "Standard", size: "S", available: 4, reserved: 1 },
    { code: "MU24H", name: "Manchester United Home 24/25", variant: "Standard", size: "M", available: 6, reserved: 2 },
    { code: "MU24H", name: "Manchester United Home 24/25", variant: "Standard", size: "L", available: 7, reserved: 0 },
    { code: "MU24H", name: "Manchester United Home 24/25", variant: "Standard", size: "XL", available: 1, reserved: 1 },
    { code: "BAR24A", name: "FC Barcelona Away 24/25", variant: "Player Version", size: "M", available: 2, reserved: 1 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Stock & Variant Inventory</h1>
        <p className="text-sm text-[#a1a1aa] mt-0.5">Manage Available vs Reserved stock per size variant to prevent overselling.</p>
      </div>

      <div className="glass-card p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[#a1a1aa]">
                <th className="pb-3 font-medium">Product Code</th>
                <th className="pb-3 font-medium">Variant</th>
                <th className="pb-3 font-medium">Size</th>
                <th className="pb-3 font-medium">Available Stock</th>
                <th className="pb-3 font-medium">Reserved Stock</th>
                <th className="pb-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stockMatrix.map((item, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 font-mono font-bold text-white">{item.code}</td>
                  <td className="py-4 text-[#a1a1aa]">{item.variant}</td>
                  <td className="py-4 font-bold text-[#10b981] font-mono">{item.size}</td>
                  <td className="py-4 font-bold font-mono text-white">
                    {item.available} {item.available <= 2 && <span className="text-amber-400 text-[10px] ml-1">(Low Stock)</span>}
                  </td>
                  <td className="py-4 text-indigo-400 font-mono font-bold">{item.reserved}</td>
                  <td className="py-4 text-right">
                    <button className="px-3 py-1 rounded bg-[#18181b] border border-white/10 text-white text-xs hover:border-[#10b981]">
                      Update Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
