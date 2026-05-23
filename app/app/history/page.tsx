"use client";

import { motion } from "framer-motion";
import { Clock, Search } from "lucide-react";

export default function HistoryPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chat History</h1>
          <p className="text-white/50 mt-1">Review your past conversations with Synapse OS.</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center border border-brand-blue/20">
          <Clock className="w-6 h-6 text-brand-blue" />
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
        <input 
          type="text" 
          placeholder="Search history..." 
          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-brand-blue/50 focus:bg-white/10 transition-all"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-12 text-center border border-white/10"
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 mb-4">
          <Clock className="w-8 h-8 text-white/30" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No History Yet</h3>
        <p className="text-white/50">Your future conversations will be securely saved here.</p>
      </motion.div>
    </div>
  );
}
