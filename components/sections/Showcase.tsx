"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Showcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const showcases = [
    { id: 1, title: "Interface 1", desc: "Minimalistic approach", img: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=2070&auto=format&fit=crop" },
    { id: 2, title: "Interface 2", desc: "Fluid interactions", img: "https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=2000&auto=format&fit=crop" },
    { id: 3, title: "Interface 3", desc: "Data visualized", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" },
    { id: 4, title: "Interface 4", desc: "Uncompromising speed", img: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2000&auto=format&fit=crop" },
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
            className="relative w-[70vw] md:w-[40vw] h-full shrink-0 rounded-3xl overflow-hidden bg-white/5 border border-white/10 group"
          >
            <img 
              src={item.img} 
              alt={item.title} 
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
            <div className="absolute bottom-8 left-8 z-10">
              <p className="text-white font-medium text-2xl mb-1">{item.title}</p>
              <p className="text-white/70 text-base">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
