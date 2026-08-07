"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon } from "lucide-react";

interface ProductStock {
  S: number;
  M: number;
  L: number;
  XL: number;
  "2XL": number;
}

interface ProductItem {
  id?: string;
  code: string;
  name: string;
  description?: string;
  sport: string;
  club: string;
  price: number;
  compareAtPrice: number;
  image?: string;
  stock: ProductStock;
  allowCustomName: boolean;
  allowCustomNumber: boolean;
  active: boolean;
}

export default function AdminProductsPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Modal Form States
  const [formName, setFormName] = useState("");
  const [formSku, setFormSku] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPrice, setFormPrice] = useState(999);
  const [formCompareAtPrice, setFormCompareAtPrice] = useState(1499);
  const [formStock, setFormStock] = useState<ProductStock>({ S: 10, M: 15, L: 20, XL: 12, "2XL": 5 });
  const [formSizesEnabled, setFormSizesEnabled] = useState({ S: true, M: true, L: true, XL: true, "2XL": true });
  const [formAllowName, setFormAllowName] = useState(true);
  const [formAllowNumber, setFormAllowNumber] = useState(true);
  const [formStatus, setFormStatus] = useState<"published" | "draft">("published");

  const [productsList, setProductsList] = useState<ProductItem[]>([
    {
      code: "MU-18",
      name: "Manchester United Home 24/25",
      description: "Official 24/25 home kit with moisture wicking fabric.",
      sport: "Football",
      club: "Manchester United",
      price: 999,
      compareAtPrice: 1499,
      image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80",
      stock: { S: 10, M: 15, L: 20, XL: 12, "2XL": 5 },
      allowCustomName: true,
      allowCustomNumber: true,
      active: true,
    },
    {
      code: "BAR-10",
      name: "FC Barcelona Away 24/25",
      description: "Away player version kit.",
      sport: "Football",
      club: "FC Barcelona",
      price: 1099,
      compareAtPrice: 1599,
      image: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=800&auto=format&fit=crop&q=80",
      stock: { S: 12, M: 2, L: 8, XL: 0, "2XL": 4 },
      allowCustomName: true,
      allowCustomNumber: true,
      active: true,
    },
    {
      code: "RMA-07",
      name: "Real Madrid Home 24/25",
      description: "Classic white home kit.",
      sport: "Football",
      club: "Real Madrid",
      price: 999,
      compareAtPrice: 1499,
      image: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&auto=format&fit=crop&q=80",
      stock: { S: 0, M: 0, L: 0, XL: 1, "2XL": 0 },
      allowCustomName: true,
      allowCustomNumber: true,
      active: true,
    },
  ]);

  // Fetch live products with zero-crash defensive fallback
  useEffect(() => {
    fetch("/api/v1/products")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((res) => {
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          const apiProducts: ProductItem[] = res.data.map((p: any) => ({
            code: p.code,
            name: p.name,
            description: p.description || "Official match kit",
            sport: p.sport || "Football",
            club: p.club || "General",
            price: p.basePrice || 999,
            compareAtPrice: p.basePrice ? p.basePrice + 500 : 1499,
            stock: {
              S: p.stockS || 0,
              M: p.stockM || 0,
              L: p.stockL || 0,
              XL: p.stockXl || 0,
              "2XL": p.stock2xl || 0,
            },
            allowCustomName: true,
            allowCustomNumber: true,
            active: p.isActive !== false,
          }));
          setProductsList(apiProducts);
        }
      })
      .catch((e) => {
        console.warn("Using local state fallback for products:", e);
      });
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormName("");
    setFormSku(`MU-${productsList.length + 19}`);
    setFormDescription("");
    setFormPrice(999);
    setFormCompareAtPrice(1499);
    setFormStock({ S: 10, M: 15, L: 20, XL: 12, "2XL": 5 });
    setFormSizesEnabled({ S: true, M: true, L: true, XL: true, "2XL": true });
    setFormAllowName(true);
    setFormAllowNumber(true);
    setFormStatus("published");
    setShowModal(true);
  };

  const openEditModal = (product: ProductItem) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormSku(product.code);
    setFormDescription(product.description || "");
    setFormPrice(product.price);
    setFormCompareAtPrice(product.compareAtPrice);
    setFormStock({ ...product.stock });
    setFormSizesEnabled({ S: true, M: true, L: true, XL: true, "2XL": true });
    setFormAllowName(product.allowCustomName);
    setFormAllowNumber(product.allowCustomNumber);
    setFormStatus(product.active ? "published" : "draft");
    setShowModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formSku) return;

    const isPublished = formStatus === "published";

    if (editingProduct) {
      setProductsList((prev) =>
        prev.map((p) =>
          p.code === editingProduct.code
            ? {
                ...p,
                name: formName,
                code: formSku.toUpperCase(),
                description: formDescription,
                price: formPrice,
                compareAtPrice: formCompareAtPrice,
                stock: { ...formStock },
                allowCustomName: formAllowName,
                allowCustomNumber: formAllowNumber,
                active: isPublished,
              }
            : p
        )
      );
    } else {
      const newProduct: ProductItem = {
        code: formSku.toUpperCase(),
        name: formName,
        description: formDescription,
        sport: "Football",
        club: "Custom",
        price: formPrice,
        compareAtPrice: formCompareAtPrice,
        image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80",
        stock: { ...formStock },
        allowCustomName: formAllowName,
        allowCustomNumber: formAllowNumber,
        active: isPublished,
      };
      setProductsList((prev) => [newProduct, ...prev]);

      // Defensive fetch to API
      fetch("/api/v1/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: formSku.toUpperCase(),
          name: formName,
          basePrice: formPrice,
          stockS: formStock.S,
          stockM: formStock.M,
          stockL: formStock.L,
          stockXl: formStock.XL,
          stock2xl: formStock["2XL"],
        }),
      }).catch((e) => console.warn("Local state updated:", e));
    }

    setShowModal(false);
  };

  const handleDeleteProduct = (code: string) => {
    if (confirm(`Are you sure you want to delete SKU ${code}?`)) {
      setProductsList((prev) => prev.filter((p) => p.code !== code));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Products</h1>
          <p className="text-xs text-[#a1a1aa] mt-0.5">Manage jersey catalog, prices, and D1 size stock matrix.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-[#10b981] text-black text-xs font-bold hover:bg-emerald-400 flex items-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Product</span>
        </button>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="glass-card p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[#a1a1aa]">
                <th className="pb-3 font-medium">Image</th>
                <th className="pb-3 font-medium">SKU</th>
                <th className="pb-3 font-medium">Product</th>
                <th className="pb-3 font-medium">Price</th>
                <th className="pb-3 font-medium">Stock Matrix</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {productsList.map((p) => (
                <tr key={p.code} className={`hover:bg-white/5 transition-colors ${!p.active ? "opacity-40" : ""}`}>
                  <td className="py-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-900 border border-white/10 flex items-center justify-center">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-[#a1a1aa]" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 font-mono font-bold text-[#10b981]">{p.code}</td>
                  <td className="py-3 font-semibold text-white">{p.name}</td>
                  <td className="py-3 font-bold text-white">₹{p.price}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-1.5 font-mono">
                      {(["S", "M", "L", "XL", "2XL"] as const).map((sz) => (
                        <span
                          key={sz}
                          className={`px-1.5 py-0.5 rounded text-[10px] border ${
                            p.stock[sz] === 0
                              ? "bg-red-500/10 border-red-500/30 text-red-400"
                              : "bg-white/5 border-white/10 text-white"
                          }`}
                        >
                          {sz}:{p.stock[sz]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        p.active ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-800 text-zinc-500"
                      }`}
                    >
                      {p.active ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="px-2.5 py-1 rounded bg-[#18181b] border border-white/10 text-white hover:border-[#10b981] text-[11px] font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.code)}
                        className="p-1.5 rounded bg-[#18181b] border border-white/10 text-red-400 hover:border-red-500 hover:bg-red-500/10"
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

      {/* ADD / EDIT PRODUCT MODAL FORM */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <form onSubmit={handleSaveProduct} className="glass-card p-6 w-full max-w-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">
                {editingProduct ? `Edit ${editingProduct.code}` : "Product Information"}
              </h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-[#a1a1aa] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-[#a1a1aa] block mb-1 font-medium">Product name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Manchester United Home 24/25"
                  className="w-full px-3 py-2 rounded-xl bg-[#09090b] border border-white/10 text-white outline-none focus:border-[#10b981]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#a1a1aa] block mb-1 font-medium">SKU</label>
                  <input
                    type="text"
                    required
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value.toUpperCase())}
                    placeholder="MU-18"
                    className="w-full px-3 py-2 rounded-xl bg-[#09090b] border border-white/10 text-white font-mono outline-none focus:border-[#10b981]"
                  />
                </div>
                <div>
                  <label className="text-[#a1a1aa] block mb-1 font-medium">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#09090b] border border-white/10 text-white outline-none focus:border-[#10b981]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#a1a1aa] block mb-1 font-medium">Description</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Official stadium edition kit engineered with Dri-FIT moisture-wicking fabric."
                  className="w-full px-3 py-2 rounded-xl bg-[#09090b] border border-white/10 text-white outline-none focus:border-[#10b981]"
                />
              </div>

              {/* SIZES & STOCK MATRIX */}
              <div>
                <label className="text-[#a1a1aa] block mb-2 font-medium">Sizes & Stock Matrix</label>
                <div className="grid grid-cols-5 gap-2">
                  {(["S", "M", "L", "XL", "2XL"] as const).map((sz) => (
                    <div key={sz} className="p-2 rounded-xl bg-[#09090b] border border-white/10 text-center space-y-1">
                      <label className="flex items-center justify-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formSizesEnabled[sz]}
                          onChange={(e) => setFormSizesEnabled({ ...formSizesEnabled, [sz]: e.target.checked })}
                          className="accent-[#10b981]"
                        />
                        <span className="font-mono font-bold text-white">{sz}</span>
                      </label>
                      <input
                        type="number"
                        disabled={!formSizesEnabled[sz]}
                        value={formStock[sz]}
                        onChange={(e) => setFormStock({ ...formStock, [sz]: Number(e.target.value) })}
                        className="w-full px-1 py-0.5 rounded bg-[#18181b] border border-white/10 text-white text-center font-mono outline-none disabled:opacity-30"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* CUSTOMIZATION OPTIONS */}
              <div>
                <label className="text-[#a1a1aa] block mb-2 font-medium">Customization Options</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-white cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={formAllowName}
                      onChange={(e) => setFormAllowName(e.target.checked)}
                      className="accent-[#10b981]"
                    />
                    <span>Name Customization</span>
                  </label>

                  <label className="flex items-center gap-2 text-white cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={formAllowNumber}
                      onChange={(e) => setFormAllowNumber(e.target.checked)}
                      className="accent-[#10b981]"
                    />
                    <span>Number Customization</span>
                  </label>
                </div>
              </div>

              {/* STATUS */}
              <div>
                <label className="text-[#a1a1aa] block mb-2 font-medium">Status</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-white cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="status"
                      value="published"
                      checked={formStatus === "published"}
                      onChange={() => setFormStatus("published")}
                      className="accent-[#10b981]"
                    />
                    <span>Published</span>
                  </label>

                  <label className="flex items-center gap-2 text-[#a1a1aa] cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="status"
                      value="draft"
                      checked={formStatus === "draft"}
                      onChange={() => setFormStatus("draft")}
                      className="accent-[#10b981]"
                    />
                    <span>Draft</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl bg-[#18181b] border border-white/10 text-white text-xs font-semibold hover:border-white/30"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-full bg-[#10b981] text-black text-xs font-bold hover:bg-emerald-400 flex items-center gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Product</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
