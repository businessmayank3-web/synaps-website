"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, MessageSquare, Settings, LogOut, Brain, Loader2, Plus, MessageCircle, Trash2, Menu, X, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import UpgradeModal from "@/components/ui/UpgradeModal";

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [chats, setChats] = useState<{ id: string; title: string }[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Global nag screen timer
  useEffect(() => {
    if (!user) return;
    
    // Set a timer for 35 minutes (35 * 60 * 1000 ms)
    const nagTimer = setInterval(() => {
      setShowUpgradeModal(true);
    }, 35 * 60 * 1000);

    return () => clearInterval(nagTimer);
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "chats"),
      where("userId", "==", user.uid)
    );

    const unsubscribeChats = onSnapshot(q, (snapshot) => {
      const chatData = snapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title || "New Chat",
        updatedAt: doc.data().updatedAt?.toMillis() || 0,
      }));
      
      // Sort in memory to avoid needing a Firestore composite index
      chatData.sort((a, b) => b.updatedAt - a.updatedAt);
      
      setChats(chatData);
    });

    return () => unsubscribeChats();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/"); // Redirect to hero section as requested
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSwitchAccount = async () => {
    try {
      await signOut(auth);
      router.push("/sign-in"); // Redirect to sign in page
    } catch (error) {
      console.error("Error switching account:", error);
    }
  };

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await deleteDoc(doc(db, "chats", chatId));
      
      // If we are currently on the chat that was deleted, go back to new chat page
      if (pathname === `/app/chat/${chatId}`) {
        router.push("/app/chat");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#020202]">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  const navItems = [
    { name: "Dashboard", href: "/app", icon: LayoutDashboard },
    { name: "Synapse AI Studio", href: "/app/chat", icon: MessageSquare },
    { name: "Settings", href: "/app/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#020202] text-white overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 border-r border-white/10 bg-[#050505] hidden md:flex flex-col z-20"
      >
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-brand-blue/20 flex items-center justify-center border border-brand-blue/30">
            <Brain className="w-5 h-5 text-brand-blue" />
          </div>
          <span className="font-bold text-lg tracking-tight">Synapse OS</span>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? "bg-white/10 text-white shadow-lg border border-white/10" 
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-brand-blue" : ""}`} />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}

          <div className="pt-6 mt-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-4 px-2">
              <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Recents</span>
              <Link href="/app/chat" className="p-1 hover:bg-white/10 rounded-md transition-colors text-white/70 hover:text-white" title="New Chat">
                <Plus className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-1">
              {chats.map((chat) => (
                <Link 
                  key={chat.id} 
                  href={`/app/chat/${chat.id}`}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-left group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <MessageCircle className="w-4 h-4 opacity-50 group-hover:opacity-100 shrink-0" />
                    <span className="truncate">{chat.title}</span>
                  </div>
                  <button 
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                    className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-all"
                    title="Delete Chat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </Link>
              ))}
              {chats.length === 0 && (
                <div className="px-4 py-2 text-xs text-white/30 text-center">
                  No recent chats
                </div>
              )}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <button 
            onClick={handleSwitchAccount}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
          >
            <Users className="w-5 h-5" />
            <span className="font-medium text-sm">Switch Account</span>
          </button>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-3/4 max-w-sm border-r border-white/10 bg-[#050505] flex flex-col z-50 md:hidden shadow-2xl"
            >
              <div className="p-6 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-blue/20 flex items-center justify-center border border-brand-blue/30">
                    <Brain className="w-5 h-5 text-brand-blue" />
                  </div>
                  <span className="font-bold text-lg tracking-tight">Synapse OS</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-white/50 hover:text-white rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link 
                      key={item.name} 
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive 
                          ? "bg-white/10 text-white shadow-lg border border-white/10" 
                          : "text-white/50 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${isActive ? "text-brand-blue" : ""}`} />
                      <span className="font-medium text-sm">{item.name}</span>
                    </Link>
                  );
                })}

                <div className="pt-6 mt-6 border-t border-white/10">
                  <div className="flex items-center justify-between mb-4 px-2">
                    <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Recents</span>
                    <Link href="/app/chat" onClick={() => setIsMobileMenuOpen(false)} className="p-1 hover:bg-white/10 rounded-md transition-colors text-white/70 hover:text-white" title="New Chat">
                      <Plus className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="space-y-1">
                    {chats.map((chat) => (
                      <Link 
                        key={chat.id} 
                        href={`/app/chat/${chat.id}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-left group"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <MessageCircle className="w-4 h-4 opacity-50 shrink-0" />
                          <span className="truncate">{chat.title}</span>
                        </div>
                      </Link>
                    ))}
                    {chats.length === 0 && (
                      <div className="px-4 py-2 text-xs text-white/30 text-center">
                        No recent chats
                      </div>
                    )}
                  </div>
                </div>
              </nav>

              <div className="p-4 border-t border-white/10 space-y-2">
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); handleSwitchAccount(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Users className="w-5 h-5" />
                  <span className="font-medium text-sm">Switch Account</span>
                </button>
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); handleSignOut(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium text-sm">Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-blue/10 blur-[120px] rounded-full pointer-events-none" />
        
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-[#050505] z-20">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-brand-blue" />
            <span className="font-bold">Synapse OS</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10">
          {children}
        </div>
        
        <UpgradeModal 
          isOpen={showUpgradeModal} 
          onClose={() => setShowUpgradeModal(false)} 
        />
      </main>
    </div>
  );
}
