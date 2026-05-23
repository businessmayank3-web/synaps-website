"use client"

import * as React from "react"
import { useState } from "react";
import { LogIn, Lock, Mail, Loader2, UserPlus, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface SignInProps {
  defaultIsSignUp?: boolean;
}

const SignIn2 = ({ defaultIsSignUp = false }: SignInProps) => {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(defaultIsSignUp);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAuth = async () => {
    if (isSignUp && !agreedToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy to create an account.");
      return;
    }
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push("/app");
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isSignUp && !agreedToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy to create an account.");
      return;
    }
    setError("");
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/app");
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020202] z-10 p-4">
      <div className="w-full max-w-sm glass-card rounded-3xl p-8 flex flex-col items-center border border-white/10 text-white relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 inset-x-0 h-32 bg-brand-blue/10 blur-[50px] rounded-full pointer-events-none" />
        
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 mb-6 border border-white/10 relative z-10 shadow-lg">
          {isSignUp ? <UserPlus className="w-6 h-6 text-white" /> : <LogIn className="w-6 h-6 text-white" />}
        </div>
        <h2 className="text-2xl font-bold mb-2 text-center tracking-tight relative z-10">
          {isSignUp ? "Create an account" : "Welcome back"}
        </h2>
        <p className="text-white/50 text-sm mb-8 text-center relative z-10 leading-relaxed">
          {isSignUp ? "Sign up for Synapse OS to start" : "Sign in to Synapse OS to continue"} <br/> your journey.
        </p>
        <div className="w-full flex flex-col gap-4 mb-2 relative z-10">
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors">
              <Mail className="w-4 h-4" />
            </span>
            <input
              placeholder="Email address"
              type="email"
              value={email}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-white/30 focus:bg-white/10 bg-white/5 text-white text-sm transition-all"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors">
              <Lock className="w-4 h-4" />
            </span>
            <input
              placeholder="Password"
              type="password"
              value={password}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-white/30 focus:bg-white/10 bg-white/5 text-white text-sm transition-all"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="w-full flex justify-between items-center mt-1 h-4">
            {error ? (
              <div className="text-xs text-red-400 text-left w-full">{error}</div>
            ) : <div />}
            {!isSignUp && !error && (
              <button className="text-xs text-white/50 hover:text-white transition-colors font-medium ml-auto">
                Forgot password?
              </button>
            )}
          </div>
          
          {isSignUp && (
            <div className="flex items-start gap-3 mt-4 relative z-10">
              <button
                type="button"
                onClick={() => {
                  setAgreedToTerms(!agreedToTerms);
                  setError(""); // Clear error when interacting
                }}
                className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors mt-0.5 ${agreedToTerms ? 'bg-brand-blue border-brand-blue text-white' : 'border-white/20 bg-white/5 hover:border-white/40'}`}
              >
                {agreedToTerms && <Check className="w-3.5 h-3.5" />}
              </button>
              <p className="text-xs text-white/60 leading-relaxed text-left">
                I agree to the <Link href="/info/terms" className="text-brand-blue hover:text-brand-blue/80 underline underline-offset-2">Terms of Service</Link> and <Link href="/info/privacy" className="text-brand-blue hover:text-brand-blue/80 underline underline-offset-2">Privacy Policy</Link>.
              </p>
            </div>
          )}
        </div>
        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full bg-white text-black font-semibold py-3 rounded-xl shadow-lg hover:bg-white/90 hover:scale-[1.02] transition-all mb-4 mt-6 relative z-10 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>
        
        <div className="w-full text-center relative z-10 mb-6">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-white/50 hover:text-white transition-colors"
          >
            {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
          </button>
        </div>
        <div className="flex items-center w-full mb-6 relative z-10">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="mx-4 text-xs text-white/40 uppercase tracking-widest">Or</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>
        <div className="flex gap-3 w-full justify-center relative z-10">
          <button 
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="flex items-center justify-center w-12 h-12 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition grow disabled:opacity-50"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5 opacity-90 hover:opacity-100 transition-opacity"
            />
          </button>
          <button className="flex items-center justify-center w-12 h-12 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition grow">
            <img
              src="https://www.svgrepo.com/show/448224/facebook.svg"
              alt="Facebook"
              className="w-5 h-5 opacity-90 hover:opacity-100 transition-opacity"
            />
          </button>
          <button className="flex items-center justify-center w-12 h-12 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition grow">
            <img
              src="https://www.svgrepo.com/show/511330/apple-173.svg"
              alt="Apple"
              className="w-5 h-5 opacity-90 hover:opacity-100 transition-opacity filter invert"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export { SignIn2 };
