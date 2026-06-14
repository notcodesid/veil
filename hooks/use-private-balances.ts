"use client";

import { useWallet } from "@solana/wallet-adapter-react";

import { useBalances } from "@/hooks/use-balances";
import { useMagicBlockAuth } from "@/hooks/use-magicblock-auth";
import {
  TOKENS,
  type CanonicalSymbol,
} from "@/lib/constants/tokens";

export type ShieldedTokenRow = {
  symbol: CanonicalSymbol;
  mint: string;
  shielded: string;
  wallet: string;
};

export function usePrivateBalances() {
  const { connected, publicKey } = useWallet();
  const { isAuthenticated, isAuthenticating } = useMagicBlockAuth();
  const { publicBalances, privateBalances, isLoading, refresh } = useBalances();

  const rows: ShieldedTokenRow[] = (
    Object.keys(TOKENS) as CanonicalSymbol[]
  ).map((symbol) => ({
    symbol,
    mint: TOKENS[symbol].mint,
    shielded: privateBalances[symbol],
    wallet: publicBalances[symbol],
  }));

  const hasShielded = rows.some((row) => row.shielded !== "0");

  return {
    connected,
    publicKey: publicKey?.toBase58() ?? null,
    isAuthenticated,
    isAuthenticating,
    rows,
    hasShielded,
    isLoading,
    refresh,
  };
}