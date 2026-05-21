"use client";

import { motion } from "framer-motion";
import { Cpu, Zap, Lock, Globe } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "Neural Processing",
      desc: "Advanced neural networks optimized for real-time complex computations.",
      className: "md:col-span-2 md:row-span-2",
      image: "/neural-processing.png",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Ultra Low Latency",
      desc: "Instantaneous responses with edge-optimized architecture.",
      className: "md:col-span-1 md:row-span-1",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Military Grade",
      desc: "Your data is encrypted and completely isolated.",
      className: "md:col-span-1 md:row-span-1",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Scale",
      desc: "Deployed across 40+ regions for worldwide access.",
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
            A beautiful blend of form and function. Powerful capabilities hidden behind an impossibly simple interface.
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
              className={`glass-card rounded-3xl p-8 flex flex-col justify-between group hover:bg-white/[0.04] transition-colors relative overflow-hidden ${f.className}`}
            >
              {f.image && (
                <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-70 transition-opacity duration-700">
                  <img src={f.image} alt={f.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/80 to-transparent" />
                </div>
              )}
              
              <div className="relative z-10 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white/80 group-hover:scale-110 group-hover:bg-brand-blue group-hover:text-white transition-all duration-500">
                {f.icon}
              </div>
              <div className="relative z-10 mt-12">
                <h3 className="text-xl font-semibold mb-2 text-white">{f.title}</h3>
                <p className="text-white/60">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
