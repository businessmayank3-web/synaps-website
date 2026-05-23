"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";

export default function Showcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeShowcase, setActiveShowcase] = useState<any>(null);

  const showcases = [
    { 
      id: 1, 
      title: "Conversational AI", 
      desc: "Minimalistic, lightning-fast chat", 
      img: "/chat_interface_dark.png",
      details: "Experience our next-generation conversational interface. Designed from the ground up to reduce cognitive load, it features distraction-free typography, intelligent contextual memory, and sub-50ms response times. It's not just a chat box—it's your new primary workspace."
    },
    { 
      id: 2, 
      title: "Data Analytics", 
      desc: "Real-time visualized insights", 
      img: "/data_dashboard.png",
      details: "Stop guessing and start knowing. Our upcoming data analytics dashboard translates billions of data points into beautiful, actionable visualizations in real-time. With interactive glass panels and predictive trends, you'll see the future of your business before it happens."
    },
    { 
      id: 3, 
      title: "Computer Vision", 
      desc: "Pixel-perfect image analysis", 
      img: "/vision_analysis.png",
      details: "Give your AI the gift of sight. The new vision analysis interface allows you to upload any image, diagram, or code snippet. Our neural network will instantly identify objects, read text, and provide pixel-perfect bounding box analysis directly within your browser."
    },
    { 
      id: 4, 
      title: "System Preferences", 
      desc: "Granular user control", 
      img: "/settings_panel.png",
      details: "Take total control of your experience. The redesigned system preferences panel offers granular control over your AI's behavior, API integrations, and security settings. Packaged in a stunning, translucent glassmorphic UI that feels as premium as the features it controls."
    },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (containerRef.current && sectionRef.current) {
        gsap.to(containerRef.current, {
          x: () => -(containerRef.current!.scrollWidth - window.innerWidth + 64),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${containerRef.current!.scrollWidth}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="showcase" className="h-screen flex items-center bg-black overflow-hidden relative">
      <div className="absolute top-12 left-12 md:top-24 md:left-24 z-10">
        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mix-blend-difference text-white">
          A visual <br/>masterpiece.
        </h2>
      </div>

      <div ref={containerRef} className="flex gap-8 px-12 md:px-24 mt-32 h-[50vh] md:h-[60vh] items-center whitespace-nowrap">
        {showcases.map((item) => (
          <div 
            key={item.id} 
            onClick={() => setActiveShowcase(item)}
            className="relative w-[70vw] md:w-[40vw] h-full shrink-0 rounded-3xl overflow-hidden bg-white/5 border border-white/10 group cursor-pointer"
          >
            <img 
              src={item.img} 
              alt={item.title} 
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
            
            {/* Upcoming Badge */}
            <div className="absolute top-6 right-6 z-20 px-4 py-1.5 rounded-full bg-white text-black shadow-xl">
              <span className="text-xs font-bold uppercase tracking-widest">Upcoming</span>
            </div>

            <div className="absolute bottom-8 left-8 z-10 flex flex-col justify-end">
              <p className="text-white font-medium text-2xl mb-1 flex items-center gap-3">
                {item.title}
                <span className="text-xs font-semibold px-2 py-1 bg-white/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">Learn More</span>
              </p>
              <p className="text-white/70 text-base">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Showcase Details Modal */}
      <AnimatePresence>
        {activeShowcase && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveShowcase(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl glass-card rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row"
            >
              {/* Image Side */}
              <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                <img src={activeShowcase.img} alt={activeShowcase.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#050505] hidden md:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent md:hidden" />
              </div>

              {/* Content Side */}
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-[#050505]">
                <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full glass border border-brand-blue/30 text-xs font-medium text-brand-blue">
                  <Sparkles className="w-3 h-3" /> Upcoming Feature
                </div>
                <h3 className="text-3xl font-bold mb-4 text-white">{activeShowcase.title}</h3>
                <p className="text-white/70 text-lg leading-relaxed mb-8">
                  {activeShowcase.details}
                </p>
                <button 
                  onClick={() => setActiveShowcase(null)}
                  className="w-full py-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors font-medium text-white border border-white/5"
                >
                  Close Preview
                </button>
              </div>

              <button 
                onClick={() => setActiveShowcase(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-white/20 rounded-full transition-colors text-white z-20"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
