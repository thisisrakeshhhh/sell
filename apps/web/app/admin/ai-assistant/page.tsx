"use client";

import { useState } from "react";
import { Bot, Send, Sparkles, MessageSquare, Shirt, CheckCircle2, TrendingUp, AlertCircle } from "lucide-react";

export default function AiAssistantPage() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "👋 Hi! I'm your JerseyFlow AI Assistant. Ask me about your revenue, low stock, printing queues, or send bulk WhatsApp payment reminders!",
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userText = inputQuery.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInputQuery("");

    setTimeout(() => {
      let aiReply = "I have analyzed your D1 database records.";
      if (userText.toLowerCase().includes("selling") || userText.toLowerCase().includes("top")) {
        aiReply = "📊 Manchester United Home 24/25 (MU-001) is your top seller this week with 48 orders (₹47,952 revenue)!";
      } else if (userText.toLowerCase().includes("stock") || userText.toLowerCase().includes("low")) {
        aiReply = "🔴 Low Stock Alert: Size XL in MU-001 has only 2 units left. Size 2XL in BAR-004 is out of stock (0 units). Recommend restocking 25 units.";
      } else if (userText.toLowerCase().includes("payment") || userText.toLowerCase().includes("reminder")) {
        aiReply = "💬 Sent automated WhatsApp payment reminders to 3 customers with orders in WAITING_PAYMENT status!";
      } else if (userText.toLowerCase().includes("revenue")) {
        aiReply = "💰 Today's Revenue: ₹13,986 across 14 confirmed orders. Weekly growth is +18%!";
      }

      setMessages((prev) => [...prev, { sender: "ai", text: aiReply }]);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#10b981]" />
            <span>AI Merchant Co-Pilot</span>
          </h1>
          <p className="text-sm text-[#a1a1aa] mt-0.5">Query sales insights, restock alerts, and dispatch WhatsApp actions using natural language.</p>
        </div>
      </div>

      {/* CHAT INTERFACE */}
      <div className="glass-card p-6 h-[500px] flex flex-col justify-between">
        <div className="overflow-y-auto space-y-4 pr-2">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
              {m.sender === "ai" && (
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.sender === "user"
                    ? "bg-[#10b981] text-black font-semibold"
                    : "bg-[#18181b] border border-white/10 text-white"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* INPUT PROMPT BAR */}
        <form onSubmit={handleSend} className="flex gap-2 pt-4 border-t border-white/10">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask AI: 'Which jerseys are selling?', 'Show low stock', 'Send payment reminders'..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#09090b] border border-white/10 text-xs text-white outline-none focus:border-[#10b981]"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-[#10b981] text-black font-bold text-xs hover:bg-emerald-400 flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
