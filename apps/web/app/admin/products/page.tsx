"use client";

import { useState } from "react";
import { Plus, Edit2, Archive, CheckCircle2, AlertTriangle, Shirt, Save, X, Image as ImageIcon } from "lucide-react";

export default function AdminProductsPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [productsList, setProductsList] = useState([
    {
      code: "MU-001",
      name: "Manchester United Home 24/25",
      sport: "Football",
      club: "Manchester United",
      price: 999,
      discountPrice: 1499,
      stock: { S: 8, M: 14, L: 6, XL: 2, "2XL": 0 },
      active: true,
    },
    {
      code: "BAR-004",
      name: "FC Barcelona Away 24/25",
      sport: "Football",
      club: "FC Barcelona",
      price: 1099,
      discountPrice: 1599,
      stock: { S: 12, M: 2, L: 8, XL: 0, "2XL": 4 },
      active: true,
    },
    {
      code: "RMA-007",
      name: "Real Madrid Home 24/25",
      sport: "Football",
      club: "Real Madrid",
      price: 999,
      discountPrice: 1499,
      stock: { S: 0, M: 0, L: 0, XL: 1, "2XL": 0 },
      active: true,
    },
    {
      code: "IND-002",
      name: "Team India T20 Champions Kit",
      sport: "Cricket",
      club: "India Cricket",
      price: 899,
      discountPrice: 1299,
      stock: { S: 10, M: 15, L: 20, XL: 8, "2XL": 5 },
      active: true,
    },
  ]);

  const toggleArchive = (code: string) => {
    setProductsList(
      productsList.map((p) => (p.code === code ? { ...p, active: !p.active } : p))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Products & Visual Inventory</h1>
          <p className="text-sm text-[#a1a1aa] mt-0.5">Manage jersey catalog, visual size matrix, pricing, and active status.</p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setShowModal(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-[#10b981] text-black text-xs font-bold hover:bg-emerald-400 flex items-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Jersey</span>
        </button>
      </div>

      {/* PRODUCTS TABLE WITH VISUAL STOCK MATRIX */}
      <div className="glass-card p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[#a1a1aa]">
                <th className="pb-3 font-medium">SKU</th>
                <th className="pb-3 font-medium">Jersey Name</th>
                <th className="pb-3 font-medium">Price</th>
                <th className="pb-3 font-medium">Visual Size Matrix</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {productsList.map((p) => (
                <tr key={p.code} className={`hover:bg-white/5 transition-colors ${!p.active ? "opacity-40" : ""}`}>
                  <td className="py-4 font-mono font-bold text-[#10b981]">{p.code}</td>
                  <td className="py-4">
                    <p className="font-semibold text-white">{p.name}</p>
                    <p className="text-[11px] text-[#a1a1aa]">{p.sport} • {p.club}</p>
                  </td>
                  <td className="py-4 font-bold text-white">₹{p.price}</td>
                  <td className="py-4">
                    {/* VISUAL STOCK MATRIX */}
                    <div className="flex items-center gap-2 font-mono">
                      {Object.entries(p.stock).map(([sz, qty]) => (
                        <span
                          key={sz}
                          className={`px-2 py-1 rounded text-[10px] font-bold border ${
                            qty === 0
                              ? "bg-red-500/10 border-red-500/30 text-red-400"
                              : qty <= 2
                              ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                              : "bg-white/5 border-white/10 text-white"
                          }`}
                        >
                          {sz}: {qty} {qty === 0 ? "❌" : qty <= 2 ? "🔴" : ""}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4">
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-mono font-bold ${
                        p.active ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-800 text-zinc-500"
                      }`}
                    >
                      {p.active ? "ACTIVE" : "ARCHIVED"}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct(p);
                          setShowModal(true);
                        }}
                        className="p-1.5 rounded-lg bg-[#18181b] border border-white/10 text-white hover:border-[#10b981]"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => toggleArchive(p.code)}
                        className="p-1.5 rounded-lg bg-[#18181b] border border-white/10 text-white hover:border-amber-400"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT PRODUCT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="glass-card p-6 w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">
                {editingProduct ? `Edit ${editingProduct.code}` : "Create New Jersey Product"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-[#a1a1aa] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-[#a1a1aa] block mb-1">Product Name</label>
                <input
                  type="text"
                  defaultValue={editingProduct?.name || ""}
                  placeholder="e.g. Manchester United Home 25/26"
                  className="w-full px-3 py-2 rounded-xl bg-[#09090b] border border-white/10 text-white text-xs outline-none focus:border-[#10b981]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#a1a1aa] block mb-1">SKU Code</label>
                  <input
                    type="text"
                    defaultValue={editingProduct?.code || "MU-005"}
                    placeholder="MU-005"
                    className="w-full px-3 py-2 rounded-xl bg-[#09090b] border border-white/10 text-white text-xs font-mono outline-none focus:border-[#10b981]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#a1a1aa] block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    defaultValue={editingProduct?.price || 999}
                    className="w-full px-3 py-2 rounded-xl bg-[#09090b] border border-white/10 text-white text-xs outline-none focus:border-[#10b981]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#a1a1aa] block mb-1">Size Stock Matrix</label>
                <div className="grid grid-cols-5 gap-2">
                  {["S", "M", "L", "XL", "2XL"].map((sz) => (
                    <div key={sz}>
                      <span className="text-[10px] text-[#a1a1aa] block text-center font-mono">{sz}</span>
                      <input
                        type="number"
                        defaultValue={editingProduct?.stock?.[sz] ?? 10}
                        className="w-full px-2 py-1 rounded bg-[#09090b] border border-white/10 text-white text-xs text-center font-mono outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2.5 rounded-full bg-[#10b981] text-black font-bold text-xs hover:bg-emerald-400 flex items-center justify-center gap-2 mt-4"
            >
              <Save className="w-4 h-4" />
              <span>Save Product</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
