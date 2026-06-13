import Link from "next/link";

import { ConnectButton } from "@/components/wallet/connect-button";

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/" className="font-semibold tracking-tight">
            Veil
          </Link>
          <Link href="/trade" className="text-muted-foreground hover:text-foreground">
            Trade
          </Link>
          <Link
            href="/portfolio"
            className="text-muted-foreground hover:text-foreground"
          >
            Portfolio
          </Link>
        </nav>
        <ConnectButton />
      </div>
    </header>
  );
}