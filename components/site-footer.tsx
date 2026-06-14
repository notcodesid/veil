"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function SiteFooter() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (!isHome) return null;

  return (
    <footer className="w-full px-4 pb-6 pt-4 mt-auto bg-[#2d9d44]">
      <div className="relative mx-auto flex max-w-5xl flex-col sm:flex-row items-center justify-between gap-4 border-2 border-black bg-white px-6 py-3.5 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl sm:rounded-full">
        {/* Left Sticker: Pepe Pointing */}
        <div className="absolute bottom-[100%] left-[5%] sm:left-[8%] w-[190px] sm:w-[270px] pointer-events-none select-none z-30 translate-y-[2.5px]">
          <img src="/footer-1.jpg" alt="" className="w-full h-auto object-contain" />
        </div>

        {/* Left: Logo & Title */}
        <Link href="/" className="flex items-center gap-1.5 hover:scale-105 transition-transform">
          <span className="text-xl select-none">🐸</span>
          <span className="font-luckiest-guy text-lg sm:text-xl uppercase tracking-wide pt-0.5 leading-none">VEIL</span>
        </Link>

        {/* Right: Links */}
        <div className="flex items-center gap-3 font-luckiest-guy text-[10px] sm:text-xs uppercase tracking-wider text-black">
          <Link
            href="/privacy"
            className="hover:text-zinc-600 transition-colors"
          >
            Privacy Policy
          </Link>
          <span className="text-black font-sans font-bold">|</span>
          <Link
            href="/terms"
            className="hover:text-zinc-600 transition-colors"
          >
            Terms & Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
}