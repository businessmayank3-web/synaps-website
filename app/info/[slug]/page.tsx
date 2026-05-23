import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, Code, Shield, Users, Zap, Box, Globe, BookOpen } from "lucide-react";

const pageContent: Record<string, { title: string, icon: any, content: React.ReactNode }> = {
  "features": {
    title: "Features",
    icon: <Zap className="w-6 h-6" />,
    content: (
      <div className="space-y-6 text-white/70">
        <p>Synapse OS is built from the ground up to be the most advanced AI interface available. Our feature set is continuously expanding to meet the needs of power users and enterprise teams.</p>
        <h3 className="text-xl font-bold text-white mt-8 mb-4">Core Capabilities</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Neural Processing:</strong> Advanced edge-computing matrix multiplications for instantaneous responses.</li>
          <li><strong>Computer Vision:</strong> Pixel-perfect image analysis powered by Gemini 1.5.</li>
          <li><strong>Real-time Cloud Sync:</strong> Instant cross-device synchronization via Firebase Firestore.</li>
          <li><strong>Immersive Mode:</strong> Distraction-free, maximized window environment for deep work.</li>
        </ul>
      </div>
    )
  },
  "integrations": {
    title: "Integrations",
    icon: <Box className="w-6 h-6" />,
    content: (
      <div className="space-y-6 text-white/70">
        <p>Connect Synapse OS with the tools you already use every day.</p>
        <div className="p-6 bg-brand-blue/10 border border-brand-blue/30 rounded-2xl">
          <p className="text-brand-blue font-medium">Integration marketplace is launching in Q4 2026.</p>
          <p className="text-sm mt-2">Upcoming integrations include GitHub, Slack, Notion, Jira, and Google Workspace.</p>
        </div>
      </div>
    )
  },
  "pricing": {
    title: "Pricing details",
    icon: <Globe className="w-6 h-6" />,
    content: (
      <div className="space-y-6 text-white/70">
        <p>Our pricing philosophy is simple: you only pay for what you use, and you get enterprise-grade security at every tier.</p>
        <p>Please visit our home page to view the current subscription tiers, including our Starter, Team, and Enterprise plans.</p>
      </div>
    )
  },
  "changelog": {
    title: "Changelog",
    icon: <FileText className="w-6 h-6" />,
    content: (
      <div className="space-y-8 text-white/70">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">v2.0.0 - Synapse OS Beta</h3>
          <p className="text-sm text-brand-blue mb-4">Released May 2026</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Introduced glassmorphic dark-mode UI.</li>
            <li>Added Gemini 1.5 Vision integration for image analysis.</li>
            <li>Implemented real-time Firebase cloud sync.</li>
            <li>Launched AI Customer Support widget.</li>
          </ul>
        </div>
      </div>
    )
  },
  "documentation": {
    title: "Documentation",
    icon: <BookOpen className="w-6 h-6" />,
    content: (
      <div className="space-y-6 text-white/70">
        <p>Welcome to the Synapse OS documentation hub. Here you will find guides on how to setup, configure, and maximize your AI experience.</p>
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl mt-8">
          <h4 className="text-white font-semibold mb-2">Getting Started</h4>
          <p className="text-sm">Please visit our Master Guide tutorial accessible from the Watch Demo button on the home page to get started quickly.</p>
        </div>
      </div>
    )
  },
  "api-reference": {
    title: "API Reference",
    icon: <Code className="w-6 h-6" />,
    content: (
      <div className="space-y-6 text-white/70">
        <p>Build custom applications and integrate our neural processing engine directly into your own software using the Synapse REST API.</p>
        <pre className="p-4 bg-black rounded-xl border border-white/10 overflow-x-auto text-sm text-brand-blue mt-4">
          <code>{`// Initialize the Synapse Client
import { SynapseClient } from '@synapse/sdk';

const client = new SynapseClient({
  apiKey: process.env.SYNAPSE_API_KEY
});`}</code>
        </pre>
        <p className="text-sm mt-4">Full API documentation is currently restricted to Enterprise partners. Public API access is coming soon.</p>
      </div>
    )
  },
  "blog": {
    title: "Blog",
    icon: <FileText className="w-6 h-6" />,
    content: (
      <div className="space-y-6 text-white/70">
        <p>Insights, updates, and thoughts on the future of artificial intelligence from the Synapse engineering team.</p>
        <p>No posts published yet. Check back soon!</p>
      </div>
    )
  },
  "community": {
    title: "Community",
    icon: <Users className="w-6 h-6" />,
    content: (
      <div className="space-y-6 text-white/70">
        <p>Join thousands of developers and creatives building the future with Synapse OS.</p>
        <p>Our official Discord server and GitHub discussions will be opening to the public shortly.</p>
      </div>
    )
  },
  "about": {
    title: "About Us",
    icon: <Globe className="w-6 h-6" />,
    content: (
      <div className="space-y-6 text-white/70">
        <p>Synapse Inc. is an artificial intelligence research and deployment company. Our mission is to ensure that artificial general intelligence benefits all of humanity.</p>
        <p>Founded by Mayank Talreja, we are a team of dedicated engineers and designers focused on building the most intuitive and powerful AI interfaces the world has ever seen.</p>
      </div>
    )
  },
  "careers": {
    title: "Careers",
    icon: <Users className="w-6 h-6" />,
    content: (
      <div className="space-y-6 text-white/70">
        <p>Help us build the future of intelligence.</p>
        <p>We are always looking for exceptional talent in machine learning, frontend engineering, and product design. Currently, we do not have any open positions, but we are accepting speculative applications.</p>
      </div>
    )
  },
  "privacy": {
    title: "Privacy Policy",
    icon: <Shield className="w-6 h-6" />,
    content: (
      <div className="space-y-6 text-white/70">
        <p className="text-sm text-brand-blue font-medium">Effective Date: May 2026</p>
        <p>This Privacy Policy applies to the Synapse OS artificial intelligence platform and related services. It explains how we collect, use, and protect your information when you interact with our AI models.</p>
        
        <h3 className="text-xl font-bold text-white mt-10 mb-4 border-b border-white/10 pb-2">1. Information We Collect</h3>
        <p>When you use Synapse OS, we collect data to provide and improve our services:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Account Information:</strong> Your name, email address, and authentication credentials provided during sign-up.</li>
          <li><strong>Your Conversations and Content:</strong> The text prompts you type, images you upload for vision analysis, and the responses generated by the AI.</li>
          <li><strong>Usage Data:</strong> Device information, IP addresses, browser types, and latency metrics to help us optimize performance.</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-10 mb-4 border-b border-white/10 pb-2">2. How We Use Your Information</h3>
        <p>We use your data to power the core functionality of Synapse OS:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Providing the Service:</strong> To process your prompts, analyze data, and return instantaneous AI-generated responses.</li>
          <li><strong>Safety and Security:</strong> To detect, prevent, and respond to fraud, abuse, and security risks. We employ automated safety filters to prevent the generation of harmful content.</li>
          <li><strong>Improving the Models:</strong> Usage metrics help us understand system load. <em>Note: By default, Enterprise tier conversations are excluded from model fine-tuning.</em></li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-10 mb-4 border-b border-white/10 pb-2">3. Data Sharing and Disclosures</h3>
        <p>Synapse Inc. does not sell your personal data. We only share information in the following circumstances:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Service Providers:</strong> We use trusted third-party infrastructure (such as Google Cloud and Firebase) to securely host and process your data.</li>
          <li><strong>Billing and Subscriptions:</strong> Payment information, such as credit cards, is handled securely by our payment processor (e.g., Stripe). Refund requests for eligible Annual plans are processed utilizing this data securely.</li>
          <li><strong>Upcoming Features:</strong> Data processed for Vision Analysis, Data Analysis, and Code Generation (currently in development) will adhere strictly to this privacy policy.</li>
          <li><strong>Legal Reasons:</strong> We may disclose information if reasonably necessary to comply with valid legal processes or governmental requests.</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-10 mb-4 border-b border-white/10 pb-2">4. Your Privacy Controls</h3>
        <p>You have total control over your Synapse OS data. Through your account settings, you can:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Review and delete specific conversations.</li>
          <li>Export your entire chat history and uploaded files in JSON/CSV formats.</li>
          <li>Delete your account entirely, which permanently purges your data from our active servers within 30 days.</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-10 mb-4 border-b border-white/10 pb-2">5. Changes to this Policy</h3>
        <p>We may update this Privacy Policy from time to time as our AI capabilities evolve. We will notify you of material changes by placing a prominent notice on our website.</p>
      </div>
    )
  },
  "terms": {
    title: "Terms of Service",
    icon: <FileText className="w-6 h-6" />,
    content: (
      <div className="space-y-6 text-white/70">
        <p className="text-sm text-brand-blue font-medium">Effective Date: May 2026</p>
        <p>Welcome to Synapse OS. By using our AI services, APIs, or software, you agree to these terms. Please read them carefully.</p>
        
        <h3 className="text-xl font-bold text-white mt-10 mb-4 border-b border-white/10 pb-2">1. Using Our AI Services</h3>
        <p>You must be at least 18 years old to use Synapse OS. You are responsible for maintaining the security of your account and API keys. You agree not to share your credentials or bypass our rate limits.</p>
        
        <h3 className="text-xl font-bold text-white mt-10 mb-4 border-b border-white/10 pb-2">2. Your Content and AI Output</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Ownership:</strong> You retain ownership of the prompts and files you input into Synapse OS. Synapse Inc. claims no copyright over the AI-generated outputs returned to you.</li>
          <li><strong>Accuracy Limitations:</strong> Synapse OS utilizes experimental generative AI technology. Output may occasionally be inaccurate, misleading, or "hallucinated." You are solely responsible for reviewing and verifying the output before relying on it or publishing it.</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-10 mb-4 border-b border-white/10 pb-2">3. Prohibited Conduct</h3>
        <p>To ensure a safe environment, you may not use Synapse OS to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Generate malicious code, malware, or hacking exploits.</li>
          <li>Create or distribute non-consensual explicit content, CSAM, or content that promotes violence and self-harm.</li>
          <li>Automate the generation of spam, disinformation campaigns, or deceptive impersonations.</li>
          <li>Reverse engineer, decompile, or attempt to extract the source code or model weights of Synapse OS.</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-10 mb-4 border-b border-white/10 pb-2">4. Disclaimers and Limitations</h3>
        <p><strong>NO MEDICAL OR LEGAL ADVICE:</strong> Synapse OS is not designed to provide professional medical, legal, or financial advice. Never use AI output as a substitute for professional consultation.</p>
        <p><strong>"AS IS" BASIS:</strong> The services are provided "as is" without warranties of any kind. Synapse Inc. shall not be liable for any indirect, incidental, or consequential damages arising from your use of the AI.</p>

        <h3 className="text-xl font-bold text-white mt-10 mb-4 border-b border-white/10 pb-2">5. Cookies and Local Storage</h3>
        <p>Synapse OS utilizes cookies and local browser storage to maintain session security, remember your UI preferences, and provide seamless access to the platform. <strong>You remain in full control of your data footprint.</strong> While strictly necessary technical cookies cannot be disabled, you are granted the autonomous choice to opt-in or opt-out of non-essential tracking and analytical cookies via our persistent consent manager.</p>

        <h3 className="text-xl font-bold text-white mt-10 mb-4 border-b border-white/10 pb-2">6. Push Notifications and Alerts</h3>
        <p>With your explicit consent, Synapse OS may send push notifications to your device to provide real-time updates regarding system status, new features, or account alerts. <strong>Participation is entirely voluntary.</strong> You may enable or revoke these permissions at any time through your operating system or browser settings. We do not use push notifications for third-party advertising or spam.</p>

        <h3 className="text-xl font-bold text-white mt-10 mb-4 border-b border-white/10 pb-2">7. Billing and Refund Policy</h3>
        <p>By subscribing to Synapse OS, you agree to our pricing terms. Note the following rules regarding our Refund Policy:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Monthly Subscriptions:</strong> All monthly subscriptions are strictly non-refundable. You may cancel at any time, but no refunds will be issued for partial months.</li>
          <li><strong>Annual Subscriptions:</strong> Annual subscriptions come with a <strong>14-Day Money-Back Guarantee</strong>. If you are unsatisfied, you may request a full refund within 14 days of your initial annual purchase.</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-10 mb-4 border-b border-white/10 pb-2">8. Usage Limits and Feature Availability</h3>
        <p>Synapse OS is subject to fair usage limits depending on your subscription tier:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Daily Credits:</strong> The Starter tier offers 500 daily credits (650 if billed annually). The Pro tier offers 1000 daily credits (1150 if billed annually).</li>
          <li><strong>Coming Soon Features:</strong> Tools like Vision Processing, Code Generation, and Data Analysis are currently marked as "Coming Soon" and remain under active development.</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-10 mb-4 border-b border-white/10 pb-2">9. Termination</h3>
        <p>We reserve the right to suspend or terminate your access to Synapse OS immediately, without prior notice or liability, if you breach these Terms of Service or engage in prohibited conduct.</p>
      </div>
    )
  }
};

export default function InfoPage({ params }: { params: { slug: string } }) {
  const content = pageContent[params.slug];

  if (!content) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-white pt-32 pb-24 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-blue/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <Link href="/" className="inline-flex items-center text-white/50 hover:text-white transition-colors mb-12">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>

        <div className="glass-card rounded-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 mb-8 text-brand-blue shadow-lg">
            {content.icon}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-12 text-glow">
            {content.title}
          </h1>
          
          <div className="prose prose-invert prose-lg max-w-none">
            {content.content}
          </div>
        </div>
      </div>
    </div>
  );
}
