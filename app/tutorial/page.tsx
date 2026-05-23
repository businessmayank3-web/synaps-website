"use client";

import { motion } from "framer-motion";
import { Sparkles, Brain, Cloud, Maximize2, ArrowRight, ImagePlus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function TutorialPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-background text-white pt-32 pb-24 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-blue/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full glass border-white/10 text-sm font-medium text-brand-blue">
            <Sparkles className="w-4 h-4" /> Mastery Guide
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-glow leading-tight">
            How to Use Synapse OS <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-purple-400">
              Effectively.
            </span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
            Synapse OS isn't just a chatbot. It's a powerful AI architecture connected directly to the cloud. Here is how to unlock its full potential.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-16 md:space-y-32"
        >

          {/* 1. Vision Architecture */}
          <motion.div variants={item} className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 glass-card rounded-3xl p-8 border border-white/10 bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden group">
              <div className="absolute inset-0 bg-brand-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-brand-blue/20 flex items-center justify-center border border-brand-blue/30 mb-8">
                  <ImagePlus className="w-8 h-8 text-brand-blue" />
                </div>
                <div className="space-y-4">
                  <div className="flex gap-4 items-end">
                    <div className="w-10 h-10 rounded-xl bg-white/10 overflow-hidden border border-white/20">
                      <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&q=80" alt="Code snippet" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-white text-black px-4 py-2 rounded-2xl rounded-bl-sm text-sm font-medium">
                      Find the bug in this code.
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center shrink-0">
                      <Brain className="w-4 h-4 text-brand-blue" />
                    </div>
                    <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-sm text-sm text-white/80">
                      I see the issue. On line 42, you have a syntax error...
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Give your AI the gift of sight.</h2>
              <p className="text-white/60 leading-relaxed mb-6">
                Synapse OS is powered by Google's latest Gemini Vision architecture. Click the image upload icon next to the chat bar to share screenshots, code snippets, diagrams, or real-world photos. The AI will instantly analyze every pixel.
              </p>
              <ul className="space-y-3 text-sm text-white/70">
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-blue" /> Upload code screenshots for instant debugging</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-blue" /> Share charts for data analysis</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-blue" /> Take photos of real-world objects for identification</li>
              </ul>
            </div>
          </motion.div>

          {/* 2. Cloud Sync */}
          <motion.div variants={item} className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Never lose a great idea.</h2>
              <p className="text-white/60 leading-relaxed mb-6">
                Synapse OS is directly integrated with Firebase's ultra-fast Firestore database. Every message, image, and chat session is securely synchronized to the cloud in real-time.
              </p>
              <ul className="space-y-3 text-sm text-white/70">
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-purple-400" /> Start on your laptop, finish on your phone</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-purple-400" /> Chat history is instantly accessible in the sidebar</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-purple-400" /> Secure user authentication protects your data</li>
              </ul>
            </div>
            <div className="glass-card rounded-3xl p-8 border border-white/10 bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden group">
              <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex flex-col items-center justify-center py-8">
                <Cloud className="w-16 h-16 text-purple-400 mb-6 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                <div className="flex gap-4">
                  <div className="h-2 w-16 bg-white/20 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="w-full h-full bg-purple-400" 
                    />
                  </div>
                  <div className="h-2 w-16 bg-white/20 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
                      className="w-full h-full bg-brand-blue" 
                    />
                  </div>
                </div>
                <p className="text-sm font-medium mt-6 text-white/80">Real-time Data Sync Active</p>
              </div>
            </div>
          </motion.div>

          {/* 3. Immersive UI */}
          <motion.div variants={item} className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 glass-card rounded-3xl p-8 border border-white/10 bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden group flex items-center justify-center min-h-[300px]">
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md z-10"
              >
                <Maximize2 className="w-10 h-10 text-white" />
              </motion.div>
              
              {/* Fake UI framing */}
              <div className="absolute inset-4 border border-white/10 rounded-2xl border-dashed opacity-30" />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Focus mode activated.</h2>
              <p className="text-white/60 leading-relaxed mb-6">
                Deep work requires deep focus. The Synapse OS interface is designed with a distraction-free "Maximize" toggle. 
              </p>
              <p className="text-white/60 leading-relaxed mb-6">
                Click the maximize icon in the top right corner of any chat to expand the conversation to full-screen. The sidebar vanishes, the noise fades away, and it's just you and the AI architecture.
              </p>
            </div>
          </motion.div>

        </motion.div>

        {/* Final CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-32 text-center"
        >
          <div className="glass-card max-w-3xl mx-auto rounded-3xl p-12 border border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/20 to-purple-500/20 mix-blend-overlay" />
            <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Ready to accelerate?</h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto relative z-10">
              Stop watching the demo and start experiencing the power of Synapse OS yourself. Sign up for free in less than 10 seconds.
            </p>
            <Link href="/sign-up" className="relative z-10 inline-block">
              <Button size="lg" className="w-full sm:w-auto px-8 group">
                Create Account <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
