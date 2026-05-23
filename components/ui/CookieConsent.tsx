"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import Link from "next/link";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already made a choice
    const consent = localStorage.getItem("synapse_cookie_consent");
    if (!consent) {
      // Add a small delay so the banner slides in smoothly after initial page load animations
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("synapse_cookie_consent", "accepted");
    setIsVisible(false);
  };

  const handleDeny = () => {
    localStorage.setItem("synapse_cookie_consent", "denied");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: -20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-6 left-6 z-[100] w-[340px] glass-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden bg-[#050505]/95 backdrop-blur-xl p-5"
        >
          <button 
            onClick={handleDeny} 
            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-blue/20 flex items-center justify-center border border-brand-blue/30 shrink-0 mt-1 shadow-[0_0_15px_rgba(0,112,243,0.3)]">
              <Cookie className="w-5 h-5 text-brand-blue" />
            </div>
            <div className="pr-4">
              <h3 className="font-semibold text-white mb-1.5 text-sm">We use cookies</h3>
              <p className="text-xs text-white/60 leading-relaxed mb-5">
                We use essential cookies to make our site work. With your consent, we also use cookies to improve user experience. By clicking "Accept All", you agree to our use of cookies as described in our <Link href="/info/privacy" className="text-brand-blue hover:text-brand-blue/80 underline underline-offset-2">Privacy Policy</Link>.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 w-full">
            <button 
              onClick={handleDeny}
              className="flex-1 px-4 py-2.5 text-xs font-medium text-white/70 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
            >
              Deny Optional
            </button>
            <button 
              onClick={handleAccept}
              className="flex-1 px-4 py-2.5 text-xs font-medium text-black bg-white hover:bg-white/90 rounded-xl shadow-lg shadow-white/20 transition-all hover:scale-[1.02]"
            >
              Accept All
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
