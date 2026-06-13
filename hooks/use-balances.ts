"use client";

import { useCallback, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import { useMagicBlockAuth } from "@/hooks/use-magicblock-auth";
import {
  TOKENS,
  type CanonicalSymbol,
  fromBaseUnits,
} from "@/lib/constants/tokens";
import {
  getPrivateTokenBalance,
  getPublicTokenBalance,
} from "@/lib/magicblock/balance";
import { getBaseConnection } from "@/lib/solana/connection";

const EMPTY: Record<CanonicalSymbol, string> = { SOL: "0", USDC: "0" };

export function useBalances() {
  const { publicKey, connected } = useWallet();
  const { token, isAuthenticated } = useMagicBlockAuth();
  const [publicBalances, setPublicBalances] =
    useState<Record<CanonicalSymbol, string>>(EMPTY);
  const [privateBalances, setPrivateBalances] =
    useState<Record<CanonicalSymbol, string>>(EMPTY);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!publicKey) return;

    setIsLoading(true);
    try {
      const owner = publicKey.toBase58();
      const connection = getBaseConnection();
      const [solLamports, usdcRaw] = await Promise.all([
        connection.getBalance(publicKey),
        getPublicTokenBalance(owner, TOKENS.USDC.mint),
      ]);

      setPublicBalances({
        SOL: fromBaseUnits(BigInt(solLamports), TOKENS.SOL.decimals),
        USDC: fromBaseUnits(usdcRaw, TOKENS.USDC.decimals),
      });

      if (!token || !isAuthenticated) {
        setPrivateBalances(EMPTY);
        return;
      }

      const [solPrivate, usdcPrivate] = await Promise.all([
        getPrivateTokenBalance({
          address: owner,
          mint: TOKENS.SOL.mint,
          token,
        }),
        getPrivateTokenBalance({
          address: owner,
          mint: TOKENS.USDC.mint,
          token,
        }),
      ]);

      setPrivateBalances({
        SOL: fromBaseUnits(solPrivate.balance, TOKENS.SOL.decimals),
        USDC: fromBaseUnits(usdcPrivate.balance, TOKENS.USDC.decimals),
      });
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, token, isAuthenticated]);

  useEffect(() => {
    if (connected && publicKey) {
      void refresh();
    } else {
      setPublicBalances(EMPTY);
      setPrivateBalances(EMPTY);
    }
  }, [connected, publicKey, refresh]);

  return {
    publicBalances,
    privateBalances,
    isLoading,
    refresh,
  };
}