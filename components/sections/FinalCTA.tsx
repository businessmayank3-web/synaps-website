"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "../ui/Button";
import { X } from "lucide-react";

export default function FinalCTA() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsContactModalOpen(false);
      setIsSubmitted(false);
    }, 2500);
  };

  return (
    <>
      <section className="py-32 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-blue/10" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-brand-blue/20 blur-[120px] rounded-full mix-blend-screen" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 text-glow">
              Ready to build <br/> the impossible?
            </h2>
            <p className="text-xl text-white/50 mb-12 max-w-xl mx-auto">
              Join thousands of visionary engineers building the next generation of software with Synapse.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/sign-in" className="w-full sm:w-auto">
                <Button size="lg" className="w-full shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                  Start Building Now
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => setIsContactModalOpen(true)}
                className="w-full sm:w-auto border-white/20 text-white bg-black/50 backdrop-blur-md"
              >
                Contact Sales
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Modal */}
      <AnimatePresence>
        {isContactModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsContactModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-black border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 md:p-8">
                <button 
                  onClick={() => setIsContactModalOpen(false)}
                  className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <h3 className="text-2xl font-bold mb-2">Get in Touch</h3>
                <p className="text-white/50 mb-6 text-sm">Fill out the form below and our team will get back to you shortly.</p>
                
                {isSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-12 text-center"
                  >
                    <div className="w-16 h-16 bg-brand-blue/20 text-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-medium mb-2">Message Sent!</h4>
                    <p className="text-white/50">We'll be in touch soon.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1">Name</label>
                      <input 
                        required 
                        type="text" 
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-blue transition-colors" 
                        placeholder="John Doe" 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">Email</label>
                        <input 
                          required 
                          type="email" 
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-blue transition-colors" 
                          placeholder="john@example.com" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">Phone</label>
                        <input 
                          required 
                          type="tel" 
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-blue transition-colors" 
                          placeholder="+1 (555) 000-0000" 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1">Reason for contacting</label>
                      <textarea 
                        required 
                        rows={4} 
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-blue transition-colors resize-none" 
                        placeholder="How can we help you today?" 
                      />
                    </div>
                    
                    <Button type="submit" className="w-full mt-2">
                      Send Message
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
