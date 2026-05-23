"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Zap, Lock, Globe, X } from "lucide-react";

export default function Features() {
  const [activeFeature, setActiveFeature] = useState<any>(null);

  const features = [
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "Neural Processing",
      desc: "Advanced neural networks optimized for real-time complex computations.",
      details: "Our proprietary neural processing pipeline utilizes advanced edge-computing to distribute complex matrix multiplications across decentralized nodes. This allows Synapse OS to achieve up to 4x the throughput of standard AI models while maintaining deep contextual understanding.",
      className: "md:col-span-2 md:row-span-2",
      image: "/neural-processing.png",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Ultra Low Latency",
      desc: "Instantaneous responses with edge-optimized architecture.",
      details: "By routing your requests through our globally distributed edge network, we achieve sub-50ms latency for all standard inference requests. The result is an AI that feels less like a chat bot, and more like a direct extension of your own mind.",
      className: "md:col-span-1 md:row-span-1",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Military Grade",
      desc: "Your data is encrypted and completely isolated.",
      details: "All user prompts and chat histories are encrypted at rest using AES-256 and in transit using TLS 1.3. We employ strict zero-trust architecture, meaning your proprietary ideas, code, and conversations remain yours and yours alone.",
      className: "md:col-span-1 md:row-span-1",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Scale",
      desc: "Deployed across 40+ regions for worldwide access.",
      details: "Our infrastructure spans over 40 geographical regions. Our load balancers automatically route your requests to the nearest data center with available capacity, guaranteeing 99.99% uptime regardless of unpredictable global traffic spikes.",
      className: "md:col-span-2 md:row-span-1",
    }
  ];

  return (
    <section id="features" className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
            Intelligence,<br/>redesigned.
          </h2>
          <p className="text-white/50 text-lg max-w-xl">
            A beautiful blend of form and function. Powerful capabilities hidden behind an impossibly simple interface. Click any card to explore.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[240px]">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              onClick={() => setActiveFeature(f)}
              className={`glass-card rounded-3xl p-8 flex flex-col justify-between group hover:bg-white/[0.08] transition-colors relative overflow-hidden cursor-pointer ${f.className}`}
            >
              {f.image && (
                <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-70 transition-opacity duration-700 group-hover:scale-105">
                  <img src={f.image} alt={f.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/80 to-transparent" />
                </div>
              )}
              
              <div className="relative z-10 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white/80 group-hover:scale-110 group-hover:bg-brand-blue group-hover:text-white transition-all duration-500 shadow-lg">
                {f.icon}
              </div>
              <div className="relative z-10 mt-12">
                <h3 className="text-xl font-semibold mb-2 text-white flex items-center justify-between">
                  {f.title}
                  <span className="text-xs text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity">Learn More &rarr;</span>
                </h3>
                <p className="text-white/60">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Feature Details Modal */}
      <AnimatePresence>
        {activeFeature && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveFeature(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg glass-card rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
            >
              {activeFeature.image && (
                <div className="w-full h-48 relative">
                  <img src={activeFeature.image} alt={activeFeature.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020202] to-transparent" />
                </div>
              )}
              <div className={`p-8 ${!activeFeature.image && 'pt-12'}`}>
                <div className="w-16 h-16 rounded-2xl bg-brand-blue/20 flex items-center justify-center border border-brand-blue/30 mb-6 text-brand-blue shadow-[0_0_30px_rgba(0,112,243,0.3)]">
                  {activeFeature.icon}
                </div>
                <h3 className="text-3xl font-bold mb-4">{activeFeature.title}</h3>
                <p className="text-white/70 text-lg leading-relaxed mb-8">
                  {activeFeature.details}
                </p>
                <button 
                  onClick={() => setActiveFeature(null)}
                  className="w-full py-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors font-medium text-white border border-white/5"
                >
                  Close
                </button>
              </div>
              <button 
                onClick={() => setActiveFeature(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-white/20 rounded-full transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
