import { PhoneCall, AlertTriangle, CheckCircle2, Clock, Truck, DollarSign, ArrowUpRight } from "lucide-react";

export default function AdminDashboardPage() {
  const metrics = [
    { title: "Today's Orders", value: "14", icon: Clock, color: "text-[#10b981]" },
    { title: "Pending Calls", value: "5", icon: PhoneCall, color: "text-amber-400" },
    { title: "Waiting for Payment", value: "3", icon: AlertTriangle, color: "text-indigo-400" },
    { title: "Ready To Ship", value: "8", icon: Truck, color: "text-blue-400" },
    { title: "Low Stock", value: "3 Items", icon: AlertTriangle, color: "text-red-400" },
    { title: "Revenue Today", value: "₹13,986", icon: DollarSign, color: "text-emerald-400" },
  ];

  const lowStockItems = [
    { code: "MU24H", name: "Manchester United Home 24/25", variant: "Standard", size: "XL", stock: 1 },
    { code: "BAR24A", name: "FC Barcelona Away 24/25", variant: "Player Version", size: "M", stock: 2 },
    { code: "RMA24H", name: "Real Madrid Home 24/25", variant: "Standard", size: "3XL", stock: 1 },
  ];

  const recentOrders = [
    { id: "JF-10024", customer: "Rohan Sharma", product: "MU24H (Size L)", nameOnBack: "BECKHAM 7", status: "WAITING_CALL", total: "₹999" },
    { id: "JF-10023", customer: "Ananya Iyer", product: "BAR24A (Size M)", nameOnBack: "MESSI 10", status: "WAITING_PAYMENT", total: "₹1099" },
    { id: "JF-10022", customer: "Vikram Singh", product: "RMA24H (Size XL)", nameOnBack: "RONALDO 7", status: "PAID", total: "₹999" },
    { id: "JF-10021", customer: "Priya Nair", product: "IND24C (Size S)", nameOnBack: "KOHLI 18", status: "SHIPPED", total: "₹899" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Operational Dashboard</h1>
        <p className="text-sm text-[#a1a1aa] mt-1">Real-time order confirmation calls, UPI payments, and inventory alerts.</p>
      </div>

      {/* OPERATIONAL METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {metrics.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="glass-card p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#a1a1aa]">{item.title}</span>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div className="mt-3 text-xl font-bold text-white">{item.value}</div>
            </div>
          );
        })}
      </div>

      {/* LOW STOCK ALERTS & QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LOW STOCK ALERT CARD */}
        <div className="glass-card p-6 border-amber-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Low Stock Alerts</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-semibold">
              Action Required
            </span>
          </div>

          <div className="space-y-3">
            {lowStockItems.map((item) => (
              <div key={item.code + item.size} className="p-3 rounded-xl bg-[#09090b] border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">{item.code} ({item.size})</p>
                  <p className="text-[11px] text-[#a1a1aa]">{item.name}</p>
                </div>
                <span className="px-2 py-1 rounded bg-red-500/10 text-red-400 text-xs font-mono font-bold">
                  {item.stock} left
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT ORDERS TABLE */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Recent WhatsApp Orders</h3>
            <button className="text-xs text-[#10b981] hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[#a1a1aa]">
                  <th className="pb-3 font-medium">Order #</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Product</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 font-mono font-semibold text-white">{ord.id}</td>
                    <td className="py-3 text-white">{ord.customer}</td>
                    <td className="py-3 text-[#a1a1aa]">{ord.product}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-[10px] font-mono font-bold ${
                        ord.status === "WAITING_CALL"
                          ? "bg-amber-500/10 text-amber-400"
                          : ord.status === "WAITING_PAYMENT"
                          ? "bg-indigo-500/10 text-indigo-400"
                          : ord.status === "PAID"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-blue-500/10 text-blue-400"
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 text-right font-semibold text-white">{ord.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
