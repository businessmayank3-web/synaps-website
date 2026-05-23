"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";

export default function NotificationConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the browser supports notifications
    if (!("Notification" in window)) return;

    // If they already granted or denied at the OS/Browser level, don't show our custom prompt
    if (Notification.permission === "granted" || Notification.permission === "denied") return;

    // Check if they dismissed our custom prompt in a previous session
    const consent = localStorage.getItem("synapse_notification_consent");
    if (!consent) {
      // Delay for 3.5 seconds so it doesn't overlap with the cookie banner popping up immediately
      const timer = setTimeout(() => setIsVisible(true), 3500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleEnable = async () => {
    if (!("Notification" in window)) return;
    
    try {
      // Request native browser permission
      const permission = await Notification.requestPermission();
      // Save their choice so we don't ask again
      localStorage.setItem("synapse_notification_consent", permission);
    } catch (e) {
      console.error("Failed to request notification permission:", e);
      localStorage.setItem("synapse_notification_consent", "error");
    } finally {
      setIsVisible(false);
    }
  };

  const handleDeny = () => {
    // Save dismissal so we don't bother them again
    localStorage.setItem("synapse_notification_consent", "dismissed");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm glass-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden bg-[#050505]/95 backdrop-blur-xl p-4 flex flex-col gap-4"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-blue/20 flex items-center justify-center border border-brand-blue/30 shrink-0 shadow-[0_0_15px_rgba(0,112,243,0.3)]">
              <Bell className="w-5 h-5 text-brand-blue animate-pulse" />
            </div>
            <div className="pr-6">
              <h3 className="font-semibold text-white mb-1 text-sm">Stay Updated</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Enable push notifications to receive real-time alerts about system status, new AI models, and account updates.
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleDeny} 
            className="absolute top-3 right-3 text-white/40 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex gap-2 w-full mt-1">
            <button 
              onClick={handleDeny}
              className="flex-1 px-4 py-2 text-xs font-medium text-white/70 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
            >
              Not Now
            </button>
            <button 
              onClick={handleEnable}
              className="flex-1 px-4 py-2 text-xs font-medium text-black bg-brand-blue hover:bg-brand-blue/90 rounded-lg shadow-[0_0_15px_rgba(0,112,243,0.4)] transition-colors"
            >
              Enable Notifications
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
