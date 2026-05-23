"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, CheckCircle2 } from "lucide-react";

export default function InteractiveRating() {
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [rating, setRating] = useState<number>(0);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating > 0) {
      setSubmitted(true);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-24 mb-12 p-8 md:p-12 glass-card border border-white/10 rounded-3xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-blue/20 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center">
        <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 text-center">
          Love Synapse? Leave a Review!
        </h3>
        
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="rating-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center w-full"
            >
              <p className="text-white/60 mb-8 text-center max-w-md">
                Your feedback helps us build a better platform. Tap the stars below to rate your experience.
              </p>

              {/* Stars Container */}
              <div 
                className="flex gap-3 mb-8"
                onMouseLeave={() => setHoveredStar(0)}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    className="relative transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star 
                      className={`w-10 h-10 md:w-12 md:h-12 transition-all duration-300 ${
                        (hoveredStar || rating) >= star 
                          ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" 
                          : "fill-transparent text-white/20"
                      }`} 
                    />
                  </button>
                ))}
              </div>

              {/* Comment Box (Appears after a star is clicked) */}
              <AnimatePresence>
                {rating > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="w-full flex flex-col items-center overflow-hidden"
                  >
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Tell us what you loved..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 resize-none h-28 mb-6"
                    />
                    <button
                      onClick={handleSubmit}
                      className="bg-white text-black px-8 py-3 rounded-full font-semibold transition-all hover:scale-105 hover:bg-white/90"
                    >
                      Submit Review
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="thank-you"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="flex flex-col items-center justify-center py-10"
            >
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>
              <h4 className="text-3xl font-bold mb-3 text-center">Thank You!</h4>
              <p className="text-white/70 text-center text-lg max-w-sm">
                Thank you for giving us a brilliant {rating}-star rating! We truly appreciate your support. 🌟
              </p>
              
              <button
                onClick={() => {
                  setSubmitted(false);
                  setRating(0);
                  setComment("");
                }}
                className="mt-8 text-sm text-white/40 hover:text-white/80 transition-colors"
              >
                Submit another review
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
