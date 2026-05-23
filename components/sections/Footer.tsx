import { Brain } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#020202] pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 text-xl font-bold tracking-tighter mb-6">
              <Brain className="w-6 h-6" />
              <span>SYNAPSE</span>
            </div>
            <p className="text-white/40 text-sm max-w-xs">
              Designing the future of artificial intelligence. Minimal, powerful, and uncompromisingly fast.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><Link href="/info/features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/info/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
              <li><Link href="/info/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/info/changelog" className="hover:text-white transition-colors">Changelog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><Link href="/info/documentation" className="hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="/info/api-reference" className="hover:text-white transition-colors">API Reference</Link></li>
              <li><Link href="/info/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/info/community" className="hover:text-white transition-colors">Community</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><Link href="/info/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/info/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/info/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="/info/terms" className="hover:text-white transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-white/30">
          <div className="flex flex-col gap-2">
            <p>© 2026 Synapse Inc. All rights reserved.</p>
            <p className="uppercase tracking-widest text-[10px] text-white/50 font-medium mt-1">MAYANK TALREJA <span className="mx-2 opacity-50">|</span> FOUNDER & CEO</p>
          </div>
          <div className="flex space-x-6 mt-6 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
