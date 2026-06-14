"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ConnectButton } from "@/components/wallet/connect-button";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/trade", label: "Trade" },
  { href: "/portfolio", label: "Portfolio" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="absolute top-0 left-0 right-0 z-50 w-full px-4 pt-4 sm:px-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between border-2 border-black bg-white px-4 py-2.5 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl md:rounded-full">
        {/* Left: Logo & Title */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <img
              src="/logo.jpg"
              alt="Veil Logo"
              className="size-8 object-contain transition-transform group-hover:scale-115 group-hover:rotate-12 -translate-y-[2.5px]"
            />
            <span className="font-luckiest-guy text-2xl tracking-wide uppercase text-black leading-none pt-0.5">
              VEIL
            </span>
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-4 ml-6">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "font-luckiest-guy text-base uppercase tracking-wider transition-all duration-150 py-1 px-3 rounded-lg border-2 border-transparent hover:border-black hover:bg-yellow-100 hover:-rotate-2 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                    active
                      ? "bg-yellow-200 text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      : "text-zinc-700"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Navigation Links (Mobile) */}
        <nav className="flex md:hidden items-center gap-2">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "font-luckiest-guy text-xs uppercase tracking-wider transition-all duration-150 py-1 px-2 rounded-lg border-2 border-transparent",
                  active
                    ? "bg-yellow-200 text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    : "text-zinc-700"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Connect Wallet */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}