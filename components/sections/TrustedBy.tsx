export default function TrustedBy() {
  const logos = [
    "ACME Corp", "GlobalTech", "Nexus", "Quantum", "Synergy", "Apex", "Nova", "Zenith"
  ];

  return (
    <section className="py-24 border-y border-white/5 bg-white/[0.02] overflow-hidden">
      <div className="container mx-auto px-6 text-center mb-12">
        <p className="text-sm font-medium tracking-widest text-white/40 uppercase">
          Trusted by innovative teams worldwide
        </p>
      </div>
      
      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee flex whitespace-nowrap">
          {[...logos, ...logos].map((logo, i) => (
            <span 
              key={i} 
              className="mx-12 text-2xl font-bold text-white/20 hover:text-white/40 transition-colors cursor-default"
            >
              {logo}
            </span>
          ))}
        </div>
        <div className="absolute top-0 animate-marquee flex whitespace-nowrap" aria-hidden="true" style={{ transform: 'translateX(100%)' }}>
          {[...logos, ...logos].map((logo, i) => (
            <span 
              key={i} 
              className="mx-12 text-2xl font-bold text-white/20 hover:text-white/40 transition-colors cursor-default"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
