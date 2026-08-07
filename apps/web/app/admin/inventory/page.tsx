"use client";

import { useState } from "react";
import { Plus, Minus, RotateCcw } from "lucide-react";

export default function AdminInventoryPage() {
  const [stockMatrix, setStockMatrix] = useState([
    { id: "s1", code: "MU-001", name: "Manchester United Home 24/25", variant: "Standard Fan", size: "S", available: 8, reserved: 1 },
    { id: "s2", code: "MU-001", name: "Manchester United Home 24/25", variant: "Standard Fan", size: "M", available: 14, reserved: 2 },
    { id: "s3", code: "MU-001", name: "Manchester United Home 24/25", variant: "Standard Fan", size: "L", available: 6, reserved: 0 },
    { id: "s4", code: "MU-001", name: "Manchester United Home 24/25", variant: "Standard Fan", size: "XL", available: 2, reserved: 1 },
    { id: "s5", code: "BAR-004", name: "FC Barcelona Away 24/25", variant: "Player Version", size: "M", available: 2, reserved: 1 },
    { id: "s6", code: "BAR-004", name: "FC Barcelona Away 24/25", variant: "Player Version", size: "L", available: 8, reserved: 0 },
  ]);

  const updateAvailableStock = (id: string, delta: number) => {
    setStockMatrix((prev) =>
      prev.map((item) => (item.id === id ? { ...item, available: Math.max(0, item.available + delta) } : item))
    );
  };

  const restockItem = (id: string, qty: number = 10) => {
    setStockMatrix((prev) =>
      prev.map((item) => (item.id === id ? { ...item, available: item.available + qty } : item))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Stock & Variant Inventory</h1>
          <p className="text-sm text-[#a1a1aa] mt-0.5">Manage Available vs Reserved stock per size variant to prevent overselling.</p>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[#a1a1aa]">
                <th className="pb-3 font-medium">Product Code</th>
                <th className="pb-3 font-medium">Jersey & Variant</th>
                <th className="pb-3 font-medium">Size</th>
                <th className="pb-3 font-medium">Available Stock</th>
                <th className="pb-3 font-medium">Reserved Stock</th>
                <th className="pb-3 font-medium text-right">Quick Stock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stockMatrix.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 font-mono font-bold text-white">{item.code}</td>
                  <td className="py-4">
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="text-[11px] text-[#a1a1aa]">{item.variant}</p>
                  </td>
                  <td className="py-4 font-bold text-[#10b981] font-mono">{item.size}</td>
                  <td className="py-4 font-bold font-mono text-white">
                    {item.available} {item.available <= 2 && <span className="text-amber-400 text-[10px] ml-1">(Low Stock ⚠️)</span>}
                  </td>
                  <td className="py-4 text-indigo-400 font-mono font-bold">{item.reserved}</td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => updateAvailableStock(item.id, -1)}
                        className="p-1 rounded bg-[#18181b] border border-white/10 text-white hover:border-red-500"
                        title="Decrease Stock by 1"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => updateAvailableStock(item.id, 1)}
                        className="p-1 rounded bg-[#18181b] border border-white/10 text-white hover:border-[#10b981]"
                        title="Increase Stock by 1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => restockItem(item.id, 10)}
                        className="px-2 py-1 rounded bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] text-[10px] font-mono font-bold hover:bg-[#10b981]/20 flex items-center gap-1"
                        title="Add +10 Units"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>+10 Restock</span>
                      </button>
                    </div>
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
