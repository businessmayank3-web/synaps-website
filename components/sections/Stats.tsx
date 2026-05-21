"use client";

import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const incrementTime = (duration / end);

      const timer = setInterval(() => {
        start += 1;
        setCurrent(start);
        if (start === end) clearInterval(timer);
      }, incrementTime);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return <span ref={ref}>{current}</span>;
}

export default function Stats() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-brand-blue/5 blur-3xl rounded-[100%]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {[
            { value: 99, label: "Uptime %", suffix: ".9" },
            { value: 40, label: "Data Centers", suffix: "+" },
            { value: 12, label: "PetaFLOPS", suffix: "k" },
            { value: 10, label: "Millisecond Latency", suffix: "ms", isReverse: true }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <h4 className="text-5xl md:text-7xl font-bold tracking-tighter mb-2 text-glow">
                {stat.isReverse ? "<" : ""}<AnimatedNumber value={stat.value} />{stat.suffix}
              </h4>
              <p className="text-sm md:text-base font-medium text-white/50 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
