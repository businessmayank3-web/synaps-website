"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  const faqs = [
    { q: "How is Synapse different from existing AI models?", a: "Synapse is built from the ground up on custom silicon and proprietary architectures. We don't rely on legacy transformer models, allowing us to achieve 100x lower latency and significantly higher accuracy on complex reasoning tasks." },
    { q: "Is my data used to train your models?", a: "Never. Enterprise and Pro tier customer data is siloed and instantly deleted post-processing. We are strictly a platform, not a data broker." },
    { q: "Can I deploy on-premise?", a: "Yes. Our Enterprise tier includes fully air-gapped on-premise deployment options for organizations with the highest security requirements." },
    { q: "What is the typical integration time?", a: "Most teams have Synapse integrated into production within 48 hours. Our REST APIs and SDKs are designed to be drop-in replacements for most legacy providers." }
  ];

  return (
    <section id="faq" className="py-32">
      <div className="container mx-auto px-6 max-w-3xl">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-center mb-16">
          Frequently asked questions.
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-card rounded-2xl overflow-hidden">
              <button 
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-6 py-6 flex items-center justify-between text-left"
              >
                <span className="font-medium text-lg">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-white/50 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-white/50">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
