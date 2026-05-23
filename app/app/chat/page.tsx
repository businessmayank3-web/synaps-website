"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Sparkles, Maximize2, Minimize2, ImagePlus, X, Loader2, Mic, Plus, Code, Eye, Database } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import UpgradeModal from "@/components/ui/UpgradeModal";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
}

export default function ChatInterface() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMaximized, setIsMaximized] = useState(true);
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [selectedModel, setSelectedModel] = useState<"fast" | "pro">("fast");
  const [userData, setUserData] = useState<any>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("Upgrade to Synapse 2.0 Pro");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
          data.credits = 100000;
          data.fastUsageCount = 0;
        }
        setUserData(data);
      }
    });
    return () => unsubscribe();
  }, [user]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || loading || !user || !userData) return;
    
    // Credit / Limit Checks
    const isLocalhost = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

    if (selectedModel === "pro") {
      if (!isLocalhost && (userData.credits || 0) < 30) {
        setModalTitle("Out of Credits");
        setShowUpgradeModal(true);
        return;
      }
      // Deduct Credits
      if (!isLocalhost) {
        await updateDoc(doc(db, "users", user.uid), {
          credits: (userData.credits || 0) - 30
        });
      }
    } else {
      // Check Fast Limits
      if (!isLocalhost) {
        let newCount = userData.fastUsageCount || 0;
        const lastUsage = userData.lastFastUsageDate || 0;
        const now = new Date();
        const last = new Date(lastUsage);
        const nowOffset = new Date(now.getTime() - 4 * 60 * 60 * 1000);
        const lastOffset = new Date(last.getTime() - 4 * 60 * 60 * 1000);
        
        if (nowOffset.getDate() !== lastOffset.getDate() || nowOffset.getMonth() !== lastOffset.getMonth() || nowOffset.getFullYear() !== lastOffset.getFullYear()) {
          newCount = 0;
        }

        if (newCount >= 5) {
          alert("You have exceeded your daily limit for Synapse 2.0 Fast. Resets tomorrow at 4:00 AM.");
          return;
        }
        
        await updateDoc(doc(db, "users", user.uid), {
          fastUsageCount: newCount + 1,
          lastFastUsageDate: now.getTime()
        });
      }
    }

    setLoading(true);
    let imageUrl: string | undefined = undefined;

    // Upload image if selected
    if (selectedImage) {
      setUploadingImage(true);
      try {
        const storageRef = ref(storage, `chat_images/${user.uid}/${Date.now()}_${selectedImage.name}`);
        await uploadBytes(storageRef, selectedImage);
        imageUrl = await getDownloadURL(storageRef);
      } catch (error) {
        console.error("Error uploading chat image:", error);
        alert("Failed to upload image. Please check your connection.");
        setLoading(false);
        setUploadingImage(false);
        return;
      }
      setUploadingImage(false);
    }

    const userMsg: Message = { id: Date.now(), role: "user", content: input, imageUrl };
    const title = input.trim() 
      ? input.trim().substring(0, 30) + (input.length > 30 ? "..." : "") 
      : "Image Analysis";

    removeImage(); // Clear selection UI immediately

    try {
      const docRef = await addDoc(collection(db, "chats"), {
        userId: user.uid,
        title,
        modelTier: selectedModel,
        messages: [
          userMsg
        ],
        updatedAt: serverTimestamp()
      });

      router.push(`/app/chat/${docRef.id}`);
    } catch (error) {
      console.error("Error creating chat:", error);
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col transition-all duration-300 overflow-hidden ${
        isMaximized 
          ? "absolute inset-0 z-50 bg-[#020202] rounded-none border-0" 
          : "h-full max-w-4xl mx-auto glass-card border border-white/10 md:rounded-3xl relative w-full"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between z-10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-blue/20 flex items-center justify-center border border-brand-blue/30">
            <Sparkles className="w-5 h-5 text-brand-blue" />
          </div>
          <div>
            <h2 className="font-semibold text-sm flex items-center gap-2">
              Synapse AI Studio
              <span className="bg-white text-black text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Coming Soon</span>
            </h2>
            
            {/* Model Switcher */}
            <div className="flex items-center bg-[#0a0a0a] p-1 rounded-full border border-white/10 relative mt-1">
              <button 
                onClick={() => setSelectedModel("fast")}
                className={`relative px-3 py-1 rounded-full text-[10px] font-medium transition-colors z-10 ${selectedModel === "fast" ? "text-white" : "text-white/40 hover:text-white/80"}`}
              >
                {selectedModel === "fast" && (
                  <motion.div
                    layoutId="chat-model-bg"
                    className="absolute inset-0 bg-white/10 border border-white/10 rounded-full z-[-1]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                Fast
              </button>
              <button 
                onClick={() => setSelectedModel("pro")}
                className={`relative px-3 py-1 rounded-full text-[10px] font-medium transition-colors z-10 flex items-center gap-1 ${selectedModel === "pro" ? "text-white" : "text-white/40 hover:text-white/80"}`}
              >
                {selectedModel === "pro" && (
                  <motion.div
                    layoutId="chat-model-bg"
                    className="absolute inset-0 bg-purple-500/20 border border-purple-500/30 rounded-full z-[-1]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Sparkles className="w-2.5 h-2.5 text-purple-400" />
                Pro
              </button>
            </div>

          </div>
        </div>
        <button 
          onClick={() => setIsMaximized(!isMaximized)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
          title={isMaximized ? "Restore Window" : "Maximize Window"}
        >
          {isMaximized ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-6 z-10 custom-scrollbar bg-[#131314]">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-10">
          
          <div className="flex flex-col items-center gap-2 text-center">

            <div className="flex items-center gap-4">
              <h1 className="text-3xl md:text-4xl text-white font-medium tracking-wide">
                {"Build your ideas with Synapse 2.0".split(" ").map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (index + 2) * 0.1, duration: 0.7, type: "spring", bounce: 0.5 }}
                    className="inline-block mr-2"
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 8 * 0.1, duration: 0.8, type: "spring", bounce: 0.5 }}
              >
                <Sparkles className="w-10 h-10 text-white/20" strokeWidth={1} />
              </motion.div>
            </div>
          </div>

          <div className="w-full rounded-[24px] p-[1px] bg-gradient-to-r from-amber-500/40 via-red-500/40 to-blue-500/40 hover:from-amber-500/60 hover:via-red-500/60 hover:to-blue-500/60 transition-colors duration-500 relative group shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="bg-[#1e1e20] rounded-[23px] p-4 flex flex-col gap-4 min-h-[160px] relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Describe an app and let Synapse do the rest"
                className="w-full bg-transparent resize-none text-white focus:outline-none placeholder:text-white/40 text-base"
                rows={3}
              />
              
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/5 transition-colors" title="Use microphone">
                    <Mic className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/5 transition-colors" 
                    title="Upload file"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    hidden 
                    accept="image/*" 
                    onChange={handleImageSelect}
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  {imagePreview && (
                    <div className="relative inline-block">
                      <div className="w-10 h-10 rounded-lg border border-white/20 overflow-hidden bg-black/50">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <button 
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:scale-110 transition-transform shadow-lg"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <button 
                    onClick={handleSend}
                    disabled={loading || uploadingImage || (!input.trim() && !selectedImage)}
                    className="px-4 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-2 text-white hover:bg-white/10 transition-colors disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin text-brand-blue" /> : <Sparkles className="w-4 h-4 text-brand-blue fill-brand-blue" />}
                    <span className="text-sm font-medium">Generate</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full text-center mt-[-24px] mb-2 z-0 relative">
            <span className="text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase text-white/20 select-none">
              Coming Soon
            </span>
          </div>

          <div className="flex flex-wrap gap-3 w-full justify-center">
            <button 
              onClick={() => alert("Code generation features are currently in development and will be coming soon!")}
              className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-left group"
            >
              <Code className="w-4 h-4 text-green-400" />
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white/90 group-hover:text-white">Generate Code</span>
                <span className="text-[9px] uppercase tracking-wider bg-white/10 border border-white/20 text-white/60 px-1.5 py-0.5 rounded-md shadow-sm">Coming Soon</span>
              </div>
            </button>
            <button 
              onClick={() => alert("Vision Processing features are currently in development and will be coming soon!")}
              className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-left group"
            >
              <Eye className="w-4 h-4 text-brand-blue" />
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white/90 group-hover:text-white">Vision Processing</span>
                <span className="text-[9px] uppercase tracking-wider bg-white/10 border border-white/20 text-white/60 px-1.5 py-0.5 rounded-md shadow-sm">Coming Soon</span>
              </div>
            </button>
            <button 
              onClick={() => alert("Data Analysis features are currently in development and will be coming soon!")}
              className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-left group"
            >
              <Database className="w-4 h-4 text-purple-400" />
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white/90 group-hover:text-white">Analyze Data</span>
                <span className="text-[9px] uppercase tracking-wider bg-white/10 border border-white/20 text-white/60 px-1.5 py-0.5 rounded-md shadow-sm">Coming Soon</span>
              </div>
            </button>
          </div>
          
        </div>
      </div>
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)}
        title={modalTitle}
        description="Unlock the full potential of your AI workspace with Synapse 2.0 Pro."
      />
    </motion.div>
  );
}
