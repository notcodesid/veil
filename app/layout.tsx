import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";
import { MagicBlockAuthProvider } from "@/providers/magicblock-auth-provider";
import { WalletProvider } from "@/providers/wallet-provider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Veil — Private DEX",
  description:
    "Shield, swap, and unshield SPL tokens privately on MagicBlock Ephemeral Rollups.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <WalletProvider>
          <MagicBlockAuthProvider>
            <SiteHeader />
            {children}
            <Toaster />
          </MagicBlockAuthProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
