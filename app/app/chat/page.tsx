"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: "Hello! I am Synapse OS. How can I help you accelerate your workflow today?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const newMessages = [
      ...messages,
      { id: Date.now(), role: "user" as const, content: input }
    ];
    setMessages(newMessages);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: "This is a simulated response. Once the database and backend logic are integrated, this will connect to a real LLM endpoint."
        }
      ]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] max-w-4xl mx-auto glass-card border border-white/10 rounded-3xl overflow-hidden relative">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between z-10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-blue/20 flex items-center justify-center border border-brand-blue/30">
            <Sparkles className="w-5 h-5 text-brand-blue" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">Synapse Assistant</h2>
            <p className="text-xs text-white/40">GPT-4 Turbo Architecture</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 z-10">
        {messages.map((msg) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id}
            className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              msg.role === "user" ? "bg-white/10" : "bg-brand-blue/20 border border-brand-blue/30"
            }`}>
              {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-brand-blue" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
              msg.role === "user" 
                ? "bg-white text-black rounded-tr-sm" 
                : "bg-white/5 border border-white/10 rounded-tl-sm"
            }`}>
              {msg.content}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/5 border-t border-white/10 z-10 backdrop-blur-md">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-4 pr-12 py-4 focus:outline-none focus:border-brand-blue/50 focus:bg-white/10 transition-all text-sm"
          />
          <button
            onClick={handleSend}
            className="absolute right-2 p-2 bg-white text-black rounded-xl hover:scale-105 transition-transform"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center mt-3">
          <span className="text-[10px] text-white/30 uppercase tracking-widest">AI can make mistakes. Verify important info.</span>
        </div>
      </div>
    </div>
  );
}
