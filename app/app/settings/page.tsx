"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-white/50 text-sm">Manage your account settings and preferences.</p>
      </motion.div>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 border border-white/10"
        >
          <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Email Address</label>
              <input 
                type="email" 
                disabled 
                value={user?.email || ""} 
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white/50 cursor-not-allowed" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Display Name</label>
              <input 
                type="text" 
                defaultValue={user?.displayName || ""} 
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-blue transition-colors" 
                placeholder="Your name"
              />
            </div>
            <Button>Save Changes</Button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
