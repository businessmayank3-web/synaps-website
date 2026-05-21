"use client";

import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    { num: "01", title: "Ingestion", desc: "Raw data is securely streamed through end-to-end encrypted tunnels into the Synapse core." },
    { num: "02", title: "Processing", desc: "Our custom silicon rapidly processes billion-parameter models in milliseconds." },
    { num: "03", title: "Synthesis", desc: "Complex patterns are identified and transformed into actionable intelligence." },
    { num: "04", title: "Delivery", desc: "Results are served back to your edge devices with zero perceived latency." },
  ];

  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
            How it works
          </h2>
          <p className="text-white/50 text-lg">A seamless pipeline from data to intelligence.</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Connecting Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-white/10 md:-translate-x-1/2" />

          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className={`relative flex items-center justify-between mb-16 md:mb-24 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="hidden md:block w-5/12" />
              
              {/* Node */}
              <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-brand-blue shadow-[0_0_20px_rgba(0,112,243,0.8)] transform -translate-x-1/2 z-10" />
              
              <div className="w-full md:w-5/12 pl-16 md:pl-0">
                <div className="glass-card p-8 rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 text-8xl font-black text-white/5 pointer-events-none -mt-4 -mr-4">
                    {step.num}
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 relative z-10">{step.title}</h3>
                  <p className="text-white/50 relative z-10">{step.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
