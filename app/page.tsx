import Link from "next/link";

import { AuthStatus } from "@/components/wallet/auth-status";
import { WalletStatus } from "@/components/wallet/wallet-status";
import { ConnectButton } from "@/components/wallet/connect-button";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-8 p-6 text-center">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Private DEX
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">Veil</h1>
        <p className="text-lg text-muted-foreground">
          Trade privately, settle publicly.
        </p>
        <p className="max-w-md text-sm text-muted-foreground">
          Shield SPL tokens into MagicBlock Private Ephemeral Rollups, swap
          without mempool exposure, and unshield to Solana.
        </p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <WalletStatus />
        <AuthStatus />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/trade">
          <Button>Open Trade</Button>
        </Link>
        <ConnectButton />
      </div>
    </main>
  );
}