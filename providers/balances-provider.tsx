"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { getNativeSolLamports } from "@/lib/solana/balance";
import { VEIL_BALANCES_EVENT } from "@/lib/veil/session";

const EMPTY: Record<CanonicalSymbol, string> = { SOL: "0", USDC: "0" };
const MIN_REFRESH_MS = 8_000;
const INVALIDATE_DEBOUNCE_MS = 1_000;

type BalancesContextValue = {
  publicBalances: Record<CanonicalSymbol, string>;
  privateBalances: Record<CanonicalSymbol, string>;
  isLoading: boolean;
  error: string | null;
  refresh: (options?: { force?: boolean }) => Promise<void>;
};

const BalancesContext = createContext<BalancesContextValue | null>(null);

export function BalancesProvider({ children }: { children: React.ReactNode }) {
  const { publicKey, connected } = useWallet();
  const { token, isAuthenticated } = useMagicBlockAuth();
  const [publicBalances, setPublicBalances] =
    useState<Record<CanonicalSymbol, string>>(EMPTY);
  const [privateBalances, setPrivateBalances] =
    useState<Record<CanonicalSymbol, string>>(EMPTY);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lastFetchedAt = useRef(0);
  const inflight = useRef<Promise<void> | null>(null);
  const invalidateTimer = useRef<number | null>(null);

  const refresh = useCallback(
    async (options?: { force?: boolean }) => {
      if (!publicKey) return;

      const force = options?.force ?? false;
      const now = Date.now();
      if (!force && now - lastFetchedAt.current < MIN_REFRESH_MS) {
        return inflight.current ?? undefined;
      }

      if (inflight.current) {
        return inflight.current;
      }

      const run = async () => {
        setIsLoading(true);
        setError(null);

        const owner = publicKey.toBase58();
        const errors: string[] = [];
        let solLamports = "0";
        let usdcPublic = "0";

        try {
          solLamports = await getNativeSolLamports(owner);
        } catch (err) {
          errors.push(
            err instanceof Error ? err.message : "Failed to load SOL balance",
          );
        }

        try {
          usdcPublic = await getPublicTokenBalance(owner, TOKENS.USDC.mint);
        } catch (err) {
          errors.push(
            err instanceof Error ? err.message : "Failed to load USDC balance",
          );
        }

        setPublicBalances({
          SOL: fromBaseUnits(solLamports, TOKENS.SOL.decimals),
          USDC: fromBaseUnits(usdcPublic, TOKENS.USDC.decimals),
        });

        if (errors.length > 0) {
          setError(errors.join(" · "));
        }

        if (!token || !isAuthenticated) {
          setPrivateBalances(EMPTY);
          lastFetchedAt.current = Date.now();
          setIsLoading(false);
          inflight.current = null;
          return;
        }

        try {
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
          lastFetchedAt.current = Date.now();
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Failed to load shielded balances";
          setError((prev) => (prev ? `${prev} · ${message}` : message));
        } finally {
          setIsLoading(false);
          inflight.current = null;
        }
      };

      inflight.current = run();
      return inflight.current;
    },
    [publicKey, token, isAuthenticated],
  );

  useEffect(() => {
    if (!connected || !publicKey) {
      setPublicBalances(EMPTY);
      setPrivateBalances(EMPTY);
      setError(null);
      lastFetchedAt.current = 0;
      return;
    }
    void refresh({ force: true });
  }, [connected, publicKey, token, isAuthenticated, refresh]);

  useEffect(() => {
    const onInvalidate = () => {
      if (!connected || !publicKey) return;
      if (invalidateTimer.current) {
        window.clearTimeout(invalidateTimer.current);
      }
      invalidateTimer.current = window.setTimeout(() => {
        void refresh({ force: true });
      }, INVALIDATE_DEBOUNCE_MS);
    };

    window.addEventListener(VEIL_BALANCES_EVENT, onInvalidate);
    return () => {
      window.removeEventListener(VEIL_BALANCES_EVENT, onInvalidate);
      if (invalidateTimer.current) {
        window.clearTimeout(invalidateTimer.current);
      }
    };
  }, [connected, publicKey, refresh]);

  const value = useMemo(
    () => ({
      publicBalances,
      privateBalances,
      isLoading,
      error,
      refresh,
    }),
    [publicBalances, privateBalances, isLoading, error, refresh],
  );

  return (
    <BalancesContext.Provider value={value}>
      {children}
    </BalancesContext.Provider>
  );
}

export function useBalances(): BalancesContextValue {
  const context = useContext(BalancesContext);
  if (!context) {
    throw new Error("useBalances must be used within BalancesProvider");
  }
  return context;
}