import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Navbar from "@/components/ui/Navbar";
import SupportChat from "@/components/ui/SupportChat";
import CookieConsent from "@/components/ui/CookieConsent";
import NotificationConsent from "@/components/ui/NotificationConsent";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Website - The Future Starts Here",
  description: "Premium Apple-inspired futuristic AI website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground antialiased selection:bg-white/10 selection:text-white`}>
        <AuthProvider>
          <SmoothScroll>
            <Navbar />
            {children}
            <SupportChat />
            <CookieConsent />
            <NotificationConsent />
          </SmoothScroll>
        </AuthProvider>
      </body>
    </html>
  );
}
