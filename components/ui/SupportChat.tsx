"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, User, Brain, Loader2, Headphones } from "lucide-react";

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{role: "user" | "assistant", content: string}[]>([
    { role: "assistant", content: "Hi there! I'm your Synapse Assistant. How can I help you today?" }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    const newMessages = [...messages, { role: "user" as const, content: userMessage }];
    setMessages(newMessages);

    try {
      // Prepend a system prompt to the payload being sent to the API to enforce the support persona
      const apiPayload = [
        { role: "user", content: "System Instruction: You are the helpful, polite, and technical Synapse Assistant. Keep your answers concise, professional, and friendly. Now answer the user's messages." },
        ...newMessages
      ];

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiPayload }),
      });

      if (!res.ok) throw new Error("Failed to send message");
      if (!res.body) throw new Error("No response body");
      
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let text = "";

      // Initialize an empty message
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          text += decoder.decode(value, { stream: true });
          setMessages(prev => {
            const newArr = [...prev];
            newArr[newArr.length - 1] = { role: "assistant", content: text };
            return newArr;
          });
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: "assistant", content: "I'm having trouble connecting to my neural network right now. Please try again later or contact human support." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const openContactModal = () => {
    window.dispatchEvent(new Event("openContactModal"));
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-brand-blue rounded-full shadow-[0_0_20px_rgba(0,112,243,0.4)] flex items-center justify-center text-white cursor-pointer hover:bg-brand-blue/90 transition-colors"
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-48px)] glass-card border border-white/10 rounded-2xl flex flex-col shadow-2xl overflow-hidden bg-[#050505]/95 backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-blue/20 flex items-center justify-center border border-brand-blue/30">
                  <Headphones className="w-4 h-4 text-brand-blue" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Synapse Assistant</h3>
                  <p className="text-[10px] text-brand-blue flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue inline-block animate-pulse" /> Online
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center border border-white/10 bg-white/5">
                      {msg.role === 'user' ? <User className="w-4 h-4 text-white/70" /> : <Brain className="w-4 h-4 text-brand-blue" />}
                    </div>
                    <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-brand-blue text-white rounded-tr-sm' 
                        : 'bg-white/10 text-white/90 rounded-tl-sm'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center border border-white/10 bg-white/5">
                      <Brain className="w-4 h-4 text-brand-blue" />
                    </div>
                    <div className="p-4 rounded-2xl bg-white/10 text-white/90 rounded-tl-sm flex items-center">
                      <Loader2 className="w-4 h-4 animate-spin text-brand-blue" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Human Support Link */}
            <div className="px-4 py-2 border-t border-white/10 bg-white/5 flex justify-center">
              <button 
                onClick={openContactModal}
                className="text-xs text-white/50 hover:text-white transition-colors underline underline-offset-2"
              >
                Still having issues? Contact Human Support
              </button>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-black border-t border-white/10">
              <div className="flex items-end gap-2 bg-white/5 border border-white/10 rounded-xl p-2 focus-within:border-white/30 transition-colors">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type your issue..."
                  className="w-full bg-transparent border-none focus:ring-0 text-sm text-white resize-none max-h-32 min-h-[40px] px-2 py-2"
                  rows={1}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="p-2 bg-brand-blue text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-blue/90 transition-colors shrink-0 mb-0.5"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
