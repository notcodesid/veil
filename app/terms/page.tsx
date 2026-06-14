"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function TermsPage() {
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
          Terms &amp; Conditions
        </h1>
        <p className="font-bold text-zinc-100 drop-shadow-[1px_1px_0px_rgba(0,0,0,0.4)]">
          Last updated: June 15, 2026
        </p>
      </div>

      <Card className="veil-surface p-6 sm:p-8 space-y-6">
        <CardContent className="space-y-6 text-zinc-700 leading-relaxed font-semibold">
          <p>
            These Terms &amp; Conditions govern your use of the <strong>Veil</strong> decentralized exchange user interface. Please read them carefully. By accessing or using the platform, you agree to be bound by these terms.
          </p>

          <hr className="border-t-2 border-black/10 my-4" />

          <div className="space-y-2">
            <h2 className="font-luckiest-guy text-xl text-black uppercase tracking-wider">
              1. Nature of the Protocol
            </h2>
            <p>
              Veil is a decentralized, non-custodial software application that provides access to the Solana blockchain and MagicBlock Private Ephemeral Rollups. Veil does not act as a broker, custodian, or financial advisor. You retain full control over your private keys and digital assets at all times.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-luckiest-guy text-xl text-black uppercase tracking-wider">
              2. Devnet &amp; Experimental Software
            </h2>
            <p>
              The Veil platform currently runs on the Solana Devnet. All services, smart contracts, and cryptographic protocols are experimental. Use of the devnet entails risks of software bugs, protocol upgrades, state resets, and transactional instability. You should not use production keys or real mainnet funds with these services.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-luckiest-guy text-xl text-black uppercase tracking-wider">
              3. Assumption of Risk
            </h2>
            <p>
              By using Veil, you explicitly acknowledge and accept the inherent risks of:
            </p>
            <ul className="list-disc list-inside pl-2 space-y-1">
              <li>Smart contract bugs, exploits, or systemic failures.</li>
              <li>Network congestion, high transaction fees, or rollbacks on Solana.</li>
              <li>Fluctuations in virtual currency value and regulatory changes.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="font-luckiest-guy text-xl text-black uppercase tracking-wider">
              4. Prohibited Jurisdictions &amp; Activities
            </h2>
            <p>
              You certify that you are not a citizen or resident of any country subject to economic sanctions or trade embargoes. You agree not to use the interface to engage in money laundering, illicit financing, or other illegal activities.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-luckiest-guy text-xl text-black uppercase tracking-wider">
              5. Disclaimer of Warranties
            </h2>
            <p>
              VEIL IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTY OF ANY KIND. THE DEVELOPERS DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-luckiest-guy text-xl text-black uppercase tracking-wider">
              6. Limitation of Liability
            </h2>
            <p>
              IN NO EVENT SHALL VEIL, ITS DEVELOPERS, OR CONTRIBUTORS BE LIABLE FOR ANY DAMAGES WHATSOEVER (INCLUDING DIRECT, INDIRECT, PUNITIVE, OR CONSEQUENTIAL DAMAGES) ARISING FROM YOUR USE OF THE PLATFORM OR CONTRACTS.
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
