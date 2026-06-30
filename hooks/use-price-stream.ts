"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  TOKENS,
  type CanonicalSymbol,
  fromBaseUnits,
} from "@/lib/constants/tokens";
import { formatAmount } from "@/lib/format/display";
import {
  DEFAULT_SWAP_SLIPPAGE_BPS,
  getSwapQuote,
  type SwapQuote,
} from "@/lib/magicblock/swap";

const POLL_MS = 2000;
const STALE_MS = 5_000;

type UsePriceStreamArgs = {
  inputMint: string;
  outputMint: string;
  inputSymbol: CanonicalSymbol;
  outputSymbol: CanonicalSymbol;
  amountBaseUnits: string | null;
  enabled: boolean;
};

function getRatePerUnit(
  quote: SwapQuote,
  inputDecimals: number,
  outputDecimals: number,
): number {
  const inVal = Number(quote.inAmount) / 10 ** inputDecimals;
  const outVal = Number(quote.outAmount) / 10 ** outputDecimals;
  if (inVal === 0) return 0;
  return outVal / inVal;
}

export function usePriceStream({
  inputMint,
  outputMint,
  inputSymbol,
  outputSymbol,
  amountBaseUnits,
  enabled,
}: UsePriceStreamArgs) {
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const refresh = useCallback(async (): Promise<SwapQuote | null> => {
    if (!amountBaseUnits || amountBaseUnits === "0") {
      setQuote(null);
      setError(null);
      return null;
    }

    setIsLoading(true);
    try {
      const next = await getSwapQuote({
        inputMint,
        outputMint,
        amount: amountBaseUnits,
        slippageBps: DEFAULT_SWAP_SLIPPAGE_BPS,
      });
      setQuote(next);
      setLastUpdated(Date.now());
      setError(null);
      return next;
    } catch (err) {
      setQuote(null);
      setError(err instanceof Error ? err.message : "Quote failed");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [amountBaseUnits, inputMint, outputMint]);

  useEffect(() => {
    if (!enabled) return;

    void refresh();
    const id = window.setInterval(() => void refresh(), POLL_MS);
    return () => window.clearInterval(id);
  }, [enabled, refresh]);

  useEffect(() => {
    if (!enabled || !lastUpdated) return;

    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [enabled, lastUpdated]);

  const isStale = useMemo(() => {
    if (!lastUpdated) return true;
    return now - lastUpdated > STALE_MS;
  }, [lastUpdated, now]);

  const estimatedOut = quote
    ? fromBaseUnits(quote.outAmount, TOKENS[outputSymbol].decimals)
    : null;

  const rateLabel = useMemo(() => {
    if (!quote) return null;
    const rate = getRatePerUnit(
      quote,
      TOKENS[inputSymbol].decimals,
      TOKENS[outputSymbol].decimals,
    );
    return `1 ${inputSymbol} ≈ ${formatAmount(rate)} ${outputSymbol}`;
  }, [quote, inputSymbol, outputSymbol]);

  const secondsAgo = lastUpdated
    ? Math.max(0, Math.floor((now - lastUpdated) / 1000))
    : null;

  return {
    quote,
    lastUpdated,
    secondsAgo,
    isStale,
    isLoading,
    error,
    estimatedOut,
    rateLabel,
    slippageBps: DEFAULT_SWAP_SLIPPAGE_BPS,
    refresh,
  };
}