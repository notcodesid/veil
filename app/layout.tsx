import type { Metadata } from "next";
import { Geist, Geist_Mono, Luckiest_Guy } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";
import { BalancesProvider } from "@/providers/balances-provider";
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

const luckiestGuy = Luckiest_Guy({
  variable: "--font-luckiest-guy",
  weight: "400",
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
      className={`${geistSans.variable} ${geistMono.variable} ${luckiestGuy.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <WalletProvider>
          <MagicBlockAuthProvider>
            <BalancesProvider>
              <SiteHeader />
              <div className="flex flex-1 flex-col">{children}</div>
              <SiteFooter />
              <Toaster richColors closeButton position="bottom-right" />
            </BalancesProvider>
          </MagicBlockAuthProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
