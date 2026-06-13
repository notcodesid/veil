"use client";

import { useBalances } from "@/hooks/use-balances";

export function BalanceStrip() {
  const { privateBalances, isLoading, publicBalances } = useBalances();

  if (isLoading) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Loading balances…
      </p>
    );
  }

  return (
    <p className="text-center text-sm text-muted-foreground">
      Wallet: {publicBalances.USDC} USDC · {publicBalances.SOL} SOL — Shielded:{" "}
      {privateBalances.USDC} USDC · {privateBalances.SOL} SOL
    </p>
  );
}