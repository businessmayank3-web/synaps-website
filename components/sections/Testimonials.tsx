"use client";

import { useState } from "react";
import { TestimonialsColumn, type Testimonial } from "@/components/ui/testimonials-columns-1";
import { motion, AnimatePresence } from "framer-motion";
import { X, Quote } from "lucide-react";
import InteractiveRating from "./InteractiveRating";

const testimonials = [
  {
    text: "This ERP revolutionized our operations, streamlining finance and inventory. The cloud-based platform keeps us productive, even remotely.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Briana Patton",
    role: "Operations Manager",
  },
  {
    text: "Implementing this ERP was smooth and quick. The customizable, user-friendly interface made team training effortless.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "Bilal Ahmed",
    role: "IT Manager",
  },
  {
    text: "The support team is exceptional, guiding us through setup and providing ongoing assistance, ensuring our satisfaction.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Saman Malik",
    role: "Customer Support Lead",
  },
  {
    text: "This ERP's seamless integration enhanced our business operations and efficiency. Highly recommend for its intuitive interface.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    name: "Omar Raza",
    role: "CEO",
  },
  {
    text: "Its robust features and quick support have transformed our workflow, making us significantly more efficient.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    name: "Zainab Hussain",
    role: "Project Manager",
  },
  {
    text: "The smooth implementation exceeded expectations. It streamlined processes, improving overall business performance.",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    name: "Aliza Khan",
    role: "Business Analyst",
  },
  {
    text: "Our business functions improved with a user-friendly design and positive customer feedback.",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    name: "Farhan Siddiqui",
    role: "Marketing Director",
  },
  {
    text: "They delivered a solution that exceeded expectations, understanding our needs and enhancing our operations.",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    name: "Sana Sheikh",
    role: "Sales Manager",
  },
  {
    text: "Using this ERP, our online presence and conversions significantly improved, boosting business performance.",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    name: "Hassan Ali",
    role: "E-commerce Manager",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export default function Testimonials() {
  const [activeTestimonial, setActiveTestimonial] = useState<Testimonial | null>(null);
  return (
    <section className="py-32 relative overflow-hidden bg-black/40">
      <div className="absolute inset-0 bg-brand-blue/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="container z-10 mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto mb-20 relative z-10"
        >
          <div className="flex justify-center mb-6">
            <div className="border border-white/10 glass py-1.5 px-6 rounded-full text-sm font-medium text-white/80 tracking-wide">Testimonials</div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-center">
            What our users say.
          </h2>
          <p className="text-center mt-5 text-white/50 text-lg">
            See what our customers have to say about our revolutionary platform.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] max-h-[800px] overflow-hidden -mx-6 px-6 relative z-10">
          <TestimonialsColumn testimonials={firstColumn} duration={35} onTestimonialClick={setActiveTestimonial} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={45} onTestimonialClick={setActiveTestimonial} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={38} onTestimonialClick={setActiveTestimonial} />
        </div>
        
        {/* New Interactive Rating Section */}
        <InteractiveRating />
      </div>

      {/* Testimonial Modal */}
      <AnimatePresence>
        {activeTestimonial && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveTestimonial(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl glass-card rounded-3xl overflow-hidden border border-white/10 shadow-2xl p-8 md:p-12"
            >
              <div className="absolute top-8 left-8 text-white/5 pointer-events-none">
                <Quote className="w-24 h-24" />
              </div>
              
              <div className="relative z-10">
                <p className="text-xl md:text-2xl font-light leading-relaxed text-white/90 mb-10">
                  "{activeTestimonial.text}"
                </p>
                
                <div className="flex items-center gap-5">
                  <img
                    src={activeTestimonial.image}
                    alt={activeTestimonial.name}
                    className="h-16 w-16 rounded-full border border-white/20 shadow-lg object-cover"
                  />
                  <div className="flex flex-col">
                    <div className="font-semibold text-lg text-white">{activeTestimonial.name}</div>
                    <div className="text-brand-blue font-medium mt-0.5">{activeTestimonial.role}</div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setActiveTestimonial(null)}
                className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/20 rounded-full transition-colors text-white border border-white/10 z-20"
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
