"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "./Button";
import { Brain } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/app")) return null;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-4" : "py-6"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xl font-bold tracking-tighter">
          <Brain className="w-6 h-6" />
          <span>SYNAPSE</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#showcase" className="hover:text-white transition-colors">Showcase</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="glass" size="sm" className="hidden md:flex">Sign In</Button>
          <Button size="sm">Get Started</Button>
        </div>
      </div>
    </motion.header>
  );
}
