"use client";

import type { CanonicalSymbol } from "@/lib/constants/tokens";

// Phase 7 — fetch private USDC + SOL balances
export function usePrivateBalances() {
  return {
    balances: { SOL: "0", USDC: "0" } as Record<CanonicalSymbol, string>,
    isLoading: false,
    refresh: async () => {},
  };
}