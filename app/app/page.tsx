"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Sparkles, Code, Database, Image as ImageIcon, PenTool, Terminal, Clock, ArrowRight, Activity, Coins } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, onSnapshot, addDoc, collection, serverTimestamp } from "firebase/firestore";
import UpgradeModal from "@/components/ui/UpgradeModal";
import { useRouter } from "next/navigation";

interface DashboardData {
  activities: Array<{ title: string; time: string }>;
  credits?: number;
  lastClaimedDate?: number;
  fastUsageCount?: number;
  lastFastUsageDate?: number;
}

const defaultData: DashboardData = {
  activities: [
    { title: "Chat: Brainstorming marketing strategies", time: "12 mins ago" },
    { title: "Chat: Debugging React hydration error", time: "2 hours ago" },
    { title: "Chat: Analyzing financial Q3 spreadsheet", time: "3 hours ago" },
    { title: "Chat: Writing a python web scraper", time: "5 hours ago" },
    { title: "Chat: Explaining quantum computing", time: "1 day ago" },
    { title: "Chat: Summarizing PDF document", time: "1 day ago" }
  ],
  credits: 100, // Initial signup bonus
  fastUsageCount: 0,
};

const quickActions = [
  { id: "code", title: "Generate Code", description: "Build full-stack applications", icon: Code, color: "text-blue-400", type: "pro", comingSoon: true },
  { id: "data", title: "Analyze Data", description: "Process large CSV/JSON datasets", icon: Database, color: "text-purple-400", type: "pro", comingSoon: true },
  { id: "vision", title: "Vision Processing", description: "Extract data from images", icon: ImageIcon, color: "text-emerald-400", type: "pro", comingSoon: true },
  { id: "creative", title: "Creative Writing", description: "Draft copy and blog posts", icon: PenTool, color: "text-orange-400", type: "fast" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("Upgrade to Synapse 2.0 Pro");
  const [modalDescription, setModalDescription] = useState("Unlock the full potential of your AI workspace.");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<"fast" | "pro">("fast");
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    const userDocRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userDocRef, async (docSnap) => {
      if (docSnap.exists()) {
        const docData = docSnap.data() as DashboardData;
        // Initialize credits for old accounts
        if (docData.credits === undefined) {
          docData.credits = 100;
          await setDoc(userDocRef, docData, { merge: true });
        }
        setData(docData);
        setLoading(false);
      } else {
        await setDoc(userDocRef, defaultData);
        setData(defaultData);
        setLoading(false);
      }
    }, (error) => {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  const currentData = (data && data.activities) ? data : defaultData;
  const isLocalhost = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
  const credits = isLocalhost ? 100000 : (currentData.credits ?? 100);
  
  // Daily Claim Logic
  const canClaimDaily = () => {
    const lastClaimed = currentData.lastClaimedDate || 0;
    const now = new Date().getTime();
    return (now - lastClaimed) >= 24 * 60 * 60 * 1000;
  };

  const handleClaim = async () => {
    if (!canClaimDaily()) return;
    
    await setDoc(doc(db, "users", user.uid), {
      ...currentData,
      credits: credits + 50,
      lastClaimedDate: new Date().getTime()
    }, { merge: true });
  };

  // Action Click Handler
  const handleActionClick = async (action: any) => {
    setActionLoading(action.id);
    
    try {
      if (action.comingSoon) {
        setActionLoading(null);
        return; // Do nothing, visual watermark handles it
      }
      
      // If it's a creative writing action, just prefill the prompt and let the user continue
      if (action.id === "creative") {
        setPrompt("I want to write creative writing ");
        setActionLoading(null);
        
        // Focus the textarea
        setTimeout(() => {
          const textarea = document.querySelector('textarea');
          if (textarea) {
            textarea.focus();
            // Move cursor to end
            textarea.setSelectionRange(textarea.value.length, textarea.value.length);
          }
        }, 10);
        return;
      }
      
      let canProceed = false;
      
      if (action.type === "pro") {
        if (!isLocalhost && credits < 30) {
          setModalTitle("Out of Credits");
          setModalDescription(`You need 30 credits to use ${action.title}. Upgrade to Pro for unlimited access.`);
          setShowUpgradeModal(true);
        } else {
          // Deduct 30 credits
          if (!isLocalhost) {
            await setDoc(doc(db, "users", user.uid), {
              ...currentData,
              credits: credits - 30
            }, { merge: true });
          }
          
          // Simulate action success
          alert(`Successfully executed ${action.title} (-30 Credits)`);
        }
      } else if (action.type === "fast") {
        // Handle 4 AM reset logic
        let newCount = currentData.fastUsageCount || 0;
        const lastUsage = currentData.lastFastUsageDate || 0;
        
        const now = new Date();
        const last = new Date(lastUsage);
        
        // Subtract 4 hours from both dates to check if a 4 AM boundary was crossed
        const nowOffset = new Date(now.getTime() - 4 * 60 * 60 * 1000);
        const lastOffset = new Date(last.getTime() - 4 * 60 * 60 * 1000);
        
        if (nowOffset.getDate() !== lastOffset.getDate() || nowOffset.getMonth() !== lastOffset.getMonth() || nowOffset.getFullYear() !== lastOffset.getFullYear()) {
          newCount = 0; // Reset
        }

        if (newCount >= 5 && !isLocalhost) {
          alert("You have exceeded your daily limit for Creative Writing. Resets tomorrow at 4:00 AM.");
        } else {
          if (!isLocalhost) {
            await setDoc(doc(db, "users", user.uid), {
              ...currentData,
              fastUsageCount: newCount + 1,
              lastFastUsageDate: now.getTime()
            }, { merge: true });
          }
          
          alert(`Synapse 2.0 Fast used successfully for ${action.title} (Usage: ${newCount + 1}/5)`);
        }
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handlePromptSubmit = async () => {
    if (!prompt.trim() || actionLoading === "prompt") return;
    
    setActionLoading("prompt");
    try {
      let canProceed = false;

      if (selectedModel === "pro") {
        if (!isLocalhost && credits < 30) {
          setModalTitle("Out of Credits");
          setModalDescription("You need 30 credits to use Synapse 2.0 Pro. Upgrade to a Pro subscription for unlimited access.");
          setShowUpgradeModal(true);
        } else {
          if (!isLocalhost) {
            await setDoc(doc(db, "users", user!.uid), {
              ...currentData,
              credits: credits - 30
            }, { merge: true });
          }
          canProceed = true;
        }
      } else {
        // Fast Model
        let newCount = currentData.fastUsageCount || 0;
        const lastUsage = currentData.lastFastUsageDate || 0;
        const now = new Date();
        const last = new Date(lastUsage);
        const nowOffset = new Date(now.getTime() - 4 * 60 * 60 * 1000);
        const lastOffset = new Date(last.getTime() - 4 * 60 * 60 * 1000);
        
        if (nowOffset.getDate() !== lastOffset.getDate() || nowOffset.getMonth() !== lastOffset.getMonth() || nowOffset.getFullYear() !== lastOffset.getFullYear()) {
          newCount = 0;
        }

        if (newCount >= 5 && !isLocalhost) {
          alert("You have exceeded your daily limit for Synapse 2.0 Fast. Resets tomorrow at 4:00 AM.");
        } else {
          if (!isLocalhost) {
            await setDoc(doc(db, "users", user!.uid), {
              ...currentData,
              fastUsageCount: newCount + 1,
              lastFastUsageDate: now.getTime()
            }, { merge: true });
          }
          canProceed = true;
        }
      }

      if (canProceed) {
        // Create new chat and redirect
        const title = prompt.trim() 
          ? prompt.trim().substring(0, 30) + (prompt.length > 30 ? "..." : "") 
          : "Let's start a new project.";
        
        const docRef = await addDoc(collection(db, "chats"), {
          userId: user!.uid,
          title,
          modelTier: selectedModel,
          messages: [
            {
              id: 1,
              role: "assistant",
              content: `Welcome to Synapse AI Studio 2.0 ${selectedModel === "pro" ? "Pro" : "Fast"}. Build your ideas with Synapse.`,
            },
            {
              id: Date.now(),
              role: "user",
              content: prompt.trim() || "Let's start a new project."
            }
          ],
          updatedAt: serverTimestamp()
        });

        router.push(`/app/chat/${docRef.id}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 pt-4 px-4 sm:px-0">
      {/* Top Navigation & Status Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center justify-between bg-[#050505]/80 border border-white/10 rounded-3xl p-4 backdrop-blur-xl shadow-2xl gap-4 md:gap-0"
      >
        <div className="flex items-center gap-4 w-full md:w-auto px-2">
          <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center border border-brand-blue/20 shrink-0">
            <Terminal className="w-5 h-5 text-brand-blue" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white/90">Synapse OS</h2>
            <div className="hidden sm:flex items-center bg-[#0a0a0a] p-1 rounded-full border border-white/10 relative">
            <button 
              onClick={() => setSelectedModel("fast")}
              className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-colors z-10 ${selectedModel === "fast" ? "text-white" : "text-white/40 hover:text-white/80"}`}
            >
              {selectedModel === "fast" && (
                <motion.div
                  layoutId="active-model-bg"
                  className="absolute inset-0 bg-white/10 border border-white/10 rounded-full z-[-1]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              Synapse 2.0 Fast
            </button>
            <button 
              onClick={() => setSelectedModel("pro")}
              className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-colors z-10 flex items-center gap-1.5 ${selectedModel === "pro" ? "text-white" : "text-white/40 hover:text-white/80"}`}
            >
              {selectedModel === "pro" && (
                <motion.div
                  layoutId="active-model-bg"
                  className="absolute inset-0 bg-purple-500/20 border border-purple-500/30 rounded-full z-[-1]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Sparkles className="w-3 h-3 text-purple-400" />
              Synapse 2.0 Pro
            </button>
          </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Credits Display */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-[#1a1a1a] to-[#0a0a0a] border border-white/10 px-4 py-2 rounded-xl shadow-inner w-full sm:w-auto justify-center">
            <Coins className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-bold text-white tracking-wide">{credits} Credits</span>
          </div>

          {/* Claim Button */}
          <button 
            onClick={handleClaim}
            disabled={!canClaimDaily()}
            className={`w-full sm:w-auto px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              canClaimDaily() 
                ? "bg-brand-blue/20 text-brand-blue hover:bg-brand-blue hover:text-white border border-brand-blue/30 hover:shadow-[0_0_15px_rgba(0,112,243,0.4)] cursor-pointer" 
                : "bg-white/5 text-white/30 border border-white/5 cursor-not-allowed"
            }`}
          >
            {canClaimDaily() ? "Claim Daily 50" : "Come back tomorrow"}
          </button>
        </div>
      </motion.div>

      {/* Omnibar / Greeting */}
      <div className="text-center space-y-8 pt-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Welcome back, <span className="text-brand-blue">{user.displayName?.split(' ')[0] || 'User'}</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Your personal AI workspace is ready. What do you want to build today?
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative max-w-3xl mx-auto group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-blue to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex items-center bg-[#0a0a0a] border border-white/20 rounded-2xl p-2 shadow-2xl hover:border-brand-blue/50 transition-colors cursor-text group">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handlePromptSubmit();
              }}
              placeholder="Ask Synapse anything or start a new project..."
              className="flex-1 bg-transparent border-none text-white px-4 py-4 focus:outline-none focus:ring-0 placeholder:text-white/30 text-lg cursor-text"
            />
            <button 
              onClick={handlePromptSubmit}
              disabled={actionLoading === "prompt"}
              className="bg-white text-black p-4 rounded-xl hover:bg-white/90 transition-all hover:scale-105 shadow-lg flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] disabled:opacity-50"
            >
              {actionLoading === "prompt" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4 pt-8">
        <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider px-2">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.title}
              onClick={() => handleActionClick(action)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className="glass-card p-5 rounded-2xl border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-white/5 border border-white/10 w-fit ${action.color} group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-5 h-5" />
                </div>
                {action.comingSoon && (
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] bg-white text-black px-2 py-1 rounded-md mt-1 shadow-sm">
                    Coming Soon
                  </span>
                )}
              </div>
              <h4 className="font-semibold text-white mb-1 group-hover:text-brand-blue transition-colors">{action.title}</h4>
              <p className="text-xs text-white/50 mb-4">{action.description}</p>
              
              <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
              <div className="flex items-center gap-1 mt-auto">
                {action.type === "pro" ? (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20">
                    Pro (30 Credits)
                  </span>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Free Limit
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Workspaces Grid */}
      <div className="space-y-4 pt-8">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider">Recent Workspaces</h3>
          <button className="text-xs text-brand-blue hover:text-white transition-colors flex items-center gap-1">
            View All <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentData.activities.slice(0, 6).map((activity, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + (i * 0.05) }}
              className="glass-card p-5 rounded-2xl border border-white/10 hover:border-brand-blue/30 transition-all cursor-pointer group flex flex-col justify-between min-h-[140px] bg-gradient-to-b from-transparent to-white/[0.02]"
            >
              <p className="text-sm font-medium text-white/90 leading-relaxed group-hover:text-white transition-colors">
                {activity.title}
              </p>
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-white/30" />
                  <p className="text-xs text-white/40">{activity.time}</p>
                </div>
                <div className="w-6 h-6 rounded-full bg-brand-blue/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-3 h-3 text-brand-blue" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)}
        title={modalTitle}
        description={modalDescription}
      />
    </div>
  );
}
