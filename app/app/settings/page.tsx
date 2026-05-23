"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { Camera, Crown, Zap, CheckCircle2, User, Loader2 } from "lucide-react";
import { updateProfile } from "firebase/auth";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function SettingsPage() {
  const { user } = useAuth();
  
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [upgradeClicked, setUpgradeClicked] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updateProfile(user, {
        displayName: displayName.trim()
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingImage(true);
    try {
      // Create a reference to the storage location
      const storageRef = ref(storage, `profile_pictures/${user.uid}/${file.name}`);
      
      // Upload the file
      await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update Auth Profile
      await updateProfile(user, {
        photoURL: downloadURL
      });
      
      // Force reload to reflect new image (Firebase Auth state doesn't always deeply react to photoURL changes instantly without a reload or context force-refresh)
      window.location.reload();
      
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please ensure Firebase Storage is enabled in your console.");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-white/50 text-sm">Manage your account settings and billing preferences.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Profile */}
        <div className="md:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-blue to-purple-500" />
            <h2 className="text-xl font-bold mb-6">Profile Settings</h2>
            
            <div className="flex flex-col sm:flex-row gap-8 items-start mb-8">
              {/* Profile Picture */}
              <div className="relative group shrink-0">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  hidden 
                  accept="image/*" 
                  onChange={handleImageUpload}
                />
                <div className="w-24 h-24 rounded-full bg-white/5 border border-white/20 flex items-center justify-center overflow-hidden">
                  {uploadingImage ? (
                    <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
                  ) : user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-white/30" />
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Form Fields */}
              <div className="flex-1 w-full space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Display Name</label>
                  <input 
                    type="text" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-blue focus:bg-white/10 transition-all" 
                    placeholder="e.g. Alex Node"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    disabled 
                    value={user?.email || ""} 
                    className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white/40 cursor-not-allowed" 
                  />
                  <p className="text-xs text-white/30 mt-2">Email address cannot be changed for security reasons.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/10">
              {saveSuccess && <span className="text-sm text-green-400">Successfully saved!</span>}
              <Button 
                onClick={handleSaveProfile} 
                disabled={isSaving || displayName === user?.displayName}
                className="px-8 min-w-[140px]"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Save Profile"}
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Plan & Subscription */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-3xl p-6 border border-brand-blue/30 relative overflow-hidden bg-brand-blue/5"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/20 blur-[50px] rounded-full pointer-events-none" />

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-brand-blue/20 flex items-center justify-center border border-brand-blue/30">
                <Crown className="w-5 h-5 text-brand-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white/70 uppercase tracking-widest">Current Plan</h3>
                <p className="text-xl font-bold text-white">Free Tier</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <CheckCircle2 className="w-4 h-4 text-brand-blue" />
                <span>100 AI Queries / Month</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <CheckCircle2 className="w-4 h-4 text-brand-blue" />
                <span>Standard Speed</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <CheckCircle2 className="w-4 h-4 text-brand-blue" />
                <span>Basic Code Generation</span>
              </div>
            </div>

            <Button 
              onClick={() => setUpgradeClicked(true)}
              disabled={upgradeClicked}
              className="w-full bg-white text-black hover:bg-white/90 flex items-center justify-center gap-2 group transition-all"
            >
              {upgradeClicked ? (
                "Coming Soon!"
              ) : (
                <>
                  <Zap className="w-4 h-4 text-brand-blue group-hover:scale-110 transition-transform" />
                  Upgrade to Pro
                </>
              )}
            </Button>
            <p className="text-center text-xs text-white/40 mt-3">Starting at ₹149/mo</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
