"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { Loader2 } from "lucide-react";

import { useBalances } from "@/hooks/use-balances";
import { formatBalance } from "@/lib/format/display";

function BalanceCell({
  label,
  usdc,
  sol,
  highlight,
}: {
  label: string;
  usdc: string;
  sol: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex-1 space-y-1.5">
      <p className="font-luckiest-guy text-sm uppercase tracking-wider text-zinc-400">{label}</p>
      <p
        className={`font-mono text-sm font-bold tabular-nums ${highlight ? "text-emerald-600" : "text-black"}`}
      >
        {formatBalance(usdc)} USDC
      </p>
      <p className="font-mono text-sm font-semibold tabular-nums text-zinc-500">
        {formatBalance(sol)} SOL
      </p>
    </div>
  );
}

export function BalanceStrip() {
  const { connected } = useWallet();
  const { privateBalances, isLoading, publicBalances, error } = useBalances();

  if (!connected) {
    return (
      <p className="text-center text-xs text-muted-foreground">
        Connect a wallet to view balances.
      </p>
    );
  }

  if (isLoading) {
    return (
      <div className="veil-surface flex items-center justify-center gap-2 rounded-xl px-4 py-5 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading balances…
      </div>
    );
  }

  const hasShielded =
    privateBalances.USDC !== "0" || privateBalances.SOL !== "0";

  return (
    <div className="veil-surface rounded-xl px-4 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
        <BalanceCell
          label="Wallet"
          usdc={publicBalances.USDC}
          sol={publicBalances.SOL}
        />
        <div className="hidden w-0.5 bg-black sm:block" />
        <BalanceCell
          label="Shielded"
          usdc={privateBalances.USDC}
          sol={privateBalances.SOL}
          highlight={hasShielded}
        />
      </div>
      {!hasShielded ? (
        <p className="mt-3 border-t-2 border-black pt-3 text-center text-xs font-semibold text-zinc-500">
          No shielded tokens yet — deposit on the Shield tab.
        </p>
      ) : null}
      {error ? (
        <p className="mt-2 text-center text-xs font-bold text-red-500">{error}</p>
      ) : null}
    </div>
  );
}