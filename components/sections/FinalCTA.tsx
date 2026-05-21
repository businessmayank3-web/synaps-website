"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/Button";

export default function FinalCTA() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-blue/10" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-brand-blue/20 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 text-glow">
            Ready to build <br/> the impossible?
          </h2>
          <p className="text-xl text-white/50 mb-12 max-w-xl mx-auto">
            Join thousands of visionary engineers building the next generation of software with Synapse.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              Start Building Now
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/20 text-white bg-black/50 backdrop-blur-md">
              Contact Sales
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
