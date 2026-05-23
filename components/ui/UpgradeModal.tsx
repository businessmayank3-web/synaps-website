"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, Zap, Code, ImageIcon, X, Shield } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export default function UpgradeModal({ isOpen, onClose, title = "Upgrade to Synapse 2.0 Pro", description = "Unlock the full potential of your AI workspace." }: UpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-[#050505] border border-brand-blue/30 shadow-[0_0_50px_rgba(0,112,243,0.15)] z-10"
        >
          {/* Glowing Background */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-blue/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600/20 blur-[100px] rounded-full pointer-events-none" />

          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-blue to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-brand-blue/20">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">{title}</h2>
            <p className="text-white/60 mb-8 max-w-sm">
              {description}
            </p>

            <div className="w-full space-y-4 mb-8 text-left">
              <div className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="p-2 rounded-lg bg-brand-blue/20 shrink-0">
                  <Code className="w-5 h-5 text-brand-blue" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Advanced Code Generation</h4>
                  <p className="text-sm text-white/50">Build full-stack apps effortlessly with zero token limits.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="p-2 rounded-lg bg-purple-500/20 shrink-0">
                  <ImageIcon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Vision & Data Processing</h4>
                  <p className="text-sm text-white/50">Analyze massive datasets and extract text from complex images.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="p-2 rounded-lg bg-emerald-500/20 shrink-0">
                  <Zap className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Priority Compute</h4>
                  <p className="text-sm text-white/50">Skip the queue. Get your responses generated 5x faster.</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => alert("Synapse 2.0 Pro upgrades are coming soon!")}
              className="w-full bg-white text-black font-semibold py-4 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:bg-white/90 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <Shield className="w-5 h-5" />
              Upgrade Now
            </button>
            <p className="text-xs text-white/30 mt-4">Cancel anytime. Secure checkout via Stripe.</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
