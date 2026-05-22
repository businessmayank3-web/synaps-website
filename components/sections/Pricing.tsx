"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import { Check } from "lucide-react";

export default function Pricing() {
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: "Starter",
      price: annual ? "85" : "100",
      desc: "Perfect for indie hackers and small projects.",
      features: ["100k requests/mo", "Standard latency", "Community support"],
      highlight: false,
    },
    {
      name: "Team",
      price: annual ? "220" : "250",
      desc: "For scaling startups and professional teams.",
      features: ["1M requests/mo", "Ultra-low latency", "Priority 24/7 support", "Custom models"],
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "For massive scale and rigorous security needs.",
      features: ["Unlimited requests", "Dedicated infrastructure", "SLA guarantees", "On-premise option"],
      highlight: false,
    }
  ];

  return (
    <section id="pricing" className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">
            Simple, transparent pricing.
          </h2>
          
          <div className="inline-flex items-center bg-white/5 rounded-full p-1 border border-white/10">
            <button 
              onClick={() => setAnnual(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${!annual ? 'bg-white text-black' : 'text-white/50 hover:text-white'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setAnnual(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${annual ? 'bg-white text-black' : 'text-white/50 hover:text-white'}`}
            >
              Annually <span className="ml-1 text-[10px] uppercase text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded-full">Save 15%</span>
            </button>
          </div>

          <div className="mt-8 inline-block bg-gradient-to-r from-brand-blue/20 to-purple-500/20 border border-brand-blue/30 rounded-xl px-6 py-3">
            <p className="text-white text-sm font-medium">
              🎉 <span className="text-brand-blue font-bold">Special Offer:</span> Get 25% off your first order + 7 days free trial!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className={`glass-card rounded-3xl p-8 relative ${plan.highlight ? 'md:-mt-8 border-brand-blue/50 shadow-[0_0_40px_rgba(0,112,243,0.15)]' : ''}`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-blue text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
              <p className="text-white/50 text-sm mb-6 h-10">{plan.desc}</p>
              <div className="mb-8">
                <span className="text-5xl font-bold tracking-tighter">{plan.price !== "Custom" ? `₹${plan.price}` : plan.price}</span>
                {plan.price !== "Custom" && <span className="text-white/40">/mo</span>}
              </div>
              
              <Button 
                variant={plan.highlight ? "primary" : "glass"} 
                className="w-full mb-8"
              >
                {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
              </Button>
              
              <ul className="space-y-4">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex items-center text-sm text-white/80">
                    <Check className="w-4 h-4 mr-3 text-brand-blue" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
