"use client";

import { motion } from "framer-motion";
import { Activity, Users, Zap, Database, ArrowUpRight } from "lucide-react";

const stats = [
  { name: "Total API Calls", value: "24.5M", change: "+14.2%", icon: Activity },
  { name: "Active Users", value: "12,304", change: "+5.4%", icon: Users },
  { name: "Compute Used", value: "842 hrs", change: "-2.1%", icon: Zap },
  { name: "Storage", value: "4.2 TB", change: "+11.1%", icon: Database },
];

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Welcome back, User</h1>
          <p className="text-white/50 text-sm">Here is what's happening with your Synapse OS workspace today.</p>
        </div>
        <button className="hidden md:flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-medium text-sm hover:bg-white/90 transition-colors">
          View Documentation <ArrowUpRight className="w-4 h-4" />
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden group hover:border-white/20 transition-all"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <stat.icon className="w-16 h-16" />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                <stat.icon className="w-4 h-4 text-brand-blue" />
              </div>
              <span className="text-sm font-medium text-white/60">{stat.name}</span>
            </div>
            <div className="flex items-end justify-between">
              <h2 className="text-3xl font-bold">{stat.value}</h2>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                stat.change.startsWith("+") ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
              }`}>
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass-card rounded-2xl border border-white/10 p-6 min-h-[400px] flex flex-col"
        >
          <h3 className="font-semibold mb-6">Compute Usage Overview</h3>
          <div className="flex-1 flex items-center justify-center border border-white/5 rounded-xl bg-white/5 border-dashed">
            <span className="text-white/30 text-sm">Chart rendering visualization...</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl border border-white/10 p-6 flex flex-col"
        >
          <h3 className="font-semibold mb-6">Recent Activity</h3>
          <div className="space-y-4 flex-1">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-2 h-2 mt-2 rounded-full bg-brand-blue" />
                <div>
                  <p className="text-sm font-medium">Model fine-tuning completed</p>
                  <p className="text-xs text-white/40">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
