"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Archive, CheckCircle2, AlertTriangle, Shirt, Save, X, Trash2 } from "lucide-react";

export default function AdminProductsPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formPrice, setFormPrice] = useState(999);
  const [formStock, setFormStock] = useState<Record<string, number>>({ S: 10, M: 10, L: 10, XL: 5, "2XL": 2 });

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

  // Fetch live products from Worker API if available
  useEffect(() => {
    fetch("http://127.0.0.1:8788/api/v1/products")
      .then((res) => res.json())
      .then((res) => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const apiProducts = res.data.map((p: any) => ({
            code: p.code,
            name: p.name,
            sport: p.sport || "Football",
            club: p.club || "General",
            price: p.basePrice || 999,
            stock: {
              S: p.stockS || 0,
              M: p.stockM || 0,
              L: p.stockL || 0,
              XL: p.stockXl || 0,
              "2XL": p.stock2xl || 0,
            },
            active: p.isActive !== false,
          }));
          setProductsList(apiProducts);
        }
      })
      .catch((err) => console.log("Using local state fallback for admin products:", err));
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormName("");
    setFormCode(`MU-00${productsList.length + 1}`);
    setFormPrice(999);
    setFormStock({ S: 10, M: 10, L: 10, XL: 5, "2XL": 2 });
    setShowModal(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormCode(product.code);
    setFormPrice(product.price);
    setFormStock({ ...product.stock });
    setShowModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formCode) return;

    if (editingProduct) {
      // UPDATE EXISTING PRODUCT
      setProductsList((prev) =>
        prev.map((p) =>
          p.code === editingProduct.code
            ? { ...p, name: formName, code: formCode, price: formPrice, stock: { ...formStock } }
            : p
        )
      );
    } else {
      // CREATE NEW PRODUCT
      const newProduct = {
        code: formCode.toUpperCase(),
        name: formName,
        sport: "Football",
        club: "Custom",
        price: formPrice,
        discountPrice: formPrice + 500,
        stock: { ...formStock },
        active: true,
      };
      setProductsList((prev) => [newProduct, ...prev]);

      // Post to Worker API
      fetch("http://127.0.0.1:8788/api/v1/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: formCode.toUpperCase(),
          name: formName,
          basePrice: formPrice,
          stockS: formStock.S,
          stockM: formStock.M,
          stockL: formStock.L,
          stockXl: formStock.XL,
          stock2xl: formStock["2XL"],
        }),
      }).catch((e) => console.log("Local state updated:", e));
    }

    setShowModal(false);
  };

  const toggleArchive = (code: string) => {
    setProductsList((prev) =>
      prev.map((p) => (p.code === code ? { ...p, active: !p.active } : p))
    );
  };

  const handleDeleteProduct = (code: string) => {
    if (confirm(`Are you sure you want to delete SKU ${code}?`)) {
      setProductsList((prev) => prev.filter((p) => p.code !== code));
    }
  };

  return (
    <div className="space-[#09090b] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Products & Visual Inventory</h1>
          <p className="text-sm text-[#a1a1aa] mt-0.5">Full CRUD: Create, Edit, Archive, or Delete jersey products & size matrix.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-[#10b981] text-black text-xs font-bold hover:bg-emerald-400 flex items-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Jersey</span>
        </button>
      </div>

      {/* PRODUCTS TABLE WITH FULL CRUD ACTIONS */}
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
                        onClick={() => openEditModal(p)}
                        title="Edit Product"
                        className="p-1.5 rounded-lg bg-[#18181b] border border-white/10 text-white hover:border-[#10b981]"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => toggleArchive(p.code)}
                        title="Toggle Archive"
                        className="p-1.5 rounded-lg bg-[#18181b] border border-white/10 text-white hover:border-amber-400"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.code)}
                        title="Delete Product"
                        className="p-1.5 rounded-lg bg-[#18181b] border border-white/10 text-red-400 hover:border-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
          <form onSubmit={handleSaveProduct} className="glass-card p-6 w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">
                {editingProduct ? `Edit SKU ${editingProduct.code}` : "Create New Jersey Product"}
              </h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-[#a1a1aa] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-[#a1a1aa] block mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Manchester United Home 25/26"
                  className="w-full px-3 py-2 rounded-xl bg-[#09090b] border border-white/10 text-white text-xs outline-none focus:border-[#10b981]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#a1a1aa] block mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                    placeholder="MU-005"
                    className="w-full px-3 py-2 rounded-xl bg-[#09090b] border border-white/10 text-white text-xs font-mono outline-none focus:border-[#10b981]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#a1a1aa] block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
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
                        value={formStock[sz] ?? 0}
                        onChange={(e) => setFormStock({ ...formStock, [sz]: Number(e.target.value) })}
                        className="w-full px-2 py-1 rounded bg-[#09090b] border border-white/10 text-white text-xs text-center font-mono outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-full bg-[#10b981] text-black font-bold text-xs hover:bg-emerald-400 flex items-center justify-center gap-2 mt-4"
            >
              <Save className="w-4 h-4" />
              <span>{editingProduct ? "Update Product" : "Create Product"}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
