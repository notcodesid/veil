"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, EyeOff, RefreshCw, Shield, Wallet } from "lucide-react";

const flows = [
  {
    icon: Shield,
    title: "Shield",
    description: "Deposit SPL tokens into a Private Ephemeral Rollup (PER).",
    color: "bg-amber-300",
  },
  {
    icon: EyeOff,
    title: "Swap",
    description: "Swap privately with live quotes and zero mempool exposure.",
    color: "bg-emerald-300",
  },
  {
    icon: RefreshCw,
    title: "Unshield",
    description: "Withdraw SPL tokens natively and settle on Solana L1.",
    color: "bg-fuchsia-300",
  },
] as const;

export default function HomePage() {
  return (
    <div className="flex flex-col w-full flex-1">
      {/* Hero Section with Landscape Background */}
      <section 
        className="relative w-full min-h-[660px] md:min-h-0 md:aspect-[2880/1948] flex flex-col items-center justify-start pt-28 pb-20 md:pt-[max(112px,15.5%)] md:pb-[8%] px-4 text-center bg-cover bg-bottom z-10"
        style={{ backgroundImage: "url('/hero.jpg')" }}
      >

        {/* Content Container */}
        <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
          <p className="font-luckiest-guy text-xs sm:text-sm uppercase tracking-[0.25em] text-yellow-300 drop-shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">
            Private DEX · Mainnet
          </p>
          <h1 className="font-luckiest-guy text-4xl sm:text-6xl md:text-7xl tracking-wider text-white uppercase drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] select-none leading-none">
            Trade Privately on Solana
          </h1>
          <p className="font-luckiest-guy text-sm sm:text-lg uppercase tracking-widest text-emerald-300 drop-shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] max-w-2xl mx-auto leading-relaxed">
            Shield assets, execute swaps privately, and settle natively on Solana using MagicBlock Ephemeral Rollups.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <Link href="/trade">
              <button className="h-14 px-8 bg-yellow-300 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400 active:translate-y-px active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-luckiest-guy text-lg uppercase tracking-wider rounded-xl transition-all cursor-pointer">
                Start Trading
              </button>
            </Link>
          </div>
        </div>


        {/* Bottom Pepe Stickers */}
        <div className="absolute bottom-[calc(15.833vw-5px)] left-0 right-0 flex justify-between items-end pointer-events-none select-none max-w-7xl mx-auto px-10 sm:px-8 w-full z-10">
          {/* Sticker 1 (Left: Guitar Pepe) */}
          <div className="relative w-[32%] max-w-[200px] sm:max-w-[300px] md:max-w-[420px] aspect-[1024/854] -rotate-6 origin-bottom-left">
            <img 
              src="/1.jpg" 
              alt="Pepe Guitar" 
              className="w-full h-full object-contain" 
            />
          </div>

          {/* Sticker 2 (Middle: Shy Pepe) */}
          <div className="relative w-[12%] max-w-[75px] sm:max-w-[105px] md:max-w-[125px] aspect-[747/1024] mb-[0.5%] sm:mb-[1%] md:mb-[1.5%]">
            <img 
              src="/2.jpg" 
              alt="Pepe Shy" 
              className="w-full h-full object-contain" 
            />
          </div>

          {/* Sticker 3 (Right: Thinker Pepe) */}
          <div className="relative w-[28%] max-w-[200px] sm:max-w-[280px] md:max-w-[350px] aspect-[1024/753]">
            <img 
              src="/3.jpg" 
              alt="Pepe Thinker" 
              className="w-full h-full object-contain" 
            />
          </div>
        </div>

        {/* Road Divider at the bottom (Background Layer) */}
        <div className="absolute bottom-0 left-0 right-0 w-full z-30 pointer-events-none select-none">
          <img 
            src="/road.svg" 
            alt="Road divider" 
            className="w-full h-auto" 
          />
        </div>

        {/* Grass Divider sitting on top of the road (Foreground Layer) */}
        <div className="absolute bottom-[calc(15.833vw-20px)] left-0 right-0 w-full z-20 pointer-events-none select-none">
          <img 
            src="/grass.svg" 
            alt="Grass divider" 
            className="w-full h-auto" 
          />
        </div>
      </section>

      {/* About Section */}
      <section className="relative w-full bg-[#2d9d44] text-white py-20 px-4 sm:px-6 overflow-hidden z-20">
        {/* Grass Tuft Bottom Left */}
        <div className="absolute bottom-[-15px] left-[-20px] w-[30%] max-w-[220px] pointer-events-none select-none z-10">
          <img src="/grass.svg" alt="" className="w-full h-auto" />
        </div>
        {/* Grass Tuft Bottom Right */}
        <div className="absolute bottom-[-15px] right-[-20px] w-[30%] max-w-[220px] pointer-events-none select-none z-10 scale-x-[-1]">
          <img src="/grass.svg" alt="" className="w-full h-auto" />
        </div>

        <div className="relative mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 z-20">
          {/* Left: Architecture Flow Diagram */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="w-full max-w-md bg-white border-4 border-black p-6 rounded-3xl shadow-[8px_8px_0px_rgba(0,0,0,1)] text-black space-y-4">
              <h3 className="font-luckiest-guy text-xl text-center uppercase tracking-wide border-b-2 border-black pb-2">
                Veil Transaction Flow
              </h3>
              
              <div className="flex flex-col items-center space-y-3">
                {/* Step 1: Shield */}
                <div className="w-full flex items-center justify-between border-2 border-black p-3 bg-amber-200 rounded-xl shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-2">
                    <span className="font-luckiest-guy text-lg bg-white border border-black rounded-full size-6 flex items-center justify-center leading-none pt-0.5">1</span>
                    <span className="font-luckiest-guy text-sm uppercase tracking-wider">Shield Tokens</span>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-700 bg-white/60 px-2 py-0.5 rounded border border-black">Solana L1 → Rollup</span>
                </div>

                {/* Connecting Arrow 1 */}
                <div className="flex flex-col items-center">
                  <svg className="w-5 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>

                {/* Step 2: Swap */}
                <div className="w-full flex items-center justify-between border-2 border-black p-3 bg-emerald-200 rounded-xl shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-2">
                    <span className="font-luckiest-guy text-lg bg-white border border-black rounded-full size-6 flex items-center justify-center leading-none pt-0.5">2</span>
                    <span className="font-luckiest-guy text-sm uppercase tracking-wider">Private Swap</span>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-700 bg-white/60 px-2 py-0.5 rounded border border-black">Hidden Order Flow</span>
                </div>

                {/* Connecting Arrow 2 */}
                <div className="flex flex-col items-center">
                  <svg className="w-5 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>

                {/* Step 3: Unshield */}
                <div className="w-full flex items-center justify-between border-2 border-black p-3 bg-fuchsia-200 rounded-xl shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-2">
                    <span className="font-luckiest-guy text-lg bg-white border border-black rounded-full size-6 flex items-center justify-center leading-none pt-0.5">3</span>
                    <span className="font-luckiest-guy text-sm uppercase tracking-wider">Unshield &amp; Settle</span>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-700 bg-white/60 px-2 py-0.5 rounded border border-black">Rollup → Solana L1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="flex-1 text-center md:text-left space-y-6 max-w-xl">
            <h2 className="font-luckiest-guy text-5xl sm:text-6xl uppercase tracking-wider text-white drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] leading-none select-none">
              WHY VEIL?
            </h2>

            {/* 4 Bullets describing Why Veil */}
            <div className="space-y-4 max-w-lg">
              <div className="flex items-start gap-3.5 text-left bg-black/15 p-4 rounded-2xl border border-white/10">
                <span className="text-2xl select-none">🔒</span>
                <div>
                  <h4 className="font-luckiest-guy text-lg uppercase tracking-wider text-yellow-300">
                    Private Execution
                  </h4>
                  <p className="text-sm sm:text-base font-semibold leading-relaxed text-zinc-100 mt-0.5">
                    Trades execute inside MagicBlock Ephemeral Rollups before being revealed on-chain.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 text-left bg-black/15 p-4 rounded-2xl border border-white/10">
                <span className="text-2xl select-none">⚡</span>
                <div>
                  <h4 className="font-luckiest-guy text-lg uppercase tracking-wider text-yellow-300">
                    No Sandwich Attacks
                  </h4>
                  <p className="text-sm sm:text-base font-semibold leading-relaxed text-zinc-100 mt-0.5">
                    Hidden order flow prevents bots from front-running or sandwiching your swaps.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 text-left bg-black/15 p-4 rounded-2xl border border-white/10">
                <span className="text-2xl select-none">🌊</span>
                <div>
                  <h4 className="font-luckiest-guy text-lg uppercase tracking-wider text-yellow-300">
                    Native Solana Settlement
                  </h4>
                  <p className="text-sm sm:text-base font-semibold leading-relaxed text-zinc-100 mt-0.5">
                    Assets settle directly back to Solana with no bridges or wrapped tokens.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 text-left bg-black/15 p-4 rounded-2xl border border-white/10">
                <span className="text-2xl select-none">✨</span>
                <div>
                  <h4 className="font-luckiest-guy text-lg uppercase tracking-wider text-yellow-300">
                    Powered by MagicBlock
                  </h4>
                  <p className="text-sm sm:text-base font-semibold leading-relaxed text-zinc-100 mt-0.5">
                    Leverages high-speed Ephemeral Rollups for instant private confirmation and L1 consensus.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-center md:justify-start">
              <Link href="/trade">
                <button className="h-14 px-8 bg-white text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-zinc-50 active:translate-y-px active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-luckiest-guy text-lg uppercase tracking-wider rounded-xl transition-all cursor-pointer">
                  Start Trading
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Content Section */}
      <section 
        className="relative w-full border-t-4 border-black py-24 px-4 sm:px-6 overflow-hidden z-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/features_bg.png')" }}
      >
        {/* Top Header Banner */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30">
          <div className="bg-[#2d9d44] border-x-4 border-b-4 border-black text-white font-luckiest-guy text-xl sm:text-3xl uppercase tracking-wider px-8 py-3 rounded-b-3xl shadow-[4px_4px_0px_rgba(0,0,0,1)] whitespace-nowrap">
            HOW TO USE VEIL
          </div>
        </div>

        {/* Cards Grid Container */}
        <div className="mx-auto max-w-4xl grid gap-6 md:grid-cols-2 mt-8 z-20 relative">
          
          {/* Card 1: Status & Authentication */}
          <div className="veil-surface flex flex-col p-6 text-left bg-white h-full justify-between">
            <div>
              <div className="flex size-9 items-center justify-center rounded-lg border-2 border-black bg-sky-300 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                <Wallet className="size-4.5 text-black" />
              </div>
              <p className="font-luckiest-guy text-2xl uppercase tracking-wide text-black mt-3">1. CONNECT WALLET</p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-zinc-700">
                Verify your wallet connection status and private ephemeral session.
              </p>
            </div>
          </div>

          {/* Card 2: Shield */}
          <div className="veil-surface flex flex-col p-6 text-left justify-between bg-white h-full">
            <div>
              <div className="flex size-9 items-center justify-center rounded-lg border-2 border-black bg-amber-300 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                <Shield className="size-4.5 text-black" />
              </div>
              <p className="font-luckiest-guy text-2xl uppercase tracking-wide text-black mt-3">2. SHIELD TOKENS</p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-zinc-700">
                Deposit SPL tokens into a Private Ephemeral Rollup (PER) to start transacting privately.
              </p>
            </div>
          </div>

          {/* Card 3: Swap */}
          <div className="veil-surface flex flex-col p-6 text-left justify-between bg-white h-full">
            <div>
              <div className="flex size-9 items-center justify-center rounded-lg border-2 border-black bg-emerald-300 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                <EyeOff className="size-4.5 text-black" />
              </div>
              <p className="font-luckiest-guy text-2xl uppercase tracking-wide text-black mt-3">3. SWAP PRIVATELY</p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-zinc-700">
                Swap privately with live quotes, zero mempool exposure, and frontrunning protection.
              </p>
            </div>
          </div>

          {/* Card 4: Unshield */}
          <div className="veil-surface flex flex-col p-6 text-left justify-between bg-white h-full">
            <div>
              <div className="flex size-9 items-center justify-center rounded-lg border-2 border-black bg-fuchsia-300 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                <RefreshCw className="size-4.5 text-black" />
              </div>
              <p className="font-luckiest-guy text-2xl uppercase tracking-wide text-black mt-3">4. CONFIRM & UNSHIELD</p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-zinc-700">
                Withdraw SPL tokens natively back to Solana L1 and settle instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enter the Veil CTA Section */}
      <section className="relative w-full bg-[#2d9d44] pt-28 pb-16 md:pt-36 md:pb-24 px-4 sm:px-6 overflow-visible z-20">
        <div 
          className="relative mx-auto max-w-4xl w-full border-4 border-black p-10 sm:p-16 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-[32px] md:rounded-[48px] overflow-visible"
          style={{
            background: "radial-gradient(53% 140% at 32.5% -19.4%, rgb(255, 255, 255) 0%, rgb(5, 79, 252) 50%)"
          }}
        >
          {/* Top Right Sticker: Pepe on Shoulders peeking on border */}
          <div className="absolute bottom-[100%] right-[5%] sm:right-[8%] w-[100px] sm:w-[125px] pointer-events-none select-none z-[-1] translate-y-[35px] sm:translate-y-[45px]">
            <img src="/footer-2.jpg" alt="" className="w-full h-auto object-contain" />
          </div>

          {/* Content inside board */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-6">
            <h2 className="font-luckiest-guy text-4xl sm:text-7xl uppercase tracking-wider text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] leading-none select-none">
              ENTER THE VEIL
            </h2>
            <p className="text-base sm:text-xl font-medium leading-relaxed text-white max-w-xl mx-auto drop-shadow-[1.5px_1.5px_0px_rgba(0,0,0,0.5)]">
              Shield your tokens, swap privately, and enter the next generation of DeFi speed on Solana.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link href="/trade">
                <button className="h-12 px-8 bg-white text-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-zinc-100 active:translate-y-px active:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] font-luckiest-guy text-base uppercase tracking-wider rounded-xl transition-all cursor-pointer">
                  Trade Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}