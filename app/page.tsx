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
            Private DEX · Devnet
          </p>
          <h1 className="font-luckiest-guy text-4xl sm:text-6xl md:text-7xl tracking-wider text-white uppercase drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] select-none leading-none">
            VEIL&apos;s ON SOLANA!
          </h1>
          <p className="font-luckiest-guy text-sm sm:text-lg uppercase tracking-widest text-emerald-300 drop-shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] max-w-xl mx-auto leading-relaxed">
            VEIL leaps to the moon with private execution & Solana speed!
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <Link href="/trade">
              <button className="h-14 px-8 bg-yellow-300 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400 active:translate-y-px active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-luckiest-guy text-lg uppercase tracking-wider rounded-xl transition-all cursor-pointer">
                Trade Now
              </button>
            </Link>
            <Link href="/portfolio">
              <button className="h-14 px-8 bg-white text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-zinc-100 active:translate-y-px active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-luckiest-guy text-lg uppercase tracking-wider rounded-xl transition-all cursor-pointer">
                My Portfolio
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
          {/* Left: Pepe Image */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <img 
              src="/about.jpg" 
              alt="Veil Pepe" 
              className="w-full max-w-[260px] sm:max-w-[360px] md:max-w-[420px] object-contain drop-shadow-[4px_4px_0px_rgba(0,0,0,0.15)]" 
            />
          </div>

          {/* Right: Text Content */}
          <div className="flex-1 text-center md:text-left space-y-6 max-w-xl">
            <h2 className="font-luckiest-guy text-5xl sm:text-6xl uppercase tracking-wider text-white drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] leading-none select-none">
              ABOUT VEIL
            </h2>
            <p className="text-lg sm:text-xl font-medium leading-relaxed text-white max-w-lg">
              VEIL is the ultimate private execution layer, bringing zero-knowledge privacy to Solana with speed, security, and developer-friendly rollups.
            </p>
            <div className="pt-2 flex justify-center md:justify-start">
              <Link href="/trade">
                <button className="h-14 px-8 bg-white text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-zinc-50 active:translate-y-px active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-luckiest-guy text-lg uppercase tracking-wider rounded-xl transition-all cursor-pointer">
                  Get Veil Now
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