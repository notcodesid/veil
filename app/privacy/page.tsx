"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 px-4 pt-28 pb-16 sm:gap-6 sm:px-6">
      <div className="space-y-2">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-white hover:text-yellow-200 transition-colors font-luckiest-guy uppercase tracking-wider text-sm drop-shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]"
        >
          <ArrowLeft className="size-4 stroke-[3px]" /> Back to Home
        </Link>
        <h1 className="font-luckiest-guy text-4xl sm:text-5xl uppercase tracking-wider text-white drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]">
          Privacy Policy
        </h1>
        <p className="font-bold text-zinc-100 drop-shadow-[1px_1px_0px_rgba(0,0,0,0.4)]">
          Last updated: June 15, 2026
        </p>
      </div>

      <Card className="veil-surface p-6 sm:p-8 space-y-6">
        <CardContent className="space-y-6 text-zinc-700 leading-relaxed font-semibold">
          <p>
            Welcome to <strong>Veil</strong>. Your privacy is our highest priority. As a decentralized privacy-focused platform, our core architecture is engineered to minimize data footprint and prevent unauthorized surveillance.
          </p>

          <hr className="border-t-2 border-black/10 my-4" />

          <div className="space-y-2">
            <h2 className="font-luckiest-guy text-xl text-black uppercase tracking-wider">
              1. Information We Do Not Collect
            </h2>
            <p>
              Unlike traditional financial services or centralized exchanges, Veil does not require accounts, usernames, passwords, email addresses, or KYC validation.
            </p>
            <ul className="list-disc list-inside pl-2 space-y-1">
              <li>No personal identification information (PII) is gathered.</li>
              <li>No IP addresses or location details are tracked.</li>
              <li>No browser cookies or tracking scripts are deployed.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="font-luckiest-guy text-xl text-black uppercase tracking-wider">
              2. Blockchain &amp; Shielding Protocol
            </h2>
            <p>
              Veil operates using MagicBlock Private Ephemeral Rollups (PER) on the Solana network. When you shield your tokens:
            </p>
            <ul className="list-disc list-inside pl-2 space-y-1">
              <li>Transactions are processed inside cryptographic shielded states.</li>
              <li>Only validity proofs are sent to the public Solana mainnet/devnet.</li>
              <li>Your address, trade amount, and transaction history remain confidential inside the Private ER.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="font-luckiest-guy text-xl text-black uppercase tracking-wider">
              3. Local Storage Usage
            </h2>
            <p>
              We use your browser&apos;s local storage strictly to keep track of your active ephemeral session key and local UI settings (such as theme preferences and connection status). This data stays entirely on your physical device and is never uploaded to any remote servers.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-luckiest-guy text-xl text-black uppercase tracking-wider">
              4. Third-Party Integrations
            </h2>
            <p>
              When you connect your wallet (e.g. Phantom, Solflare), your interactions are governed by their respective privacy policies. Veil does not control how external wallet applications handle your public key or RPC connection logs.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-luckiest-guy text-xl text-black uppercase tracking-wider">
              5. Policy Updates
            </h2>
            <p>
              Any changes to this policy will be reflected on this page. By continuing to use the Veil interface, you agree to these privacy principles.
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
