"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import Spline from '@splinetool/react-spline';
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Spline 3D Scene */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <Spline scene="https://prod.spline.design/OQJgwnHyt3Jol5GQ/scene.splinecode" />
      </div>

      {/* Dark overlay to ensure text is readable, adjustable based on the Spline scene brightness */}
      <div className="absolute inset-0 z-0 bg-black/40 pointer-events-none mix-blend-multiply" />

      <div className="container mx-auto px-6 relative z-10 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl pt-24 md:pt-0"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-block mb-6 px-4 py-1.5 rounded-full glass border-white/10 text-sm font-medium text-white/80"
          >
            Introducing Synapse OS 2.0 ✨
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 text-glow leading-[1.1] pointer-events-auto text-left">
            The Future of AI <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">
              Starts Here.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-xl font-light leading-relaxed drop-shadow-md text-left">
            Experience the next generation of artificial intelligence. Designed with minimalistic luxury and engineered for ultimate performance.
          </p>
          
          <div className="flex flex-col sm:flex-row items-start justify-start gap-4 pointer-events-auto">
            <Link href="/sign-in" className="w-full sm:w-auto">
              <Button size="lg" className="w-full">Get Started</Button>
            </Link>
            <Button variant="glass" size="lg" className="w-full sm:w-auto">Watch Demo</Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
