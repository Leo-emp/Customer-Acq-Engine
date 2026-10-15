"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Headphones, Loader2 } from "lucide-react";
import type { CompanyProfile } from "@/lib/store";
import type { Prospect, CallRecord, Invoice } from "@/lib/types";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface SupportChatProps {
  prospect: Prospect | null;
  deal: CallRecord | null;
  invoice: Invoice | null;
  productDescription: string;
  profile?: CompanyProfile | null;
}

export default function SupportChat({ prospect, deal, invoice, productDescription, profile }: SupportChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !prospect) return;
    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, prospect, deal, invoice, productDescription, chatHistory: messages, profile }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply || data.error }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!prospect) return null;

  return (
    <div className="glass-card flex flex-col h-[400px]">
      <div className="px-4 py-3 border-b border-card-border">
        <h3 className="text-sm font-semibold flex items-center gap-2 text-text-primary">
          <Headphones size={16} className="text-teal-400" />
          Customer Support
        </h3>
        <p className="text-xs text-text-muted mt-0.5">
          Assisting {prospect.contactName} at {prospect.companyName}
        </p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <p className="text-sm text-text-muted text-center py-8">
            Ask anything about the customer&apos;s account...
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
              msg.role === "user" ? "bg-brand-blue text-white" : "bg-space-700 text-text-secondary"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-space-700 px-3 py-2 rounded-xl">
              <div className="flex gap-1">
                <span className="typing-dot w-1.5 h-1.5 bg-text-muted rounded-full" />
                <span className="typing-dot w-1.5 h-1.5 bg-text-muted rounded-full" />
                <span className="typing-dot w-1.5 h-1.5 bg-text-muted rounded-full" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-card-border">
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 bg-space-700 border border-card-border rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-blue text-text-primary placeholder:text-text-muted"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 bg-brand-blue hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </form>
      </div>
    </div>
  );
}
