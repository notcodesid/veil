"use client";

// Phase 5 — poll GET /v1/swap/quote every 2s
export function usePriceStream() {
  return {
    quote: null,
    lastUpdated: null as number | null,
    isStale: true,
    error: null as string | null,
  };
}