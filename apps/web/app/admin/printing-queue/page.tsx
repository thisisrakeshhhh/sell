"use client";

import { useState } from "react";
import { Printer, CheckCircle2, FileText, Shirt } from "lucide-react";

export default function PrintingQueuePage() {
  const [printingQueue, setPrintingQueue] = useState([
    {
      id: "JF-10022",
      productName: "Real Madrid Home 24/25",
      productCode: "RMA-007",
      customName: "RONALDO",
      customNumber: "7",
      size: "XL",
      customerName: "Vikram Singh",
      status: "PRINTING",
    },
    {
      id: "JF-10020",
      productName: "Manchester United Home 24/25",
      productCode: "MU-001",
      customName: "REY",
      customNumber: "24",
      size: "L",
      customerName: "Rohan Sharma",
      status: "PRINTING",
    },
  ]);

  const handlePrintBatch = () => {
    window.print();
  };

  const markPacked = (id: string) => {
    setPrintingQueue(printingQueue.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-white">Batch Printing Queue & Custom Sheets</h1>
          <p className="text-sm text-[#a1a1aa] mt-0.5">Generate printable production sheets for custom back name & number prints.</p>
        </div>

        <button
          onClick={handlePrintBatch}
          className="px-4 py-2 rounded-xl bg-[#10b981] text-black text-xs font-bold hover:bg-emerald-400 flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          <span>Print Production Sheet</span>
        </button>
      </div>

      {/* PRINTABLE BATCH SUMMARY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {printingQueue.map((item) => (
          <div key={item.id} className="glass-card p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-xs font-mono text-[#10b981]">{item.id}</span>
                <p className="text-sm font-bold text-white">{item.productName}</p>
              </div>
              <span className="px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-mono font-bold">
                SIZE: {item.size}
              </span>
            </div>

            {/* PRINT SHEET SPECIFICATION BOX */}
            <div className="p-4 rounded-xl bg-[#09090b] border border-white/10 text-center">
              <p className="text-[10px] text-[#a1a1aa] uppercase font-mono">Back Print Spec</p>
              <p className="text-2xl font-black text-white font-mono mt-1 uppercase tracking-widest">{item.customName || "NO NAME"}</p>
              <p className="text-4xl font-extrabold text-[#10b981] font-mono mt-1">{item.customNumber || "N/A"}</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#a1a1aa]">Customer: {item.customerName}</span>
              <button
                onClick={() => markPacked(item.id)}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 flex items-center gap-1.5 print:hidden"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Packed</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
