"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Sparkles, Maximize2, Minimize2, Loader2, ImagePlus, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { db, storage } from "@/lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import UpgradeModal from "@/components/ui/UpgradeModal";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
}

export default function ChatSession() {
  const { chatId } = useParams();
  const { user } = useAuth();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, imagePreview]);

  // Load chat from Firestore
  useEffect(() => {
    const loadChat = async () => {
      if (!user || !chatId) return;
      try {
        const docRef = doc(db, "chats", chatId as string);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().userId === user.uid) {
          const data = docSnap.data();
          setMessages(data.messages || []);
          if (data.modelTier) {
            setSelectedModel(data.modelTier);
          }
        } else {
          router.push("/app/chat");
        }
      } catch (error) {
        console.error("Error loading chat:", error);
      } finally {
        setInitializing(false);
      }
    };
    loadChat();
  }, [user, chatId, router]);

  // Automatically trigger AI if the last message was from the user
  useEffect(() => {
    if (initializing || messages.length === 0 || loading) return;
    
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role === "user") {
      generateAIResponse(messages);
    }
  }, [messages, initializing]);

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

  const generateAIResponse = async (currentMessages: Message[]) => {
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: currentMessages, modelTier: selectedModel }),
      });

      if (!response.ok) throw new Error("Failed to get response");
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let text = "";

      const assistantMsgId = Date.now();
      
      // Initialize an empty message
      setMessages(prev => [...prev, { id: assistantMsgId, role: "assistant", content: "" }]);

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          text += decoder.decode(value, { stream: true });
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMsgId ? { ...msg, content: text } : msg
          ));
        }
      }

      // Save back to Firestore once stream is complete
      if (user && chatId) {
        const finalMessages = [...currentMessages, { id: assistantMsgId, role: "assistant" as const, content: text }];
        await updateDoc(doc(db, "chats", chatId as string), {
          messages: finalMessages,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: Message = { id: Date.now(), role: "assistant", content: "Sorry, I encountered an error. Please try again." };
      setMessages([...currentMessages, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || loading || !user || !chatId || !userData) return;
    
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

    const userMsg: Message = { id: Date.now(), role: "user", content: input };
    if (imageUrl) {
      userMsg.imageUrl = imageUrl;
    }
    const newMessages = [...messages, userMsg];
    
    setMessages(newMessages);
    setInput("");
    removeImage();
    
    // Save user message immediately before waiting for AI
    try {
      await updateDoc(doc(db, "chats", chatId as string), {
        messages: newMessages,
        modelTier: selectedModel,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating chat:", error);
    }
    // The useEffect will trigger generateAIResponse because the last message is now 'user'
  };

  if (initializing) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
      </div>
    );
  }

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
            <h2 className="font-semibold text-sm">Synapse Assistant</h2>
            
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

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain touch-pan-y p-6 space-y-6 z-10 custom-scrollbar">
        {messages.map((msg) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id}
            className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              msg.role === "user" ? "bg-white/10" : "bg-brand-blue/20 border border-brand-blue/30"
            }`}>
              {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-brand-blue" />}
            </div>
            <div className={`max-w-[80%] flex flex-col gap-2 ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}>
              {msg.imageUrl && (
                <div className="rounded-xl overflow-hidden border border-white/10 max-w-sm">
                  <img src={msg.imageUrl} alt="Uploaded content" className="w-full h-auto" />
                </div>
              )}
              {msg.content && (
                <div className={`rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                  msg.role === "user" 
                    ? "bg-white text-black rounded-tr-sm" 
                    : "bg-white/5 border border-white/10 rounded-tl-sm"
                }`}>
                  {msg.content}
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {(loading || uploadingImage) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-brand-blue" />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-4 text-sm leading-relaxed flex items-center gap-2">
              {uploadingImage ? (
                <span className="text-white/50 text-xs flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" /> Uploading image...
                </span>
              ) : (
                <>
                  <div className="w-2 h-2 bg-brand-blue rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-brand-blue rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-brand-blue rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </>
              )}
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/5 border-t border-white/10 z-10 backdrop-blur-md">
        
        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-3 relative inline-block">
            <div className="w-20 h-20 rounded-xl border border-white/20 overflow-hidden bg-black/50">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <button 
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:scale-110 transition-transform shadow-lg"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <div className="relative flex items-center gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            hidden 
            accept="image/*" 
            onChange={handleImageSelect}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            title="Upload Image"
          >
            <ImagePlus className="w-5 h-5" />
          </button>
          
          <div className="relative flex-1 flex items-center group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-blue to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message or upload an image..."
              className="relative w-full bg-[#050505] border border-white/10 rounded-2xl pl-4 pr-12 py-4 focus:outline-none focus:border-brand-blue/50 text-white transition-all text-sm"
            />
            <button
              onClick={handleSend}
              disabled={loading || uploadingImage || (!input.trim() && !selectedImage)}
              className="absolute right-2 p-2 bg-white text-black rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="text-center mt-3">
          <span className="text-[10px] text-white/30 uppercase tracking-widest">AI can make mistakes. Verify important info.</span>
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
